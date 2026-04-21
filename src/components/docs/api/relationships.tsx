/**
 * "Relationships" section: e.g. "Inherits From", "Conforming Types".
 *
 * Identifiers may resolve to in-module symbols (linked) or to external
 * stdlib types like `s8SendableP` (rendered as inert code).
 */
import Link from "next/link";
import { type RelationshipsSection, type RenderReference, identifierToHref } from "@/lib/docc";

type Props = {
  sections: RelationshipsSection[] | undefined;
  references: Record<string, RenderReference> | undefined;
};

export function Relationships({ sections, references }: Props) {
  if (!sections?.length) return null;
  return (
    <section className="docc-relationships">
      <h2 id="relationships">Relationships</h2>
      {sections.map((section, i) => (
        <div key={i} className="docc-relationship-group">
          <h3 className="docc-relationship-title">{section.title}</h3>
          <ul className="docc-relationship-list">
            {section.identifiers.map((id) => {
              const ref = references?.[id];
              const href = identifierToHref(id);
              const title = ref?.title ?? id.replace(/^doc:\/\/[^/]+\//, "");
              return (
                <li key={id}>
                  {href ? (
                    <Link href={href}>
                      <code>{title}</code>
                    </Link>
                  ) : (
                    <code>{title}</code>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </section>
  );
}
