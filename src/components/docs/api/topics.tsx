/**
 * "Topics" section: groups of related symbols with title + abstract.
 *
 * DocC uses this to organize a parent symbol's children into curated buckets
 * (e.g. "Initializers", "Instance Methods"). We resolve each identifier
 * through the node's `references` map to render a link card with its
 * declaration fragments and abstract.
 */
import Link from "next/link";
import { type RenderReference, type TopicSection, identifierToHref } from "@/lib/docc";
import { InlineContent } from "./inline-content";

type Props = {
  sections: TopicSection[] | undefined;
  references: Record<string, RenderReference> | undefined;
  heading?: string;
};

function tokensToText(fragments: Array<{ text: string }> | undefined): string {
  return (fragments ?? []).map((f) => f.text).join("");
}

export function Topics({ sections, references, heading = "Topics" }: Props) {
  if (!sections?.length) return null;
  return (
    <section className="docc-topics">
      <h2 id="topics">{heading}</h2>
      {sections.map((section, i) => {
        const sectionId = section.anchor ?? `topic-${i}`;
        return (
          <div key={i} className="docc-topic-group">
            {section.title && (
              <h3 id={sectionId} className="docc-topic-title">
                {section.title}
              </h3>
            )}
            <ul className="docc-topic-list">
              {section.identifiers.map((id) => {
                const ref = references?.[id];
                if (!ref) return null;
                const href = identifierToHref(id);
                const title =
                  (ref.fragments && ref.fragments.length > 0
                    ? tokensToText(ref.fragments)
                    : null) ??
                  ref.title ??
                  id;
                const abstract = ref.abstract;
                return (
                  <li key={id} className="docc-topic-item">
                    {href ? (
                      <Link href={href} className="docc-topic-link">
                        <code>{title}</code>
                      </Link>
                    ) : (
                      <code>{title}</code>
                    )}
                    {abstract?.length ? (
                      <p className="docc-topic-abstract">
                        <InlineContent nodes={abstract} references={references} />
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </section>
  );
}
