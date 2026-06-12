#!/usr/bin/env node
// Walks src/content/docs/**/*.{md,mdx}, splits each doc into searchable
// sections by H2/H3 headings, and writes public/search-index.json.
//
// Each entry:
//   { id, url, title, section, group, content }
//
// "id" is stable: `${href}#${slug}` (or just `${href}` for the page intro).
// "content" is plain-text (MDX/markdown stripped) and trimmed to ~600 chars.

import { promises as fs } from "node:fs";
import { join, relative } from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

const ROOT = process.cwd();
const CONTENT_ROOT = join(ROOT, "src/content/docs");
const DOCC_DOCS_ROOT = join(ROOT, "data/docc/data/documentation");
const OUT_FILE = join(ROOT, "public/search-index.json");

const GROUP_FROM_DIR = {
  "getting-started": "Getting Started",
  guides: "Guides",
  reference: "Reference",
  api: "API Reference",
};

async function walk(dir, acc = [], pattern = /\.(mdx|md)$/) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) await walk(full, acc, pattern);
    else if (e.isFile() && pattern.test(e.name)) acc.push(full);
  }
  return acc;
}

function slugifyFile(absPath) {
  const rel = relative(CONTENT_ROOT, absPath).replace(/\\/g, "/");
  const parts = rel.replace(/\.(mdx|md)$/, "").split("/");
  if (parts.at(-1) === "index") parts.pop();
  return parts;
}

// Strip MDX/markdown to plain text for indexing.
function toPlainText(md) {
  return (
    md
      // remove code fences entirely
      .replace(/```[\s\S]*?```/g, " ")
      // remove inline code backticks
      .replace(/`([^`]+)`/g, "$1")
      // remove import/export lines (MDX)
      .replace(/^\s*(import|export)\s.+$/gm, "")
      // remove JSX tags
      .replace(/<\/?[A-Za-z][^>]*>/g, " ")
      // images ![alt](src)
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
      // links [text](url)
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      // headings markers
      .replace(/^#{1,6}\s+/gm, "")
      // emphasis markers
      .replace(/[*_~]{1,3}/g, "")
      // blockquote markers
      .replace(/^>\s?/gm, "")
      // list bullets
      .replace(/^\s*[-*+]\s+/gm, "")
      .replace(/^\s*\d+\.\s+/gm, "")
      // horizontal rules
      .replace(/^-{3,}$/gm, " ")
      // collapse whitespace
      .replace(/\s+/g, " ")
      .trim()
  );
}

// Split a markdown body into sections by H2/H3.
// Returns [{ heading: string|null, depth: 1|2|3, body: string }]
// where the first section may have heading=null (intro).
function splitSections(body) {
  const lines = body.split("\n");
  const sections = [];
  let current = { heading: null, depth: 1, body: "" };
  let inFence = false;

  for (const line of lines) {
    if (/^```/.test(line)) {
      inFence = !inFence;
      current.body += line + "\n";
      continue;
    }
    if (!inFence) {
      const m = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
      if (m) {
        if (current.body.trim() || current.heading) sections.push(current);
        current = { heading: m[2].trim(), depth: m[1].length, body: "" };
        continue;
      }
    }
    current.body += line + "\n";
  }
  if (current.body.trim() || current.heading) sections.push(current);
  return sections;
}

function inferGroup(slugParts) {
  return GROUP_FROM_DIR[slugParts[0]] || "Reference";
}

// Flatten DocC inline fragments (abstract) to plain text.
function inlineToText(fragments) {
  if (!Array.isArray(fragments)) return "";
  return fragments
    .map((f) => {
      if (typeof f?.text === "string") return f.text;
      if (typeof f?.code === "string") return f.code;
      if (Array.isArray(f?.inlineContent)) return inlineToText(f.inlineContent);
      return "";
    })
    .join("")
    .trim();
}

// Index DocC API render nodes (data/docc/**) so API symbols are searchable.
// Mirrors the slug scheme of src/app/docs/(api)/api/shipitkit/[[...slug]].
async function buildDoccEntries() {
  const entries = [];
  const files = await walk(DOCC_DOCS_ROOT, [], /\.json$/);
  for (const file of files) {
    let node;
    try {
      node = JSON.parse(await fs.readFile(file, "utf8"));
    } catch {
      continue;
    }
    const title = node?.metadata?.title;
    if (!title) continue;
    const rel = relative(DOCC_DOCS_ROOT, file)
      .replace(/\\/g, "/")
      .replace(/\.json$/, "")
      .toLowerCase();
    // rel is "shipitkit" (module root) or "shipitkit/<...path>"
    const url = `/docs/api/${rel}`;
    entries.push({
      id: url,
      url,
      title,
      section: node?.metadata?.roleHeading ?? null,
      group: "API Reference",
      content: inlineToText(node?.abstract).slice(0, 600),
    });
  }
  return entries;
}

async function build() {
  const files = await walk(CONTENT_ROOT);
  /** @type {Array<{id:string,url:string,title:string,section:string|null,group:string,content:string}>} */
  const entries = [];

  for (const file of files) {
    const raw = await fs.readFile(file, "utf8");
    const { data, content } = matter(raw);
    const slugParts = slugifyFile(file);
    const href = `/docs${slugParts.length ? "/" + slugParts.join("/") : ""}`;
    const pageTitle = data.title || slugParts.at(-1) || "Untitled";
    const group = data.group || inferGroup(slugParts);

    const slugger = new GithubSlugger();
    const sections = splitSections(content);

    for (const sec of sections) {
      const plain = toPlainText(sec.body);
      if (!plain && !sec.heading) continue;
      const headingSlug = sec.heading ? slugger.slug(sec.heading) : null;
      const url = headingSlug ? `${href}#${headingSlug}` : href;
      entries.push({
        id: url,
        url,
        title: pageTitle,
        section: sec.heading,
        group,
        content: plain.slice(0, 600),
      });
    }
  }

  const apiEntries = await buildDoccEntries();
  entries.push(...apiEntries);

  await fs.mkdir(join(ROOT, "public"), { recursive: true });
  await fs.writeFile(OUT_FILE, `${JSON.stringify(entries, null, 2)}\n`);
  console.log(
    `[search-index] wrote ${entries.length} entries (${apiEntries.length} API) from ${files.length} docs to ${relative(
      ROOT,
      OUT_FILE,
    )}`,
  );
}

build().catch((err) => {
  console.error("[search-index] failed:", err);
  process.exit(1);
});
