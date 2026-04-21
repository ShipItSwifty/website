import type { TocItem } from "@/components/docs/toc";

/**
 * Extracts headings from raw markdown/MDX source. We use a regex-based scan
 * (not full AST) because the same logic must produce IDs identical to those
 * that rehype-slug emits for the rendered output.
 *
 * Mirrors github-slugger's behavior: lowercase, strip non-word, collapse
 * whitespace to dashes.
 */
export function extractToc(source: string, minLevel = 2, maxLevel = 3): TocItem[] {
  const items: TocItem[] = [];
  const used = new Map<string, number>();
  const lines = source.split("\n");

  let inFence = false;
  for (const line of lines) {
    if (line.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (!m) continue;
    const level = m[1].length;
    if (level < minLevel || level > maxLevel) continue;
    const text = m[2].replace(/`([^`]+)`/g, "$1").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
    let id = slugify(text);
    if (used.has(id)) {
      const n = used.get(id)! + 1;
      used.set(id, n);
      id = `${id}-${n}`;
    } else {
      used.set(id, 0);
    }
    items.push({ id, text, level });
  }
  return items;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 \-_]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
