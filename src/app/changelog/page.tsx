import type { Metadata } from "next";
import { promises as fs } from "node:fs";
import { join } from "node:path";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { Nav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";
import { mdxComponents } from "@/components/docs/mdx-components";
import { siteConfig } from "@/lib/site";
import { ExternalLink } from "lucide-react";
import { GithubIcon as Github } from "@/components/icons/github";

interface Release {
  id: number;
  tag: string;
  name: string;
  url: string;
  publishedAt: string;
  prerelease: boolean;
  body: string;
}

interface ReleasesFile {
  releases: Release[];
  fetchedAt: string;
}

export const metadata: Metadata = {
  title: "Changelog",
  description: `Release notes for ${siteConfig.name}, generated from upstream GitHub Releases.`,
  alternates: { canonical: `${siteConfig.url}/changelog` },
};

async function loadReleases(): Promise<ReleasesFile> {
  const file = join(process.cwd(), "data/releases.json");
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as ReleasesFile;
  } catch {
    return { releases: [], fetchedAt: new Date().toISOString() };
  }
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default async function ChangelogPage() {
  const { releases } = await loadReleases();

  return (
    <>
      <Nav />
      <main id="main-content" className="mx-auto max-w-[820px] px-6 py-16">
        <header className="mb-12">
          <div
            className="mb-3 text-[12px] font-medium tracking-[0.08em] uppercase"
            style={{ color: "var(--brand)" }}
          >
            Releases
          </div>
          <h1
            className="mb-3 text-[40px] font-bold tracking-[-0.025em]"
            style={{ fontFamily: "var(--font-display)", color: "var(--fg1)" }}
          >
            Changelog
          </h1>
          <p className="text-[17px] leading-[1.65]" style={{ color: "var(--fg2)" }}>
            Release notes generated from{" "}
            <a
              href={`${siteConfig.github.cli}/releases`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
              style={{ color: "var(--fg1)" }}
            >
              GitHub Releases
            </a>{" "}
            on every build.
          </p>
        </header>

        {releases.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-16">
            {releases.map((r) => (
              <ReleaseEntry key={r.id} release={r} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

function EmptyState() {
  return (
    <div
      className="rounded-xl px-6 py-12 text-center"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <div
        className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full"
        style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--fg3)" }}
        aria-hidden="true"
      >
        <Github size={20} />
      </div>
      <h2
        className="mb-2 text-[18px] font-semibold"
        style={{ color: "var(--fg1)", fontFamily: "var(--font-display)" }}
      >
        No releases yet
      </h2>
      <p
        className="mx-auto max-w-[440px] text-[14px] leading-[1.6]"
        style={{ color: "var(--fg2)" }}
      >
        Once {siteConfig.name} ships its first public release, the notes will appear here
        automatically.
      </p>
      <a
        href={`${siteConfig.github.cli}/releases`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium"
        style={{ color: "var(--brand)" }}
      >
        View releases on GitHub <ExternalLink size={12} />
      </a>
    </div>
  );
}

function ReleaseEntry({ release }: { release: Release }) {
  return (
    <article id={release.tag} className="scroll-mt-24">
      <header
        className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b pb-4"
        style={{ borderColor: "var(--border)" }}
      >
        <h2
          className="text-[26px] font-bold tracking-[-0.02em]"
          style={{ fontFamily: "var(--font-display)", color: "var(--fg1)" }}
        >
          <a href={`#${release.tag}`} style={{ color: "inherit" }}>
            {release.name}
          </a>
        </h2>
        {release.prerelease && (
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase"
            style={{
              background: "var(--brand-muted)",
              color: "var(--brand)",
              border: "1px solid var(--brand-muted)",
            }}
          >
            Pre-release
          </span>
        )}
        <time
          dateTime={release.publishedAt}
          className="text-[13px]"
          style={{ color: "var(--fg3)" }}
        >
          {formatDate(release.publishedAt)}
        </time>
        <a
          href={release.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto inline-flex items-center gap-1 text-[13px]"
          style={{ color: "var(--fg3)" }}
        >
          View on GitHub <ExternalLink size={12} />
        </a>
      </header>
      {release.body.trim() ? (
        <div className="prose-docs">
          <MDXRemote
            source={release.body}
            components={mdxComponents}
            options={{
              parseFrontmatter: false,
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  rehypeSlug,
                  [
                    rehypePrettyCode,
                    {
                      theme: { light: "github-light", dark: "github-dark-dimmed" },
                      keepBackground: false,
                    },
                  ],
                ],
              },
            }}
          />
        </div>
      ) : (
        <p className="text-[14px]" style={{ color: "var(--fg3)" }}>
          No release notes were provided for this version.
        </p>
      )}
    </article>
  );
}
