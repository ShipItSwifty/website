/**
 * Renders a Swift declaration as syntax-highlighted tokens.
 *
 * Unlike DocC's `codeListing` which highlights via Shiki, declarations come
 * as pre-tokenized fragments with semantic kinds (keyword, identifier,
 * typeIdentifier, externalParam, etc). We map each kind to a CSS class so
 * the colors match Shiki's `github-light` / `github-dark-dimmed` palettes.
 */
import Link from "next/link";
import { type DeclarationToken, type RenderReference, identifierToHref } from "@/lib/docc";

type Props = {
  tokens: DeclarationToken[];
  references: Record<string, RenderReference> | undefined;
};

const KIND_CLASS: Record<string, string> = {
  keyword: "docc-tok-keyword",
  identifier: "docc-tok-identifier",
  typeIdentifier: "docc-tok-type",
  genericParameter: "docc-tok-type",
  externalParam: "docc-tok-param",
  internalParam: "docc-tok-param",
  number: "docc-tok-number",
  string: "docc-tok-string",
  attribute: "docc-tok-attribute",
  label: "docc-tok-keyword",
  text: "",
};

export function Declaration({ tokens, references }: Props) {
  return (
    <pre className="docc-declaration">
      <code>
        {tokens.map((tok, i) => {
          const cls = KIND_CLASS[tok.kind] ?? "";
          // typeIdentifier with a known reference → link
          if (tok.kind === "typeIdentifier" && tok.preciseIdentifier) {
            const refKey = Object.keys(references ?? {}).find((k) => {
              const ref = references?.[k];
              return ref?.fragments?.some((f) => f.preciseIdentifier === tok.preciseIdentifier);
            });
            const href = refKey ? identifierToHref(refKey) : null;
            if (href) {
              return (
                <Link key={i} href={href} className={cls}>
                  {tok.text}
                </Link>
              );
            }
          }
          return (
            <span key={i} className={cls}>
              {tok.text}
            </span>
          );
        })}
      </code>
    </pre>
  );
}
