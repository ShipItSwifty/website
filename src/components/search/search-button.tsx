"use client";

import { useEffect, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useSearch } from "./search-provider";

interface SearchButtonProps {
  /** "compact" = just an icon (mobile/nav). "full" = pill with placeholder + ⌘K (sidebar). */
  variant?: "compact" | "full";
}

export function SearchButton({ variant = "compact" }: SearchButtonProps) {
  const { setOpen } = useSearch();
  const [mod, setMod] = useState<"⌘" | "Ctrl">("⌘");

  useEffect(() => {
    setMod(navigator.platform.toLowerCase().includes("mac") ? "⌘" : "Ctrl");
  }, []);

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search documentation"
        className="group flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[13px] transition-colors"
        style={{
          background: "var(--bg)",
          border: "1px solid var(--border)",
          color: "var(--fg3)",
        }}
      >
        <SearchIcon size={14} aria-hidden="true" />
        <span className="flex-1">Search docs…</span>
        <kbd
          className="rounded px-1.5 py-0.5 text-[10px]"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--fg3)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {mod}K
        </kbd>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Search documentation"
      title={`Search (${mod}K)`}
      className="rounded-md p-2 transition-colors"
      style={{ color: "var(--fg2)" }}
    >
      <SearchIcon size={16} aria-hidden="true" />
    </button>
  );
}
