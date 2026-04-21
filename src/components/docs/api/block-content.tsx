/**
 * DocC block content renderer.
 *
 * Recursively renders the block-level content array used by RenderNode
 * sections (paragraphs, headings, lists, code listings, asides, tables).
 *
 * Async because `CodeListing` performs build-time Shiki highlighting.
 */
import { type BlockContent, type InlineFragment, type RenderReference } from "@/lib/docc";
import { InlineContent } from "./inline-content";
import { CodeListing } from "./code-listing";
import { Callout } from "@/components/docs/callout";

type Props = {
  nodes: BlockContent[] | undefined;
  references: Record<string, RenderReference> | undefined;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

const ASIDE_VARIANT_MAP: Record<string, "info" | "tip" | "warning" | "danger"> = {
  note: "info",
  tip: "tip",
  important: "warning",
  warning: "warning",
  experiment: "tip",
  attention: "warning",
  author: "info",
  authors: "info",
  bug: "danger",
  complexity: "info",
  copyright: "info",
  date: "info",
  invariant: "info",
  mutatingvariant: "info",
  nonmutatingvariant: "info",
  postcondition: "info",
  precondition: "info",
  remark: "info",
  remarks: "info",
  requires: "info",
  seealso: "info",
  since: "info",
  todo: "tip",
  version: "info",
};

export function BlockContentRenderer({ nodes, references }: Props) {
  if (!nodes?.length) return null;
  return (
    <>
      {nodes.map((n, i) => (
        <BlockNode key={i} node={n} references={references} />
      ))}
    </>
  );
}

function BlockNode({
  node,
  references,
}: {
  node: BlockContent;
  references: Record<string, RenderReference> | undefined;
}) {
  switch (node.type) {
    case "paragraph": {
      const n = node as { inlineContent: InlineFragment[] };
      return (
        <p>
          <InlineContent nodes={n.inlineContent} references={references} />
        </p>
      );
    }
    case "heading": {
      const n = node as { level: number; text: string; anchor?: string };
      const id = n.anchor ?? slugify(n.text);
      const level = Math.max(2, Math.min(6, n.level)) as 2 | 3 | 4 | 5 | 6;
      const Tag = `h${level}` as "h2" | "h3" | "h4" | "h5" | "h6";
      return <Tag id={id}>{n.text}</Tag>;
    }
    case "codeListing": {
      const n = node as { syntax?: string | null; code: string[] };
      return <CodeListing code={n.code} syntax={n.syntax} />;
    }
    case "unorderedList": {
      const n = node as { items: Array<{ content: BlockContent[] }> };
      return (
        <ul>
          {n.items.map((item, i) => (
            <li key={i}>
              <BlockContentRenderer nodes={item.content} references={references} />
            </li>
          ))}
        </ul>
      );
    }
    case "orderedList": {
      const n = node as { items: Array<{ content: BlockContent[] }> };
      return (
        <ol>
          {n.items.map((item, i) => (
            <li key={i}>
              <BlockContentRenderer nodes={item.content} references={references} />
            </li>
          ))}
        </ol>
      );
    }
    case "aside": {
      const n = node as {
        style?: string;
        name?: string;
        content: BlockContent[];
      };
      const key = (n.style ?? n.name ?? "note").toLowerCase();
      const variant = ASIDE_VARIANT_MAP[key] ?? "info";
      const title = n.name ?? key.charAt(0).toUpperCase() + key.slice(1);
      return (
        <Callout variant={variant} title={title}>
          <BlockContentRenderer nodes={n.content} references={references} />
        </Callout>
      );
    }
    case "table": {
      const n = node as {
        header?: "row" | "both" | "none";
        rows: BlockContent[][][];
      };
      const headerRow = n.header === "row" || n.header === "both" ? n.rows[0] : undefined;
      const bodyRows = headerRow ? n.rows.slice(1) : n.rows;
      return (
        <div className="overflow-x-auto">
          <table>
            {headerRow && (
              <thead>
                <tr>
                  {headerRow.map((cell, i) => (
                    <th key={i}>
                      <BlockContentRenderer nodes={cell} references={references} />
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {bodyRows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c}>
                      <BlockContentRenderer nodes={cell} references={references} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    case "termList": {
      const n = node as {
        items: Array<{
          term: { inlineContent: InlineFragment[] };
          definition: { content: BlockContent[] };
        }>;
      };
      return (
        <dl>
          {n.items.map((item, i) => (
            <div key={i}>
              <dt>
                <InlineContent nodes={item.term.inlineContent} references={references} />
              </dt>
              <dd>
                <BlockContentRenderer nodes={item.definition.content} references={references} />
              </dd>
            </div>
          ))}
        </dl>
      );
    }
    default:
      return null;
  }
}
