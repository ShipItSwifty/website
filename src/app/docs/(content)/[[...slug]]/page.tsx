import { notFound } from "next/navigation";
import { relative } from "node:path";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import { Toc } from "@/components/docs/toc";
import { Pager } from "@/components/docs/pager";
import { EditOnGitHub } from "@/components/docs/edit-on-github";
import { mdxComponents } from "@/components/docs/mdx-components";
import { getAdjacentDocs, getAllDocPages, getDocBySlug, getDocSource } from "@/lib/docs";
import { extractToc } from "@/lib/toc";
import type { Metadata } from "next";

export const dynamicParams = false;

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateStaticParams() {
  const pages = await getAllDocPages();
  return pages.map((p) => ({ slug: p.slug.length ? p.slug : undefined }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const page = await getDocBySlug(slug);
  if (!page) return {};
  return {
    title: page.frontmatter.title,
    description: page.frontmatter.description,
  };
}

export default async function DocPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const page = await getDocBySlug(slug);
  if (!page) notFound();

  const { content } = await getDocSource(page);
  const toc = extractToc(content);
  const { prev, next } = await getAdjacentDocs(page.slug);
  const fallbackContentPath = relative(process.cwd(), page.filePath);

  return (
    <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1fr_200px]">
      <article>
        <header className="mb-10">
          {page.frontmatter.group && (
            <div
              className="mb-3 text-[12px] font-medium tracking-[0.08em] uppercase"
              style={{ color: "var(--brand)" }}
            >
              {page.frontmatter.group}
            </div>
          )}
          <h1
            className="mb-3 text-[36px] font-bold tracking-[-0.025em]"
            style={{ fontFamily: "var(--font-display)", color: "var(--fg1)" }}
          >
            {page.frontmatter.title}
          </h1>
          {page.frontmatter.description && (
            <p className="text-[17px] leading-[1.65]" style={{ color: "var(--fg2)" }}>
              {page.frontmatter.description}
            </p>
          )}
        </header>
        <div className="prose-docs">
          <MDXRemote
            source={content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  rehypeSlug,
                  [
                    rehypeAutolinkHeadings,
                    { behavior: "wrap", properties: { className: ["heading-anchor"] } },
                  ],
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
        <div className="mt-12 border-t pt-6" style={{ borderColor: "var(--border)" }}>
          <EditOnGitHub
            sourcePath={page.frontmatter.sourcePath}
            fallbackContentPath={fallbackContentPath}
          />
        </div>
        <Pager prev={prev} next={next} />
      </article>
      <aside
        aria-label="Table of contents"
        className="hidden xl:sticky xl:top-[80px] xl:block xl:max-h-[calc(100vh-100px)] xl:overflow-y-auto"
      >
        <Toc items={toc} />
      </aside>
    </div>
  );
}
