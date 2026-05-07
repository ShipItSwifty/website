"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

export type TerminalLineType = "prompt" | "dim" | "info" | "ok" | "done" | "warn" | "json";

export interface TerminalLine {
  t: TerminalLineType;
  s: string;
}

interface AnimTerminalProps {
  lines: TerminalLine[];
  loopMs?: number;
  termBg?: string;
  label?: string;
  lineMode?: "scroll" | "wrap";
}

const colorByType: Record<TerminalLineType, string> = {
  prompt: "var(--fg1)",
  dim: "var(--fg3)",
  info: "var(--blue)",
  ok: "var(--term-green)",
  done: "var(--green)",
  warn: "var(--amber)",
  json: "var(--fg2)",
};

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerReducedMotionSnapshot() {
  return false;
}

export function AnimTerminal({
  lines,
  loopMs = 7000,
  termBg,
  label = "shipit",
  lineMode = "scroll",
}: AnimTerminalProps) {
  const reduceMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );
  const [vis, setVis] = useState<number[]>([]);
  const visibleLines = reduceMotion ? lines.map((_, i) => i) : vis;

  useEffect(() => {
    if (reduceMotion) return;

    let timers: ReturnType<typeof setTimeout>[] = [];
    const run = () => {
      setVis([]);
      timers = lines.map((_, i) => setTimeout(() => setVis((v) => [...v, i]), 280 + i * 210));
    };
    run();
    const loop = setInterval(run, loopMs);
    return () => {
      timers.forEach(clearTimeout);
      clearInterval(loop);
    };
  }, [lines, loopMs, reduceMotion]);

  return (
    <div
      className="overflow-hidden rounded-[10px] border"
      style={{
        background: termBg || "var(--bg)",
        borderColor: "var(--border)",
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        lineHeight: 1.85,
      }}
    >
      <div
        className="flex items-center gap-1.5 border-b px-3.5 py-2"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        {["#F85149", "#D29922", "#3FB950"].map((c) => (
          <div key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
        ))}
        <span
          className="ml-2 text-[11px]"
          style={{ color: "var(--fg3)", fontFamily: "var(--font-body)" }}
        >
          {label}
        </span>
      </div>
      <div
        className="min-h-[200px] px-[18px] py-4"
        style={{ overflowX: lineMode === "scroll" ? "auto" : "hidden" }}
      >
        {lines.map((l, i) => (
          <div
            key={i}
            style={{
              color: colorByType[l.t] || "var(--fg1)",
              opacity: visibleLines.includes(i) ? 1 : 0,
              transform: visibleLines.includes(i) ? "none" : "translateY(4px)",
              transition: "opacity 200ms, transform 200ms",
              whiteSpace: lineMode === "wrap" ? "pre-wrap" : "pre",
            }}
          >
            {l.t === "prompt" && <span style={{ color: "var(--brand)" }}>$ </span>}
            {l.s}
          </div>
        ))}
        <span
          aria-hidden
          className="inline-block h-[14px] w-[7px] align-middle"
          style={{
            background: "var(--fg1)",
            animation: "blink 1s step-end infinite",
            opacity: visibleLines.length >= lines.length ? 1 : 0,
          }}
        />
      </div>
    </div>
  );
}
