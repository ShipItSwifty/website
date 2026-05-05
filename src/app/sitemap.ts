import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { getAllDocPages } from "@/lib/docs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const docs = await getAllDocPages();
  const docEntries: MetadataRoute.Sitemap = docs.map((p) => ({
    url: `${siteConfig.url}${p.href}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...docEntries,
  ];
}
