"use client";

import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  lang?: string;
  children: string;
}

/**
 * Lightweight code block used by marketing components. For docs MDX content,
 * we use rehype-pretty-code which produces fully-styled <pre> blocks.
 */
export function CodeBlock({ lang = "bash", children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    void navigator.clipboard?.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const renderLine = (line: string, _idx: number): ReactNode => {
    if (lang !== "yaml") {
      return <span style={{ color: "var(--fg2)" }}>{line || "\u00a0"}</span>;
    }
    if (line.trim().startsWith("#")) {
      return <span style={{ color: "var(--fg3)" }}>{line}</span>;
    }
    const kv = line.match(/^(\s*)([\w_]+)(\s*:\s*)(.*)$/);
    if (!kv) return <span style={{ color: "var(--fg2)" }}>{line || "\u00a0"}</span>;
    const [, indent, key, colon, val] = kv;
    const valColor = val.startsWith("$")
      ? "var(--amber)"
      : val.startsWith("-")
        ? "var(--blue)"
        : "var(--fg2)";
    return (
      <>
        <span style={{ color: "transparent" }}>{indent}</span>
        <span style={{ color: "var(--code-key)" }}>{key}</span>
        <span style={{ color: "var(--fg3)" }}>{colon}</span>
        <span style={{ color: valColor }}>{val}</span>
      </>
    );
  };

  return (
    <div
      className="overflow-hidden rounded-lg border"
      style={{ background: "var(--code-bg)", borderColor: "var(--border)" }}
    >
      <div
        className="flex items-center justify-between border-b px-3.5 py-1.5"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <span
          className="text-[11px] tracking-wide"
          style={{ fontFamily: "var(--font-mono)", color: "var(--fg3)" }}
        >
          {lang}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 text-xs font-medium transition-colors"
          style={{
            color: copied ? "var(--green)" : "var(--fg3)",
            fontFamily: "var(--font-body)",
          }}
          aria-label={copied ? "Copied!" : "Copy code"}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre
        className="overflow-x-auto px-[18px] py-4"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          lineHeight: 1.85,
        }}
      >
        {children.split("\n").map((line, i) => (
          <div key={i}>{renderLine(line, i)}</div>
        ))}
      </pre>
    </div>
  );
}
