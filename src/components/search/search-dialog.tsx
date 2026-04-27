"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search as SearchIcon, X, FileText, Hash } from "lucide-react";
// FlexSearch ships its own types via @types/flexsearch
import FlexSearch from "flexsearch";

interface SearchEntry {
  id: string;
  url: string;
  title: string;
  section: string | null;
  group: string;
  content: string;
}

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<SearchEntry[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  // Element that was focused before the dialog opened — we restore focus
  // to it on close so keyboard users land back where they came from.
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  // Lazy-load index the first time the dialog opens.
  useEffect(() => {
    if (!open || entries !== null) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/search-index.json", { cache: "force-cache" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: SearchEntry[] = await res.json();
        if (!cancelled) setEntries(data);
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : "Failed to load search");
          setEntries([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, entries]);

  // Build a FlexSearch document index whenever entries change.
  const index = useMemo(() => {
    if (!entries) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = new (FlexSearch as any).Document({
      tokenize: "forward",
      cache: 100,
      document: {
        id: "id",
        index: [
          { field: "title", tokenize: "forward", resolution: 9 },
          { field: "section", tokenize: "forward", resolution: 7 },
          { field: "content", tokenize: "forward", resolution: 5 },
        ],
        store: ["url", "title", "section", "group", "content"],
      },
    });
    for (const e of entries) doc.add(e);
    return doc;
  }, [entries]);

  // Run query.
  const results = useMemo<SearchEntry[]>(() => {
    if (!index || !entries) return [];
    const q = query.trim();
    if (!q) {
      // Empty query: show first 8 entries grouped, as a "browse" hint.
      return entries.slice(0, 8);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = (index as any).search(q, { limit: 12, enrich: true });
    const seen = new Set<string>();
    const out: SearchEntry[] = [];
    for (const field of raw) {
      for (const r of field.result as Array<{ id: string; doc: SearchEntry }>) {
        if (seen.has(r.id)) continue;
        seen.add(r.id);
        out.push(r.doc);
        if (out.length >= 12) break;
      }
      if (out.length >= 12) break;
    }
    return out;
  }, [index, entries, query]);

  // Reset state when dialog closes / opens, and remember/restore focus
  // for keyboard users.
  useEffect(() => {
    if (open) {
      lastFocusedRef.current = document.activeElement as HTMLElement | null;
      // Focus input after paint.
      requestAnimationFrame(() => inputRef.current?.focus());
      return () => {
        // Restore focus to the element that opened the dialog (if still in DOM).
        const last = lastFocusedRef.current;
        if (last && document.contains(last)) {
          last.focus();
        }
        lastFocusedRef.current = null;
      };
    }
  }, [open]);

  // Esc + arrow key handling + focus trap (Tab cycles within the dialog).
  useEffect(() => {
    if (!open) return;
    function getFocusable(): HTMLElement[] {
      const root = dialogRef.current;
      if (!root) return [];
      return Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute("aria-hidden") && el.offsetParent !== null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const focusables = getFocusable();
        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && (active === first || !active || !dialogRef.current?.contains(active))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, results.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === "Enter") {
        const r = results[activeIdx];
        if (r) {
          e.preventDefault();
          router.push(r.url);
          onClose();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, activeIdx, router, onClose]);

  // Scroll the active item into view.
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLAnchorElement>(`[data-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx, open]);

  // Mark the rest of the page inert so screen readers and keyboard
  // navigation are scoped to the dialog while it's open.
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const siblings = Array.from(document.body.children).filter(
      (el) => el !== dialog && !el.contains(dialog),
    );
    const previous = siblings.map((el) => el.hasAttribute("inert"));
    siblings.forEach((el) => el.setAttribute("inert", ""));
    return () => {
      siblings.forEach((el, i) => {
        if (!previous[i]) el.removeAttribute("inert");
      });
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Search documentation"
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
      onClick={onClose}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: "color-mix(in srgb, var(--bg) 70%, transparent)",
          backdropFilter: "blur(6px)",
        }}
      />
      <div
        className="relative w-full max-w-[640px] overflow-hidden rounded-xl shadow-2xl"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="search-input-row flex items-center gap-2 px-4 py-3"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <SearchIcon size={16} style={{ color: "var(--fg3)" }} aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIdx(0);
            }}
            placeholder="Search docs…"
            aria-label="Search query"
            className="flex-1 bg-transparent text-[15px]"
            style={{ color: "var(--fg1)", outline: "none" }}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd
            className="hidden rounded px-1.5 py-0.5 text-[11px] sm:inline-block"
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              color: "var(--fg3)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Esc
          </kbd>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="rounded p-1 transition-colors sm:hidden"
            style={{ color: "var(--fg3)" }}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-2">
          {entries === null ? (
            <div className="px-3 py-6 text-center text-[13px]" style={{ color: "var(--fg3)" }}>
              Loading search…
            </div>
          ) : loadError ? (
            <div className="px-3 py-6 text-center text-[13px]" style={{ color: "var(--fg3)" }}>
              Could not load search index ({loadError}).
            </div>
          ) : results.length === 0 ? (
            <div className="px-3 py-6 text-center text-[13px]" style={{ color: "var(--fg3)" }}>
              No results for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            <ul className="flex flex-col gap-0.5">
              {results.map((r, i) => (
                <li key={r.id}>
                  <ResultLink
                    entry={r}
                    active={i === activeIdx}
                    idx={i}
                    onMouseEnter={() => setActiveIdx(i)}
                    onSelect={() => {
                      router.push(r.url);
                      onClose();
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div
          className="flex items-center gap-3 px-4 py-2 text-[11px]"
          style={{ borderTop: "1px solid var(--border)", color: "var(--fg3)" }}
        >
          <span className="inline-flex items-center gap-1">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd> navigate
          </span>
          <span className="inline-flex items-center gap-1">
            <Kbd>↵</Kbd> open
          </span>
          <span className="ml-auto inline-flex items-center gap-1">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd> toggle
          </span>
        </div>
      </div>
    </div>
  );
}

function ResultLink({
  entry,
  active,
  idx,
  onMouseEnter,
  onSelect,
}: {
  entry: SearchEntry;
  active: boolean;
  idx: number;
  onMouseEnter: () => void;
  onSelect: () => void;
}) {
  return (
    <a
      href={entry.url}
      data-idx={idx}
      onMouseEnter={onMouseEnter}
      onClick={(e) => {
        e.preventDefault();
        onSelect();
      }}
      className="flex items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors"
      style={{
        background: active ? "var(--bg)" : "transparent",
        border: `1px solid ${active ? "var(--border)" : "transparent"}`,
      }}
    >
      <span
        className="mt-[3px] flex h-5 w-5 shrink-0 items-center justify-center rounded"
        style={{
          background: "var(--bg)",
          border: "1px solid var(--border)",
          color: "var(--fg3)",
        }}
        aria-hidden="true"
      >
        {entry.section ? <Hash size={11} /> : <FileText size={11} />}
      </span>
      <span className="flex flex-1 flex-col gap-0.5 overflow-hidden">
        <span className="truncate text-[13px] font-medium" style={{ color: "var(--fg1)" }}>
          {entry.section || entry.title}
        </span>
        <span className="truncate text-[11px]" style={{ color: "var(--fg3)" }}>
          {entry.group}
          {entry.section ? <> &middot; {entry.title}</> : null}
        </span>
        {entry.content ? (
          <span className="line-clamp-2 text-[12px]" style={{ color: "var(--fg2)" }}>
            {entry.content}
          </span>
        ) : null}
      </span>
    </a>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded px-1 text-[10px]"
      style={{
        background: "var(--bg)",
        border: "1px solid var(--border)",
        color: "var(--fg2)",
        fontFamily: "var(--font-mono)",
      }}
    >
      {children}
    </kbd>
  );
}
