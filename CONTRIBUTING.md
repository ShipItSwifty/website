# Contributing to ShipItSwifty Website

Thanks for your interest in contributing! Here's how to get started.

## Prerequisites

- **Node.js 24+**
- **pnpm 10** (enabled via Corepack: `corepack enable`)

## Setup

```bash
pnpm install
pnpm dev
```

The dev server runs at `http://localhost:3000`.

## Before Submitting a PR

Run the full CI gate locally:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

All three must pass.

## Formatting

```bash
pnpm format        # auto-fix
pnpm format:check  # check only
```

## Writing Docs

Docs live in `src/content/docs/` as MDX files with frontmatter:

```yaml
---
title: Page Title
description: Short description for SEO
group: getting-started # folder group
order: 2 # sort order within group
---
```

## Data Sync

Some content is synced from upstream sources:

```bash
pnpm sync:changelog   # changelog from GitHub releases
pnpm sync:docs        # DocC/upstream docs (requires network)
pnpm sync:docs:local  # local DocC export
```

These generate files in `data/` which are gitignored — the build runs sync automatically.

## Project Structure

```
src/
├── app/           # Next.js App Router pages & layouts
├── components/    # React components (marketing/, docs/, ui/)
├── content/       # MDX documentation source
├── lib/           # Utilities, search index, MDX pipeline
└── styles/        # Global CSS & Tailwind config
```

## Reporting Issues

Open an issue on GitHub with steps to reproduce, expected vs. actual behavior, and your environment.

## License

By contributing, you agree your work is licensed under the [MIT License](./LICENSE).
