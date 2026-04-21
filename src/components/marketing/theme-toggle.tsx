"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Avoid mismatch flash before hydration
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border"
        style={{
          borderColor: "var(--border)",
          background: "transparent",
          color: "var(--fg2)",
        }}
      >
        <Sun size={14} />
      </button>
    );
  }

  // Two-state toggle: light ↔ dark. Default theme is "system", but the toggle
  // resolves to whichever the user is currently seeing and flips to the opposite.
  const current = (resolvedTheme ?? "dark") as "light" | "dark";
  const next = current === "light" ? "dark" : "light";
  const Icon = current === "light" ? Moon : Sun;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border transition-colors"
      style={{
        borderColor: "var(--border)",
        background: "transparent",
        color: "var(--fg2)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "var(--fg1)";
        e.currentTarget.style.background = "var(--surface)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--fg2)";
        e.currentTarget.style.background = "transparent";
      }}
    >
      <Icon size={14} />
    </button>
  );
}
