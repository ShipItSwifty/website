import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { DocPage } from "@/lib/docs";

interface PagerProps {
  prev: DocPage | null;
  next: DocPage | null;
}

export function Pager({ prev, next }: PagerProps) {
  if (!prev && !next) return null;
  return (
    <div
      className="mt-12 grid grid-cols-1 gap-4 border-t pt-8 sm:grid-cols-2"
      style={{ borderColor: "var(--border)" }}
    >
      {prev ? (
        <Link
          href={prev.href}
          className="group rounded-lg border p-4 transition-colors"
          style={{ borderColor: "var(--border)" }}
        >
          <div
            className="mb-1 flex items-center gap-1.5 text-[11px] tracking-wider uppercase"
            style={{ color: "var(--fg3)" }}
          >
            <ArrowLeft size={12} /> Previous
          </div>
          <div
            className="text-[15px] font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "var(--fg1)" }}
          >
            {prev.frontmatter.title}
          </div>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group rounded-lg border p-4 text-right transition-colors"
          style={{ borderColor: "var(--border)" }}
        >
          <div
            className="mb-1 flex items-center justify-end gap-1.5 text-[11px] tracking-wider uppercase"
            style={{ color: "var(--fg3)" }}
          >
            Next <ArrowRight size={12} />
          </div>
          <div
            className="text-[15px] font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "var(--fg1)" }}
          >
            {next.frontmatter.title}
          </div>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
