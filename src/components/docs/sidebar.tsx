"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchButton } from "@/components/search/search-button";
import type { DocGroup } from "@/lib/docs";

interface DocsSidebarProps {
  groups: DocGroup[];
}

export function DocsSidebar({ groups }: DocsSidebarProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Documentation" className="text-sm">
      <div className="mb-5 px-1">
        <SearchButton variant="full" />
      </div>
      {groups.map((g) => (
        <div key={g.title} className="mb-6">
          <div
            className="mb-2 px-2 text-[11px] font-medium tracking-[0.08em] uppercase"
            style={{ color: "var(--fg3)" }}
          >
            {g.title}
          </div>
          <ul className="space-y-px">
            {g.pages.map((p) => {
              const isActive = pathname === p.href;
              return (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    aria-current={isActive ? "page" : undefined}
                    className="block rounded-md px-2 py-1.5 text-[13.5px] transition-colors"
                    style={{
                      color: isActive ? "var(--brand)" : "var(--fg2)",
                      background: isActive ? "var(--brand-muted)" : "transparent",
                      fontWeight: isActive ? 500 : 400,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = "var(--fg1)";
                        e.currentTarget.style.background = "var(--surface)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = "var(--fg2)";
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    {p.frontmatter.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
