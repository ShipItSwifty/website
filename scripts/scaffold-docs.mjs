#!/usr/bin/env node
/**
 * One-time scaffold: copy upstream `docs/*.md` into `src/content/docs/<group>/`
 * with frontmatter prepended, so Edit-on-GitHub points back to upstream and
 * future docs sync can be automated.
 *
 * Run with: node scripts/scaffold-docs.mjs
 *
 * Subsequent edits to upstream are NOT auto-pulled — that's intentional for
 * v1 (we want hand-curated content). To re-sync, delete the file in
 * src/content/docs and re-run this script.
 */
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { resolve, dirname } from "node:path";

const UPSTREAM = process.env.SHIPITSWIFTY_PATH || "../ShipItSwifty";
const CONTENT_ROOT = resolve(process.cwd(), "src/content/docs");

const MAPPING = [
  // [upstream relative path, content slug, group, order, title, description]
  [
    "README.md",
    "getting-started/quick-start.mdx",
    "Getting Started",
    1,
    "Quick Start",
    "Install ShipItSwifty and ship your first build in minutes.",
    { mode: "readme-quickstart" },
  ],
  [
    "docs/walkthrough.md",
    "getting-started/walkthrough.mdx",
    "Getting Started",
    2,
    "Walkthrough",
    "Step-by-step tour from project init to a successful TestFlight upload.",
  ],
  [
    "docs/android-quickstart.md",
    "getting-started/android-quickstart.mdx",
    "Getting Started",
    3,
    "Android Quickstart",
    "Set up Gradle builds, test runs, and Play Store uploads with shipit.",
  ],
  [
    "docs/features.md",
    "getting-started/migrating-from-fastlane.mdx",
    "Getting Started",
    4,
    "Migrating from fastlane",
    "Lane-by-lane mapping from fastlane to shipit equivalents.",
    { mode: "fastlane-migration" },
  ],
  [
    "docs/ci-setup.md",
    "guides/ci-setup.mdx",
    "Guides",
    1,
    "CI Setup",
    "Run shipit on GitHub Actions, Bitrise, and self-hosted runners.",
  ],
  [
    "docs/security.md",
    "guides/code-signing.mdx",
    "Guides",
    2,
    "Code Signing & Security",
    "Manage certs, profiles, and secrets safely with shipit.",
  ],
  [
    "docs/plugin-development.md",
    "guides/plugin-development.mdx",
    "Guides",
    3,
    "Plugin Development",
    "Extend shipit with custom actions written in Swift.",
  ],
  [
    "docs/configuration-reference.md",
    "reference/configuration.mdx",
    "Reference",
    1,
    "Configuration Reference",
    "Every key in Shipfile.yml, with defaults and examples.",
  ],
];

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

function escapeYaml(s) {
  return String(s).replace(/"/g, '\\"');
}

async function fileFrontmatter(upstreamRel, slug, group, order, title, description) {
  return `---
title: "${escapeYaml(title)}"
description: "${escapeYaml(description)}"
group: "${group}"
order: ${order}
sourcePath: "upstream:${upstreamRel}"
---

`;
}

async function transformReadmeQuickStart(raw) {
  // Trim README to the relevant install + quick start sections.
  const start = raw.indexOf("## Quick Start");
  const end = raw.indexOf("## Configuration");
  if (start === -1 || end === -1) return raw;
  return raw.slice(start, end).trim() + "\n";
}

async function transformFastlaneMigration(raw) {
  // Use features.md but prepend a migration table that mirrors the marketing strip.
  const intro = `## Why migrate?

ShipItSwifty replaces a Ruby toolchain with a single Swift binary. No Gemfile, no Bundler, no plugin compatibility matrix — just one CLI you can install via Homebrew or build from source.

## Lane-by-lane mapping

| fastlane | shipit |
|---|---|
| \`match\` | \`shipit sign sync\` |
| \`gym\` | \`shipit archive\` + \`shipit export\` |
| \`pilot\` | \`shipit testflight\` |
| \`deliver\` | \`shipit metadata\` + \`shipit upload\` |
| \`scan\` | \`shipit test\` |
| \`snapshot\` | \`shipit screenshot\` |
| \`frameit\` | \`shipit screenshot --frame\` |
| \`pem\` | covered by ASC API integration |
| \`produce\` | covered by ASC API integration |

## What you get from shipit

`;
  return intro + raw;
}

async function copyOne(entry) {
  const [upstreamRel, slug, group, order, title, description, opts] = entry;
  const src = resolve(UPSTREAM, upstreamRel);
  const dst = resolve(CONTENT_ROOT, slug);
  if (!(await exists(src))) {
    console.warn(`[scaffold-docs] source missing: ${src} — skipping ${slug}`);
    return;
  }
  if (await exists(dst)) {
    console.log(`[scaffold-docs] exists, skipping: ${slug}`);
    return;
  }
  let raw = await readFile(src, "utf8");
  if (opts?.mode === "readme-quickstart") raw = await transformReadmeQuickStart(raw);
  if (opts?.mode === "fastlane-migration") raw = await transformFastlaneMigration(raw);

  const fm = await fileFrontmatter(upstreamRel, slug, group, order, title, description);
  await mkdir(dirname(dst), { recursive: true });
  await writeFile(dst, fm + raw);
  console.log(`[scaffold-docs] wrote ${slug}`);
}

async function writeIndex() {
  const indexPath = resolve(CONTENT_ROOT, "index.mdx");
  if (await exists(indexPath)) return;
  const body = `---
title: "Documentation"
description: "Guides, references, and the ShipItKit API for ShipItSwifty."
group: "Getting Started"
order: 0
---

Welcome to the **ShipItSwifty** documentation.

ShipItSwifty is a Swift-native CLI for iOS and Android release automation. These docs cover everything from installing the binary to writing custom plugins.

## Where to start

- New here? Begin with the [Quick Start](/docs/getting-started/quick-start).
- Coming from fastlane? Read the [migration guide](/docs/getting-started/migrating-from-fastlane).
- Setting up CI? See the [CI Setup guide](/docs/guides/ci-setup).
- Looking for the full Shipfile schema? Open the [Configuration Reference](/docs/reference/configuration).
- Need the Swift API? Browse the [API Reference](/docs/api).

## Versioning

The docs in this site track the latest published release of \`shipit\`. The Swift API reference is regenerated automatically on every release.
`;
  await writeFile(indexPath, body);
  console.log("[scaffold-docs] wrote index.mdx");
}

async function writeApiIndex() {
  const dst = resolve(CONTENT_ROOT, "api/index.mdx");
  if (await exists(dst)) return;
  const body = `---
title: "API Reference"
description: "ShipItKit Swift API — generated from DocC and rendered natively here."
group: "API Reference"
order: 1
---

The **ShipItKit** Swift API is the embeddable library that powers the \`shipit\` CLI. Use it from your own Swift tools, CI scripts, or Swift Package Manager projects.

## Getting started

Add the dependency to your \`Package.swift\`:

\`\`\`swift
dependencies: [
  .package(
    url: "https://github.com/ShipItSwifty/shipitswifty.git",
    from: "1.0.0"
  )
]
\`\`\`

## Browse the API

The full API reference is generated from DocC on every release and rendered into this site. Browse the symbol tree on the left, or jump straight to the entry point: <a href="/docs/api/shipitkit">\`ShipItKit\`</a>.

> **Note**
> The API browser comes online once a \`docs-*\` release has been published on the website repo. While that's in progress, this page is the only thing you'll see. Check back after the next release.
`;
  await mkdir(dirname(dst), { recursive: true });
  await writeFile(dst, body);
  console.log("[scaffold-docs] wrote api/index.mdx");
}

async function main() {
  for (const entry of MAPPING) {
    await copyOne(entry);
  }
  await writeIndex();
  await writeApiIndex();
}

main().catch((err) => {
  console.error("[scaffold-docs] failed:", err.message);
  process.exit(1);
});
