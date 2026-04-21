#!/usr/bin/env node
/**
 * scripts/build-docc.mjs
 *
 * macOS-only. Clones the upstream ShipItSwifty repo at a given tag (defaults
 * to the latest published release), runs `swift package generate-documentation`
 * to produce DocC's static-hosting output, then strips DocC's HTML/CSS/JS and
 * keeps only the structured JSON we render natively (data/, index/,
 * metadata.json). Tarballs the result as `docc-<tag>.tar.gz` for upload as a
 * GitHub release asset on the website repo.
 *
 * Inputs (env):
 *   TAG              — upstream release tag (e.g. v1.2.3). If unset, queries
 *                      GitHub for the latest non-prerelease tag.
 *   GITHUB_TOKEN     — optional. Avoids unauthenticated rate limiting.
 *   WORK_DIR         — workspace dir (default: ./.docc-build)
 *   OUTPUT_DIR       — final website data dir (default: ./data/docc)
 *   TARBALL_PATH     — final tarball path (default: ./docc-<tag>.tar.gz)
 *
 * Exit codes:
 *   0  success
 *   1  swift / docc invocation failed
 *   2  upstream metadata fetch failed
 *   3  unsupported platform (non-darwin)
 */
import { execSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, cpSync } from "node:fs";
import { join, resolve } from "node:path";
import { platform } from "node:os";

const UPSTREAM_REPO = "ShipItSwifty/shipitswifty";
const UPSTREAM_GIT = `https://github.com/${UPSTREAM_REPO}.git`;
const TARGET = "ShipItKit";

if (platform() !== "darwin") {
  console.error("[build-docc] must run on macOS (needs Xcode + swift-docc-plugin)");
  process.exit(3);
}

const WORK_DIR = resolve(process.env.WORK_DIR ?? "./.docc-build");
const OUTPUT_DIR = resolve(process.env.OUTPUT_DIR ?? "./data/docc");

async function fetchLatestTag() {
  const headers = { "User-Agent": "shipitswifty-website-build" };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const res = await fetch(`https://api.github.com/repos/${UPSTREAM_REPO}/releases/latest`, {
    headers,
  });
  if (!res.ok) {
    console.error(`[build-docc] failed to fetch latest release: ${res.status}`);
    process.exit(2);
  }
  const data = await res.json();
  return data.tag_name;
}

function run(cmd, args, opts = {}) {
  console.log(`[build-docc] $ ${cmd} ${args.join(" ")}`);
  const r = spawnSync(cmd, args, { stdio: "inherit", ...opts });
  if (r.status !== 0) {
    console.error(`[build-docc] command failed (${r.status})`);
    process.exit(1);
  }
}

const tag = process.env.TAG ?? (await fetchLatestTag());
console.log(`[build-docc] target tag: ${tag}`);

// Clean workspace
if (existsSync(WORK_DIR)) rmSync(WORK_DIR, { recursive: true, force: true });
mkdirSync(WORK_DIR, { recursive: true });
const repoDir = join(WORK_DIR, "shipitswifty");

run("git", ["clone", "--depth", "1", "--branch", tag, UPSTREAM_GIT, repoDir]);

const doccOut = join(repoDir, "docs-output");
mkdirSync(doccOut, { recursive: true });

run(
  "swift",
  [
    "package",
    "--allow-writing-to-directory",
    doccOut,
    "generate-documentation",
    "--target",
    TARGET,
    "--disable-indexing",
    "--transform-for-static-hosting",
    "--output-path",
    doccOut,
  ],
  { cwd: repoDir },
);

// Keep only data/, index/, metadata.json — discard HTML/CSS/JS
if (existsSync(OUTPUT_DIR)) rmSync(OUTPUT_DIR, { recursive: true, force: true });
mkdirSync(OUTPUT_DIR, { recursive: true });

const SUBSETS = ["data", "index", "metadata.json"];
for (const s of SUBSETS) {
  const src = join(doccOut, s);
  if (!existsSync(src)) {
    console.error(`[build-docc] missing expected DocC output: ${s}`);
    process.exit(1);
  }
  cpSync(src, join(OUTPUT_DIR, s), { recursive: true });
}

const tarball = process.env.TARBALL_PATH ?? resolve(`./docc-${tag}.tar.gz`);
run("tar", ["-czf", tarball, "-C", resolve(OUTPUT_DIR, ".."), "docc"]);
console.log(`[build-docc] tarball: ${tarball}`);

// Stamp the tag for downstream consumers (release upload step)
console.log(`::set-output name=tag::${tag}`);
console.log(`::set-output name=tarball::${tarball}`);
console.log(`[build-docc] done`);

// Best-effort GitHub Actions output (modern syntax)
if (process.env.GITHUB_OUTPUT) {
  execSync(`printf 'tag=%s\\ntarball=%s\\n' '${tag}' '${tarball}' >> "$GITHUB_OUTPUT"`, {
    stdio: "inherit",
    shell: "/bin/bash",
  });
}
