# shipitswifty.tools

Marketing site and documentation for [ShipItSwifty](https://github.com/ShipItSwifty/shipitswifty) — the Swift-native CLI for iOS &amp; Android release automation.

Deployed to **[shipitswifty.tools](https://shipitswifty.tools)** on Vercel.

## Stack

- **Next.js 16** (App Router, Turbopack, RSC) with TypeScript
- **Tailwind CSS v4** + design tokens (light + dark themes)
- **MDX** docs via `next-mdx-remote@6` with `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`, `rehype-pretty-code` (paired GitHub light + dark-dimmed themes via Shiki)
- **FlexSearch** — client-side ⌘K search over a build-time index
- **next/og** — statically-prerendered Open Graph image
- **next-themes** — light / dark / system, defaults to dark
- **Vercel Web Analytics + Speed Insights**
- **pnpm 10**, **Node 22+**

## Repo layout

```
src/
  app/                    # App Router routes
    layout.tsx            # fonts, theme, search, analytics
    page.tsx              # marketing home
    docs/                 # docs shell + catch-all MDX route
    changelog/            # release notes (from data/releases.json)
    sitemap.ts            # auto-generated sitemap
    robots.ts             # robots.txt
    opengraph-image.tsx   # 1200×630 OG card (static PNG)
  components/
    marketing/            # hero, overview, features, getting-started, footer, nav
    docs/                 # sidebar, toc, pager, callout, mdx-components
    search/               # FlexSearch ⌘K dialog + provider + trigger
    icons/                # custom SVGs (e.g. github)
  content/docs/           # MDX docs (frontmatter: title, description, group, order, sourcePath)
  lib/                    # site config, docs walker, toc extractor
data/
  releases.json           # synced from upstream GitHub Releases at build
  docc/                   # synced DocC JSON tarball (when available)
public/
  search-index.json       # built from MDX at build time (~57 KB)
scripts/
  prebuild.mjs            # orchestrator: runs all sync scripts before next build
  sync-changelog.mjs      # GitHub Releases → data/releases.json
  sync-docc.mjs           # downloads docs-* release tarball → data/docc/
  build-search-index.mjs  # MDX → public/search-index.json
.github/workflows/
  ci.yml                  # typecheck + lint + build on PR/push to main
```

## Local development

Requires **Node 22+** and **pnpm 10** (managed via Corepack). The repo uses `nodenv`/`fnm`-friendly `.nvmrc`.

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Other scripts:

```bash
pnpm build        # runs prebuild (sync scripts) then next build
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint .
pnpm format       # prettier --write .
pnpm format:check # prettier --check .

# manually re-run a sync step
pnpm sync:changelog
pnpm sync:docs        # downloads pre-built DocC tarball from website releases
pnpm sync:docs:local  # local dev: copies DocC JSON from a sibling ShipItSwifty checkout
                      # (set SHIPITSWIFTY_PATH; defaults to ../ShipItSwifty)
```

The `prebuild` script runs three things in order:

1. `sync-changelog.mjs` — fetches GitHub Releases (falls back to empty list)
2. `sync-docc.mjs` — downloads the latest `docs-*` release tarball (no-op until one exists)
3. `build-search-index.mjs` — walks `src/content/docs/**/*.mdx` and writes `public/search-index.json`

## Authoring docs

Drop new MDX files into `src/content/docs/<group>/<slug>.mdx`:

```mdx
---
title: My Page Title
description: Short subtitle shown under the H1 and used as <meta description>.
group: Guides # one of: Getting Started, Guides, Reference, API Reference
order: 3 # sort order within the group
sourcePath: upstream:docs/my-page.md
---

import { Callout } from "@/components/docs/callout";

## Heading

Body content.

<Callout type="info" title="Heads up">
  MDX components like Callout work out of the box.
</Callout>
```

Frontmatter notes:

- `group` is inferred from the directory if omitted (`getting-started/` → `Getting Started`, etc.).
- `sourcePath: "upstream:..."` links the **Edit on GitHub** button to the upstream CLI repo.
  Use `"website:..."` to link to a path inside this repo. Default is the MDX file itself in this repo.
- The route is the file path minus `.mdx`, with `index.mdx` collapsing to the directory.

After editing, the search index is regenerated on `pnpm build` (or `pnpm dev` after a rebuild).

## Theming

- Tokens live in `src/app/globals.css` as CSS variables under `:root` (light) and `:root.dark` (dark dimmed).
- Default theme is **dark**, configurable via `<ThemeProvider>` in `src/app/layout.tsx`.
- All colors are referenced via `var(--fg1)`, `var(--surface)`, `var(--brand)`, etc. — never hardcoded.

## Search

Cmd-K / Ctrl-K opens a FlexSearch-powered docs search. The index is built from MDX at build time and shipped as static JSON under `/search-index.json` (~57 KB). The dialog lazy-loads it on first open.

## Changelog

`/changelog` reads `data/releases.json` (populated by `sync-changelog.mjs` from `https://github.com/ShipItSwifty/shipitswifty/releases`). Release bodies are rendered through the same MDX pipeline as docs.

## Deployment

The site deploys to Vercel via the connected `ShipItSwifty/website` GitHub repo.

- **Production domain**: `shipitswifty.tools` (apex). Set up `www.shipitswifty.tools` → 308 redirect via the Vercel domain UI.
- **Build command**: `pnpm build` (Vercel detects automatically; `prebuild` runs sync scripts).
- **Node version**: `22` (set in `package.json#engines` and respected by Vercel).
- **Required env vars**:
  - `GITHUB_TOKEN` (optional but recommended) — boosts the GitHub API rate limit during `prebuild` (60 req/h anonymous → 5000 req/h authenticated). Read-only, public-repo scope is enough.
- **Cache + security headers**: see `vercel.json`.

### Triggering rebuilds from upstream

The site rebuilds automatically on push to `main`. To trigger a rebuild when the upstream CLI ships a new release (so the changelog and DocC pick it up), add **both** of these to the upstream's release workflow:

1. **Vercel Deploy Hook** — create one at _Settings → Git → Deploy Hooks_ in the Vercel dashboard, then `curl -X POST <hook-url>` from the upstream release job. Triggers a Vercel rebuild that picks up the latest GitHub release notes via `prebuild`.
2. **GitHub `repository_dispatch`** — POST to this repo's API with event type `upstream-release` (optionally `client_payload.tag`) to trigger `.github/workflows/build-docc.yml`. That workflow runs `swift package generate-documentation` against the upstream tag on a `macos-26` runner, strips DocC's HTML/CSS/JS, and uploads `docc-<tag>.tar.gz` as a `docs-<tag>` release asset on this repo. The next Vercel build picks it up via `scripts/sync-docc.mjs`.

   Required GitHub secret on the website repo for the dispatch flow:
   - `VERCEL_DEPLOY_HOOK_URL` (optional) — if set, the DocC workflow triggers a Vercel rebuild after publishing the asset, so docs go live without waiting for the next manual deploy.

These upstream hooks are not yet wired up — see the project planning notes for the exact upstream YAML snippets.

### DocC pipeline (advanced)

- `scripts/build-docc.mjs` — macOS-only. Clones upstream at a tag, runs `swift package generate-documentation`, keeps only `data/`, `index/`, `metadata.json`, and tarballs the result. Used by `.github/workflows/build-docc.yml`.
- `scripts/build-docc-local.mjs` (`pnpm sync:docs:local`) — local dev shortcut: copies the same JSON subset out of a sibling ShipItSwifty checkout's `docs-output/`. Lets you iterate on the DocC renderer without rebuilding Swift docs.
- `src/lib/docc.ts` — RenderNode types + loaders + reference resolver.
- `src/components/docs/api/` — pure React renderers for the DocC RenderNode schema. Code listings are highlighted by Shiki at build time using the same paired light/dark themes as the rest of the docs site.
- `/docs/api/shipitkit/[[...slug]]` — statically prerenders one page per symbol/article from `data/docc/`. The route group `(api)` swaps the docs sidebar for a navigator built from `data/docc/index/index.json`.

## Contributing

PRs welcome. Please run `pnpm lint && pnpm typecheck && pnpm build` before submitting. The CI workflow runs the same.

## License

MIT — see [LICENSE](./LICENSE).
