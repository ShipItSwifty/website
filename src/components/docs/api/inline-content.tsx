/**
 * DocC inline content renderer.
 *
 * Handles the inline fragment types emitted by DocC's RenderNode schema.
 * References are resolved against the node-local `references` map and linked
 * to website routes via `identifierToHref`.
 */
import Link from "next/link";
import { type InlineFragment, type RenderReference, identifierToHref } from "@/lib/docc";

type Props = {
  nodes: InlineFragment[] | undefined;
  references: Record<string, RenderReference> | undefined;
};

export function InlineContent({ nodes, references }: Props) {
  if (!nodes?.length) return null;
  return (
    <>
      {nodes.map((n, i) => (
        <InlineNode key={i} node={n} references={references} />
      ))}
    </>
  );
}

function InlineNode({
  node,
  references,
}: {
  node: InlineFragment;
  references: Record<string, RenderReference> | undefined;
}) {
  switch (node.type) {
    case "text":
      return <>{(node as { text: string }).text}</>;
    case "codeVoice":
      return <code>{(node as { code: string }).code}</code>;
    case "emphasis":
      return (
        <em>
          <InlineContent
            nodes={(node as { inlineContent: InlineFragment[] }).inlineContent}
            references={references}
          />
        </em>
      );
    case "strong":
      return (
        <strong>
          <InlineContent
            nodes={(node as { inlineContent: InlineFragment[] }).inlineContent}
            references={references}
          />
        </strong>
      );
    case "strikethrough":
      return (
        <s>
          <InlineContent
            nodes={(node as { inlineContent: InlineFragment[] }).inlineContent}
            references={references}
          />
        </s>
      );
    case "link": {
      const n = node as { destination: string; title?: string };
      return (
        <a href={n.destination} target="_blank" rel="noreferrer">
          {n.title ?? n.destination}
        </a>
      );
    }
    case "reference": {
      const n = node as {
        identifier: string;
        isActive?: boolean;
        overridingTitle?: string;
        overridingTitleInlineContent?: InlineFragment[];
      };
      const ref = references?.[n.identifier];
      const label = n.overridingTitle ?? ref?.title ?? n.identifier;
      const href = identifierToHref(n.identifier);
      // External (non-shipitkit) or unresolvable → render as inert <code>
      if (!href || n.isActive === false) {
        return <code>{label}</code>;
      }
      return (
        <Link href={href}>
          <code>{label}</code>
        </Link>
      );
    }
    default:
      // Unknown inline kind → render its text-ish payload if present
      if (typeof (node as Record<string, unknown>).text === "string") {
        return <>{(node as { text: string }).text}</>;
      }
      return null;
  }
}
