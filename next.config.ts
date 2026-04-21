import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
  // Plugins are configured per-page when we render MDX programmatically; the
  // bare loader is fine for routes-as-MDX. We use compileMDX in src/lib for
  // file-sourced docs MDX so we can pass full plugin instances there.
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

export default withMDX(nextConfig);
