"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { SearchDialog } from "./search-dialog";

interface SearchCtx {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
}

const Ctx = createContext<SearchCtx | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isMac = navigator.platform.toLowerCase().includes("mac");
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (mod && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      // Slash to focus when not typing in a field
      if (e.key === "/" && !open) {
        const t = e.target as HTMLElement | null;
        const tag = t?.tagName?.toLowerCase();
        if (tag === "input" || tag === "textarea" || t?.isContentEditable) return;
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <Ctx.Provider value={{ open, setOpen, toggle }}>
      {children}
      {open ? <SearchDialog open={open} onClose={() => setOpen(false)} /> : null}
    </Ctx.Provider>
  );
}

export function useSearch() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSearch must be used inside <SearchProvider>");
  return c;
}
