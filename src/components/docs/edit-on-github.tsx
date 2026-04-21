import { ExternalLink } from "lucide-react";
import { siteConfig } from "@/lib/site";

interface EditOnGitHubProps {
  /**
   * sourcePath from MDX frontmatter.
   * - If it starts with "upstream:", point to the CLI repo.
   * - If it starts with "website:", point to the website repo.
   * - Otherwise, default to website repo content path.
   */
  sourcePath?: string;
  fallbackContentPath: string; // e.g. "src/content/docs/getting-started/quick-start.mdx"
}

export function EditOnGitHub({ sourcePath, fallbackContentPath }: EditOnGitHubProps) {
  const { url, label } = resolve(sourcePath, fallbackContentPath);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="edit-on-github inline-flex items-center gap-1.5 text-[13px] transition-colors"
    >
      Edit this page on {label} <ExternalLink size={12} />
    </a>
  );
}

function resolve(sourcePath: string | undefined, fallbackContentPath: string) {
  if (sourcePath?.startsWith("upstream:")) {
    return {
      url: `${siteConfig.github.cli}/edit/main/${sourcePath.slice("upstream:".length)}`,
      label: "ShipItSwifty",
    };
  }
  const path = sourcePath?.startsWith("website:")
    ? sourcePath.slice("website:".length)
    : fallbackContentPath;
  return {
    url: `${siteConfig.github.website}/edit/main/${path}`,
    label: "website",
  };
}
