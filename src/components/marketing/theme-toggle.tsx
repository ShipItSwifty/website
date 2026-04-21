"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";

const OPTIONS = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
] as const;

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
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
        <Monitor size={14} />
      </button>
    );
  }

  const current = (theme === "system" ? "system" : (resolvedTheme ?? "dark")) as
    | "light"
    | "dark"
    | "system";
  const next = current === "light" ? "dark" : current === "dark" ? "system" : "light";
  const Icon = (OPTIONS.find((o) => o.value === current) ?? OPTIONS[1]).Icon;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      title={`Theme: ${current}`}
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
