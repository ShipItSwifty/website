import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ApiPage } from "@/components/docs/api/api-page";
import { getDoccMetadata, isDoccAvailable, listAllSlugs, loadRenderNode } from "@/lib/docc";

export const dynamicParams = false;

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateStaticParams() {
  if (!isDoccAvailable()) return [];
  const slugs = listAllSlugs();
  // Include the module root (empty slug → /docs/api/shipitkit)
  const params: Array<{ slug?: string[] }> = [{ slug: undefined }];
  for (const slug of slugs) {
    if (slug.length === 0) continue;
    params.push({ slug });
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const node = loadRenderNode(slug);
  if (!node) return {};
  const meta = getDoccMetadata();
  const moduleName = meta?.bundleDisplayName ?? "ShipItKit";
  const title =
    slug.length === 0 ? `${moduleName} API` : `${node.metadata.title} — ${moduleName} API`;
  const description =
    node.abstract
      ?.map((a) => ("text" in a ? a.text : "code" in a ? a.code : ""))
      .join("")
      .trim() || undefined;
  return { title, description };
}

export default async function ApiRoute({ params }: PageProps) {
  const { slug = [] } = await params;
  if (!isDoccAvailable()) notFound();
  const node = loadRenderNode(slug);
  if (!node) notFound();
  return <ApiPage node={node} />;
}
