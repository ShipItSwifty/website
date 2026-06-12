#!/usr/bin/env node
/**
 * scripts/build-docc.mjs
 *
 * macOS-only. Clones the upstream ShipItSwifty repo at a given tag (defaults
 * to the latest published release, then latest tag, then default branch), runs `swift package generate-documentation`
 * to produce DocC's static-hosting output, then strips DocC's HTML/CSS/JS and
 * keeps only the structured JSON we render natively (data/, index/,
 * metadata.json). Tarballs the result as `docc-<tag>.tar.gz` for upload as a
 * GitHub release asset on the website repo.
 *
 * Inputs (env):
 *   TAG              — upstream ref (e.g. v1.2.3 or main). If unset, queries
 *                      GitHub for the latest release, then latest tag, then
 *                      the repo default branch.
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
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, cpSync, appendFileSync } from "node:fs";
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

async function fetchDefaultBranch(headers) {
  const res = await fetch(`https://api.github.com/repos/${UPSTREAM_REPO}`, {
    headers,
  });
  if (!res.ok) {
    console.error(`[build-docc] failed to fetch repo metadata: ${res.status}`);
    process.exit(2);
  }
  const data = await res.json();
  return data.default_branch;
}

async function fetchLatestRef() {
  const headers = { "User-Agent": "shipitswifty-website-build" };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const releaseRes = await fetch(`https://api.github.com/repos/${UPSTREAM_REPO}/releases/latest`, {
    headers,
  });
  if (releaseRes.ok) {
    const data = await releaseRes.json();
    return data.tag_name;
  }

  if (releaseRes.status !== 404) {
    console.error(`[build-docc] failed to fetch latest release: ${releaseRes.status}`);
    process.exit(2);
  }

  const tagsRes = await fetch(`https://api.github.com/repos/${UPSTREAM_REPO}/tags?per_page=1`, {
    headers,
  });
  if (!tagsRes.ok) {
    console.error(`[build-docc] failed to fetch tags: ${tagsRes.status}`);
    process.exit(2);
  }

  const tags = await tagsRes.json();
  if (Array.isArray(tags) && tags.length > 0 && tags[0]?.name) {
    return tags[0].name;
  }

  return await fetchDefaultBranch(headers);
}

function run(cmd, args, opts = {}) {
  console.log(`[build-docc] $ ${cmd} ${args.join(" ")}`);
  const r = spawnSync(cmd, args, { stdio: "inherit", ...opts });
  if (r.status !== 0) {
    console.error(`[build-docc] command failed (${r.status})`);
    process.exit(1);
  }
}

// `||` (not `??`): CI passes TAG="" when no override is given, which should
// also fall back to resolving the latest ref.
const tag = process.env.TAG || (await fetchLatestRef());
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

// Stamp the tag for downstream consumers (release upload step). Written
// directly — never through a shell — so a hostile tag name can't inject.
if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `tag=${tag}\ntarball=${tarball}\n`);
}
console.log(`[build-docc] done`);
