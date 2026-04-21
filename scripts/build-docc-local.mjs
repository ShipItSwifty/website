#!/usr/bin/env node
/**
 * Local DocC seeder. Copies the JSON-only subset of an upstream
 * `docs-output/` directory into `data/docc/`, so the website can render
 * /docs/api/shipitkit/* during local development without needing a
 * published docs-* release tarball.
 *
 * Usage:
 *   SHIPITSWIFTY_PATH=../ShipItSwifty node scripts/build-docc-local.mjs
 *
 * Reads from $SHIPITSWIFTY_PATH/docs-output and copies:
 *   data/         → data/docc/data/
 *   index/        → data/docc/index/
 *   metadata.json → data/docc/metadata.json
 *
 * Discards everything else (HTML, CSS, JS, images bundled by DocC).
 */
import { promises as fs } from "node:fs";
import { join, resolve, relative } from "node:path";

const ROOT = process.cwd();
const SRC_BASE = resolve(ROOT, process.env.SHIPITSWIFTY_PATH || "../ShipItSwifty");
const SRC = join(SRC_BASE, "docs-output");
const DEST = join(ROOT, "data/docc");

const KEEP = ["data", "index", "metadata.json"];

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function rmrf(p) {
  await fs.rm(p, { recursive: true, force: true });
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  let count = 0;
  for (const e of entries) {
    const s = join(src, e.name);
    const d = join(dest, e.name);
    if (e.isDirectory()) {
      count += await copyDir(s, d);
    } else if (e.isFile()) {
      await fs.copyFile(s, d);
      count += 1;
    }
  }
  return count;
}

async function main() {
  if (!(await exists(SRC))) {
    console.error(
      `[docc-local] no docs-output at ${SRC}. Set SHIPITSWIFTY_PATH or run \`swift package generate-documentation\` first.`,
    );
    process.exit(1);
  }

  await fs.mkdir(DEST, { recursive: true });

  // Wipe stale subset.
  for (const name of KEEP) {
    await rmrf(join(DEST, name));
  }

  let totalFiles = 0;
  for (const name of KEEP) {
    const s = join(SRC, name);
    const d = join(DEST, name);
    if (!(await exists(s))) {
      console.warn(`[docc-local] missing ${name} in source — skipping`);
      continue;
    }
    const stat = await fs.stat(s);
    if (stat.isDirectory()) {
      const n = await copyDir(s, d);
      totalFiles += n;
      console.log(`[docc-local] copied ${name}/ (${n} files)`);
    } else {
      await fs.copyFile(s, d);
      totalFiles += 1;
      console.log(`[docc-local] copied ${name}`);
    }
  }

  console.log(`[docc-local] done — ${totalFiles} files copied to ${relative(ROOT, DEST)}/`);
}

main().catch((err) => {
  console.error("[docc-local] failed:", err);
  process.exit(1);
});
