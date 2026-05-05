"use client";

import { useState, useRef, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

/**
 * Wraps rehype-pretty-code <pre> blocks with a copy button.
 * Used as a custom `pre` component in MDX rendering.
 */
export function Pre({ children, ...props }: { children: ReactNode } & React.HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const copy = () => {
    const text = preRef.current?.textContent ?? "";
    void navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={copy}
        className="absolute flex h-7 w-7 items-center justify-center rounded-md border opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
        style={{
          right: "10px",
          top: "10px",
          color: copied ? "var(--green)" : "var(--fg3)",
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
        aria-label={copied ? "Copied!" : "Copy code"}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
      <pre ref={preRef} {...props}>
        {children}
      </pre>
    </div>
  );
}
