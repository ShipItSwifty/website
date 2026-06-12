import { promises as fs } from "node:fs";
import { join, relative } from "node:path";
import matter from "gray-matter";

export interface DocFrontmatter {
  title: string;
  description?: string;
  group?: string;
  order?: number;
  sourcePath?: string; // points to the upstream source for "edit on github"
}

export interface DocPage {
  slug: string[]; // relative slug e.g. ["getting-started", "quick-start"]
  href: string; // /docs/<slug>
  filePath: string; // absolute path to MDX file
  frontmatter: DocFrontmatter;
}

export interface DocGroup {
  title: string;
  order: number;
  pages: DocPage[];
}

const CONTENT_ROOT = join(process.cwd(), "src/content/docs");

const GROUP_ORDER: Record<string, number> = {
  "Getting Started": 0,
  Guides: 1,
  Reference: 2,
  "API Reference": 3,
};

const GROUP_FROM_DIR: Record<string, string> = {
  "getting-started": "Getting Started",
  guides: "Guides",
  reference: "Reference",
  api: "API Reference",
};

async function walk(dir: string, acc: string[] = []): Promise<string[]> {
  let entries: import("node:fs").Dirent[];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      await walk(full, acc);
    } else if (e.isFile() && (e.name.endsWith(".mdx") || e.name.endsWith(".md"))) {
      acc.push(full);
    }
  }
  return acc;
}

export async function getAllDocPages(): Promise<DocPage[]> {
  const files = await walk(CONTENT_ROOT);
  const pages: DocPage[] = [];
  for (const filePath of files) {
    const raw = await fs.readFile(filePath, "utf8");
    const { data } = matter(raw);
    const rel = relative(CONTENT_ROOT, filePath).replace(/\\/g, "/");
    const slugParts = rel.replace(/\.(mdx|md)$/, "").split("/");
    if (slugParts.at(-1) === "index") slugParts.pop();
    const front = data as DocFrontmatter;
    pages.push({
      slug: slugParts,
      href: `/docs${slugParts.length ? "/" + slugParts.join("/") : ""}`,
      filePath,
      frontmatter: {
        title: front.title || slugParts.at(-1) || "Untitled",
        description: front.description,
        group: front.group || inferGroup(slugParts),
        order: typeof front.order === "number" ? front.order : 99,
        sourcePath: front.sourcePath,
      },
    });
  }
  return pages.sort((a, b) => {
    const ag = (a.frontmatter.group || "") as string;
    const bg = (b.frontmatter.group || "") as string;
    if (ag !== bg) return (GROUP_ORDER[ag] ?? 99) - (GROUP_ORDER[bg] ?? 99);
    return (a.frontmatter.order ?? 99) - (b.frontmatter.order ?? 99);
  });
}

function inferGroup(slugParts: string[]): string {
  const dir = slugParts[0];
  return GROUP_FROM_DIR[dir] || "Reference";
}

export async function getDocBySlug(slug: string[]): Promise<DocPage | null> {
  const all = await getAllDocPages();
  const target = slug.join("/");
  return all.find((p) => p.slug.join("/") === target) ?? null;
}

export async function getDocSource(
  page: DocPage,
): Promise<{ content: string; data: DocFrontmatter }> {
  const raw = await fs.readFile(page.filePath, "utf8");
  const { content, data } = matter(raw);
  return { content, data: data as DocFrontmatter };
}

export async function getDocGroups(): Promise<DocGroup[]> {
  const pages = await getAllDocPages();
  const groups = new Map<string, DocGroup>();
  for (const p of pages) {
    const g = p.frontmatter.group || "Reference";
    if (!groups.has(g)) {
      groups.set(g, { title: g, order: GROUP_ORDER[g] ?? 99, pages: [] });
    }
    groups.get(g)!.pages.push(p);
  }
  return [...groups.values()].sort((a, b) => a.order - b.order);
}

export async function getAdjacentDocs(slug: string[]): Promise<{
  prev: DocPage | null;
  next: DocPage | null;
}> {
  const all = await getAllDocPages();
  const idx = all.findIndex((p) => p.slug.join("/") === slug.join("/"));
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}
