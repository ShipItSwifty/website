#!/usr/bin/env node
/**
 * Pre-build orchestrator. Runs sync scripts in order before `next build`.
 * Each sync script is best-effort: if it fails, we log and continue so a
 * temporary GitHub outage does not block all builds.
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const scripts = [
  ["sync-docc.mjs", { required: false }],
  ["build-search-index.mjs", { required: true }],
];

for (const [script, opts] of scripts) {
  console.log(`\n[prebuild] running ${script}`);
  const r = spawnSync("node", [resolve(__dirname, script)], {
    stdio: "inherit",
    env: process.env,
  });
  if (r.status !== 0) {
    if (opts.required) {
      console.error(`[prebuild] ${script} failed (required) — aborting build.`);
      process.exit(r.status ?? 1);
    } else {
      console.warn(`[prebuild] ${script} failed (optional) — continuing.`);
    }
  }
}
