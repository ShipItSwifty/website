/**
 * DocC code listing renderer.
 *
 * Highlights code via Shiki with paired light/dark themes matching the rest
 * of the docs site. Renders as a server component (async) so highlighting
 * happens at build time during static prerender.
 */
import { codeToHtml } from "shiki";

type Props = {
  code: string[];
  syntax?: string | null;
};

const LANG_MAP: Record<string, string> = {
  swift: "swift",
  yaml: "yaml",
  yml: "yaml",
  bash: "bash",
  sh: "bash",
  shell: "bash",
  json: "json",
  text: "text",
  txt: "text",
};

function normalizeLang(syntax: string | null | undefined): string {
  if (!syntax) return "text";
  return LANG_MAP[syntax.toLowerCase()] ?? syntax.toLowerCase();
}

export async function CodeListing({ code, syntax }: Props) {
  const source = code.join("\n");
  const lang = normalizeLang(syntax);
  let html: string;
  try {
    html = await codeToHtml(source, {
      lang,
      themes: { light: "github-light", dark: "github-dark-dimmed" },
      defaultColor: false,
    });
  } catch {
    html = await codeToHtml(source, {
      lang: "text",
      themes: { light: "github-light", dark: "github-dark-dimmed" },
      defaultColor: false,
    });
  }
  return (
    <div
      className="docc-code"
      // Shiki output is trusted server-side HTML
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
