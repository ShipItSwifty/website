import { promises as fs } from "node:fs";
import { join } from "node:path";
import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { getAllDocPages } from "@/lib/docs";
import { isDoccAvailable, listAllSlugs } from "@/lib/docc";

async function doccLastModified(): Promise<Date> {
  try {
    const raw = await fs.readFile(join(process.cwd(), "data/docc/.version"), "utf8");
    const meta = JSON.parse(raw) as { publishedAt?: string; fetchedAt?: string };
    const stamp = meta.publishedAt ?? meta.fetchedAt;
    if (stamp) return new Date(stamp);
  } catch {
    // fall through to build time
  }
  return new Date();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docs = await getAllDocPages();
  const docEntries: MetadataRoute.Sitemap = await Promise.all(
    docs.map(async (p) => {
      const stat = await fs.stat(p.filePath);
      return {
        url: `${siteConfig.url}${p.href}`,
        lastModified: stat.mtime,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    }),
  );

  const apiEntries: MetadataRoute.Sitemap = [];
  if (isDoccAvailable()) {
    const lastModified = await doccLastModified();
    const slugs = [[] as string[], ...listAllSlugs().filter((s) => s.length > 0)];
    const seen = new Set<string>();
    for (const slug of slugs) {
      const path = ["/docs/api/shipitkit", ...slug].join("/");
      if (seen.has(path)) continue;
      seen.add(path);
      apiEntries.push({
        url: `${siteConfig.url}${encodeURI(path)}`,
        lastModified,
        changeFrequency: "weekly",
        priority: slug.length === 0 ? 0.6 : 0.4,
      });
    }
  }

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...docEntries,
    ...apiEntries,
  ];
}
