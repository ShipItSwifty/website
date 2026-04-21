"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy } from "lucide-react";
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
  { t: "Swift 6", c: "#F05138" },
  { t: "macOS 15+", c: "#8B949E" },
  { t: "iOS + Android", c: "#3FB950" },
  { t: "AI-first", c: "#58A6FF" },
];

const installCommand = "swift build -c release";

export function Hero() {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    void navigator.clipboard?.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

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
          Ship your iOS app.
          <br />
          <span style={{ color: "var(--brand)" }}>No Ruby required.</span>
        </h1>
        <p className="mb-9 max-w-[460px] text-[17px] leading-[1.7]" style={{ color: "var(--fg2)" }}>
          ShipItSwifty is a Swift-native CLI for iOS and Android release automation. Build, archive,
          sign, and push to TestFlight — all from a single YAML config.
        </p>
        <div
          className="mb-6 flex max-w-[380px] items-center gap-3 rounded-lg border px-4 py-2.5"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <span
            style={{ color: "var(--brand)", fontFamily: "var(--font-mono)", fontSize: 13 }}
            aria-hidden
          >
            $
          </span>
          <span
            className="flex-1 truncate"
            style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--fg1)" }}
          >
            {installCommand}
          </span>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center justify-center transition-colors"
            style={{ color: copied ? "var(--green)" : "var(--fg3)" }}
            aria-label={copied ? "Copied!" : "Copy install command"}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/#getting-started"
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
          </Link>
          <a
            href={siteConfig.github.cli}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border px-[22px] py-2.5 text-[15px] font-medium transition-colors"
            style={{
              color: "var(--fg2)",
              borderColor: "var(--border)",
              fontFamily: "var(--font-body)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--border-active)";
              e.currentTarget.style.color = "var(--fg1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--fg2)";
            }}
          >
            <Github size={15} />
            View on GitHub
          </a>
        </div>
      </div>
      <div className="fade-up-delayed">
        <AnimTerminal lines={heroLines} loopMs={8000} />
      </div>
    </section>
  );
}
