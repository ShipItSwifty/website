#!/usr/bin/env node
/**
 * Fetches the latest releases from the upstream ShipItSwifty CLI repo and
 * writes them to data/releases.json for use by the /changelog page.
 *
 * Auth: optional GITHUB_TOKEN. Without it we get 60 req/hr unauthenticated.
 * One call is fine in dev; CI should set the token.
 */
import { writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const REPO = process.env.SHIPITSWIFTY_REPO || "ShipItSwifty/shipitswifty";
const OUT = resolve(process.cwd(), "data/releases.json");

async function main() {
  const headers = {
    accept: "application/vnd.github+json",
    "x-github-api-version": "2022-11-28",
    "user-agent": "shipitswifty-website-build",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.authorization = `Bearer ${token}`;

  console.log(`[sync-changelog] fetching releases from ${REPO}…`);
  const res = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=100`, {
    headers,
  });
  if (!res.ok) {
    if (res.status === 404) {
      console.warn(`[sync-changelog] ${REPO} has no public releases yet — writing empty list.`);
      await mkdir(resolve(process.cwd(), "data"), { recursive: true });
      await writeFile(
        OUT,
        JSON.stringify({ releases: [], fetchedAt: new Date().toISOString() }, null, 2),
      );
      return;
    }
    throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  }
  const releases = await res.json();
  const sanitized = releases
    .filter((r) => !r.draft)
    .map((r) => ({
      id: r.id,
      tag: r.tag_name,
      name: r.name || r.tag_name,
      url: r.html_url,
      publishedAt: r.published_at,
      prerelease: r.prerelease,
      body: r.body || "",
    }));

  await mkdir(resolve(process.cwd(), "data"), { recursive: true });
  await writeFile(
    OUT,
    JSON.stringify({ releases: sanitized, fetchedAt: new Date().toISOString() }, null, 2),
  );
  console.log(`[sync-changelog] wrote ${sanitized.length} releases → ${OUT}`);
}

main().catch((err) => {
  console.error("[sync-changelog] failed:", err.message);
  process.exit(1);
});
