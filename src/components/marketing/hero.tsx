"use client";

import { ArrowUpRight } from "lucide-react";
import { GithubIcon as Github } from "@/components/icons/github";
import { AnimTerminal, type TerminalLine } from "./anim-terminal";
import { siteConfig } from "@/lib/site";

const heroLines: TerminalLine[] = [
  { t: "prompt", s: "shipit run beta --ci" },
  { t: "dim", s: "▸ loading Shipfile.yml" },
  { t: "info", s: "→ step 1/4  version" },
  { t: "ok", s: "  ✓ bumped build: 41 → 42" },
  { t: "info", s: "→ step 2/4  archive" },
  { t: "ok", s: "  ✓ MyApp.xcarchive (14.2s)" },
  { t: "info", s: "→ step 3/4  export" },
  { t: "ok", s: "  ✓ MyApp.ipa" },
  { t: "info", s: "→ step 4/4  testflight" },
  { t: "ok", s: "  ✓ distributed to Internal QA" },
  { t: "done", s: "✓ workflow beta  completed in 2m 14s" },
];

const pills = [
  { t: "Public beta", c: "#D29922" },
  { t: "Swift 6", c: "#F05138" },
  { t: "macOS 15+", c: "#8B949E" },
  { t: "iOS + Android", c: "#3FB950" },
  { t: "AI-first", c: "#58A6FF" },
];

export function Hero() {
  return (
    <section className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-6 pt-[88px] pb-20 md:grid-cols-2 md:gap-[72px]">
      <div className="fade-up">
        <div className="mb-7 flex flex-wrap gap-2">
          {pills.map((p) => (
            <span
              key={p.t}
              className="rounded-full border px-2.5 py-[3px] text-xs font-medium"
              style={{
                color: "var(--fg1)",
                background: `${p.c}18`,
                borderColor: `${p.c}55`,
                fontFamily: "var(--font-body)",
              }}
            >
              <span
                aria-hidden
                className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle"
                style={{ background: p.c }}
              />
              {p.t}
            </span>
          ))}
        </div>
        <h1
          className="mb-[22px] text-[42px] leading-[1.06] font-bold tracking-[-0.03em] sm:text-[54px]"
          style={{ fontFamily: "var(--font-display)", color: "var(--fg1)" }}
        >
          Tell your agent
          <br />
          <span style={{ color: "var(--brand)" }}>what to ship.</span>
        </h1>
        <p className="mb-9 max-w-[460px] text-[17px] leading-[1.7]" style={{ color: "var(--fg2)" }}>
          ShipItSwifty is in public beta today. Start with <code>shipit generate</code> to build a
          real config from your project, then hand the repo to your agent to validate, dry-run,
          and ship the workflow.
        </p>
        <a
          href={siteConfig.github.cli}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-6 flex max-w-[380px] items-center gap-3 rounded-lg border px-4 py-3 transition-colors"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--border-active)";
            e.currentTarget.style.background = "var(--elevated)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.background = "var(--surface)";
          }}
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: "var(--brand-muted)", color: "var(--brand)" }}
          >
            <Github size={15} />
          </div>
          <div className="min-w-0 flex-1">
            <div
              className="text-[11px] tracking-[0.08em] uppercase"
              style={{ color: "var(--fg3)" }}
            >
              Open source
            </div>
            <div className="truncate text-[13px]" style={{ color: "var(--fg1)" }}>
              Browse ShipItSwifty on GitHub
            </div>
          </div>
          <ArrowUpRight size={15} style={{ color: "var(--fg3)" }} />
        </a>
        <div className="flex flex-wrap gap-3">
          <a
            href="#getting-started"
            className="inline-block rounded-md px-[22px] py-2.5 text-[15px] font-medium text-white transition-colors"
            style={{
              background: "var(--brand)",
              border: "1px solid var(--brand)",
              fontFamily: "var(--font-body)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--brand-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--brand)")}
          >
            Get Started
          </a>
        </div>
        <p className="mt-4 text-[13px] leading-[1.65]" style={{ color: "var(--fg3)" }}>
          Beta release. Use{" "}
          <a
            href={`${siteConfig.github.cli}/issues`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--blue)" }}
          >
            GitHub Issues
          </a>{" "}
          for bug reports, feedback, and feature requests.
        </p>
      </div>
      <div className="fade-up-delayed">
        <AnimTerminal lines={heroLines} loopMs={8000} />
      </div>
    </section>
  );
}
