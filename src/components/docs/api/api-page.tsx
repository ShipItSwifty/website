/**
 * Top-level DocC page renderer.
 *
 * Orchestrates the sections of a single RenderNode into the page body.
 * Mirrors the structure DocC's HTML renderer uses (title, eyebrow, abstract,
 * declaration, content, parameters, return value, discussion, topics,
 * relationships, see-also).
 */
import {
  type ContentSection,
  type DeclarationSection,
  type ParametersSection,
  type RenderNode,
} from "@/lib/docc";
import { InlineContent } from "./inline-content";
import { BlockContentRenderer } from "./block-content";
import { Declaration } from "./declaration";
import { Parameters } from "./parameters";
import { Topics } from "./topics";
import { Relationships } from "./relationships";

type Props = { node: RenderNode };

export function ApiPage({ node }: Props) {
  const refs = node.references;
  const sections = node.primaryContentSections ?? [];
  const declSection = sections.find((s): s is DeclarationSection => s.kind === "declarations");
  const paramSection = sections.find((s): s is ParametersSection => s.kind === "parameters");
  const contentSections = sections.filter((s): s is ContentSection => s.kind === "content");
  const eyebrow = node.metadata.roleHeading;

  return (
    <article className="prose-docs docc-article">
      <header className="docc-header">
        {eyebrow && <p className="docc-eyebrow">{eyebrow}</p>}
        <h1 className="docc-title">{node.metadata.title}</h1>
        {node.abstract?.length ? (
          <p className="docc-abstract">
            <InlineContent nodes={node.abstract} references={refs} />
          </p>
        ) : null}
      </header>

      {declSection?.declarations.map((decl, i) => (
        <Declaration key={i} tokens={decl.tokens} references={refs} />
      ))}

      {contentSections.map((s, i) => (
        <BlockContentRenderer key={i} nodes={s.content} references={refs} />
      ))}

      <Parameters parameters={paramSection?.parameters} references={refs} />

      <Topics sections={node.topicSections} references={refs} />

      <Relationships sections={node.relationshipsSections} references={refs} />

      {node.seeAlsoSections?.length ? (
        <Topics sections={node.seeAlsoSections} references={refs} heading="See Also" />
      ) : null}
    </article>
  );
}
