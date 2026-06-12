#!/usr/bin/env node
/**
 * Downloads the DocC archive for ShipItKit from the latest "docs-*" release on
 * the website repo (built by .github/workflows/build-docc.yml on macOS).
 *
 * The archive contains DocC's structured JSON (data/, index/, metadata.json) —
 * everything else is discarded by the builder. We render it through our own
 * components in src/app/docs/api/.
 *
 * In local dev, set SHIPITSWIFTY_PATH to a sibling checkout to skip the API
 * fetch entirely; the builder workflow does the same step locally.
 *
 * For now this is a graceful no-op when no asset is available — the website
 * still builds; the /docs/api page renders a "coming soon" state.
 */
import { mkdir, writeFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const WEBSITE_REPO = process.env.WEBSITE_REPO || "ShipItSwifty/website";
const OUT_DIR = resolve(process.cwd(), "data/docc");
const VERSION_FILE = resolve(OUT_DIR, ".version");

async function main() {
  const headers = {
    accept: "application/vnd.github+json",
    "x-github-api-version": "2022-11-28",
    "user-agent": "shipitswifty-website-build",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.authorization = `Bearer ${token}`;

  console.log(`[sync-docc] looking for latest docs-* release on ${WEBSITE_REPO}…`);
  const res = await fetch(`https://api.github.com/repos/${WEBSITE_REPO}/releases?per_page=30`, {
    headers,
  });
  if (!res.ok) {
    if (res.status === 404) {
      console.warn(`[sync-docc] ${WEBSITE_REPO} has no releases yet — leaving DocC empty.`);
      await ensureEmpty();
      return;
    }
    throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  }
  const releases = await res.json();
  const docsRelease = releases.find(
    (r) => !r.draft && r.tag_name && r.tag_name.startsWith("docs-"),
  );

  if (!docsRelease) {
    console.warn("[sync-docc] no docs-* release found — leaving DocC empty.");
    await ensureEmpty();
    return;
  }

  const asset = docsRelease.assets.find(
    (a) => a.name.endsWith(".tar.gz") || a.name.endsWith(".zip"),
  );
  if (!asset) {
    console.warn(`[sync-docc] release ${docsRelease.tag_name} has no asset — skipping.`);
    await ensureEmpty();
    return;
  }

  console.log(`[sync-docc] found ${docsRelease.tag_name} → ${asset.name}`);
  console.log(`[sync-docc] downloading ${asset.browser_download_url}`);

  const downloadRes = await fetch(asset.browser_download_url, {
    headers: { ...headers, accept: "application/octet-stream" },
    redirect: "follow",
  });
  if (!downloadRes.ok) {
    throw new Error(`Asset download failed: ${downloadRes.status}`);
  }
  const buf = Buffer.from(await downloadRes.arrayBuffer());

  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  const tmpFile = resolve(OUT_DIR, `__archive${asset.name.endsWith(".zip") ? ".zip" : ".tar.gz"}`);
  await writeFile(tmpFile, buf);

  // Extract via system tools to avoid shipping tar/zip libs.
  const { spawnSync } = await import("node:child_process");
  const isZip = asset.name.endsWith(".zip");

  // Refuse archives with absolute or parent-escaping entry paths so a
  // tampered release asset can't write outside data/docc.
  const list = isZip
    ? spawnSync("unzip", ["-Z1", tmpFile], { encoding: "utf8" })
    : spawnSync("tar", ["-tzf", tmpFile], { encoding: "utf8" });
  if (list.status !== 0) throw new Error("Could not list archive contents");
  const unsafe = list.stdout
    .split("\n")
    .filter(Boolean)
    .filter((p) => p.startsWith("/") || p.split("/").includes(".."));
  if (unsafe.length > 0) {
    throw new Error(`Archive contains unsafe paths: ${unsafe.slice(0, 3).join(", ")}`);
  }

  const r = isZip
    ? spawnSync("unzip", ["-q", tmpFile, "-d", OUT_DIR], { stdio: "inherit" })
    : spawnSync("tar", ["-xzf", tmpFile, "-C", OUT_DIR], { stdio: "inherit" });
  if (r.status !== 0) throw new Error("Extraction failed");
  await rm(tmpFile);

  await writeFile(
    VERSION_FILE,
    JSON.stringify(
      {
        upstreamTag: docsRelease.body?.match(/upstream:\s*(\S+)/)?.[1] || null,
        docsTag: docsRelease.tag_name,
        publishedAt: docsRelease.published_at,
        fetchedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
  );
  console.log(`[sync-docc] extracted to ${OUT_DIR}`);
}

async function ensureEmpty() {
  if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true });
  if (!existsSync(VERSION_FILE)) {
    await writeFile(
      VERSION_FILE,
      JSON.stringify(
        { upstreamTag: null, docsTag: null, fetchedAt: new Date().toISOString() },
        null,
        2,
      ),
    );
  }
}

main().catch((err) => {
  console.error("[sync-docc] failed:", err.message);
  process.exit(1);
});
