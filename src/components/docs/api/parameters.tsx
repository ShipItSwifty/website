/**
 * "Parameters" section for functions/methods/initializers.
 *
 * Each parameter has a name (the external/internal label) and a block-content
 * description. Rendered as a definition-style list for clarity.
 */
import { type BlockContent, type RenderReference } from "@/lib/docc";
import { BlockContentRenderer } from "./block-content";

type Props = {
  parameters: Array<{ name: string; content: BlockContent[] }> | undefined;
  references: Record<string, RenderReference> | undefined;
};

export function Parameters({ parameters, references }: Props) {
  if (!parameters?.length) return null;
  return (
    <section className="docc-parameters">
      <h2 id="parameters">Parameters</h2>
      <dl className="docc-param-list">
        {parameters.map((p) => (
          <div key={p.name} className="docc-param-row">
            <dt className="docc-param-name">
              <code>{p.name}</code>
            </dt>
            <dd className="docc-param-desc">
              <BlockContentRenderer nodes={p.content} references={references} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
