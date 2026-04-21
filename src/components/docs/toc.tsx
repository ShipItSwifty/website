"use client";

import { useEffect, useState } from "react";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TocProps {
  items: TocItem[];
}

export function Toc({ items }: TocProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!items.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: [0, 1] },
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <nav aria-label="On this page" className="text-sm">
      <div
        className="mb-3 text-[11px] font-medium tracking-[0.08em] uppercase"
        style={{ color: "var(--fg3)" }}
      >
        On this page
      </div>
      <ul className="space-y-1.5">
        {items.map((it) => {
          const isActive = activeId === it.id;
          return (
            <li key={it.id} style={{ paddingLeft: (it.level - 2) * 12 }}>
              <a
                href={`#${it.id}`}
                aria-current={isActive ? "location" : undefined}
                className="block text-[13px] transition-colors"
                style={{
                  color: isActive ? "var(--brand)" : "var(--fg3)",
                  borderLeft: `2px solid ${isActive ? "var(--brand)" : "transparent"}`,
                  paddingLeft: 8,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = "var(--fg1)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = "var(--fg3)";
                }}
              >
                {it.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
