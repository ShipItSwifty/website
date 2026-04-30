"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { Check, Terminal } from "lucide-react";
import { AnimTerminal, type TerminalLine } from "./anim-terminal";
import { CodeBlock } from "./code-block";
import { siteConfig } from "@/lib/site";

interface InstallTab {
  id: string;
  label: string;
  code: string;
  available: boolean;
  badge?: string;
  desc?: string;
}

const installTabs: InstallTab[] = [
  {
    id: "build",
    label: "Build from Source",
    available: true,
    code: `git clone ${siteConfig.github.cli}.git
cd shipitswifty
git checkout 0.1.0
swift build -c release
# Binary at .build/release/shipit`,
    desc: "Build the public 0.1.0 release from source, or audit every line before running it.",
  },
  {
    id: "homebrew",
    label: "Homebrew",
    available: siteConfig.install.homebrewAvailable,
    badge: siteConfig.install.homebrewAvailable ? undefined : "Soon",
    code: siteConfig.install.homebrewAvailable
      ? siteConfig.install.homebrewCommand
      : "# Homebrew tap coming soon\n# For now, build from source.",
    desc: siteConfig.install.homebrewAvailable
      ? "The fastest way to get started. One command, always up to date."
      : "The public tap is not published yet. Use the source build while the tap is prepared.",
  },
  {
    id: "spm",
    label: "Swift Package Manager",
    available: true,
    code: `// Package.swift
dependencies: [
  .package(
    url: "${siteConfig.github.cli}.git",
    from: "0.1.0"
  )
]`,
    desc: "Want full control? Add ShipItSwifty as a pinned library dependency.",
  },
];

const generateLines: TerminalLine[] = [
  { t: "prompt", s: "shipit generate --goal beta" },
  { t: "dim", s: "▸ scanning Xcode project…" },
  { t: "ok", s: "  detected scheme: MyApp" },
  { t: "ok", s: "  detected bundle_id: com.example.myapp" },
  { t: "info", s: "  workflow: version → archive → export → testflight" },
  { t: "dim", s: "▸ writing Shipfile.yml…" },
  { t: "done", s: "✓ Shipfile.yml ready — run: shipit run beta --dry-run" },
];

function StepHeader({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium"
        style={{
          background: "var(--brand-muted)",
          border: "1px solid rgba(240,81,56,0.25)",
          color: "var(--brand)",
          fontFamily: "var(--font-mono)",
        }}
      >
        {n}
      </div>
      <h3
        className="text-[17px] font-semibold"
        style={{ fontFamily: "var(--font-display)", color: "var(--fg1)" }}
      >
        {title}
      </h3>
    </div>
  );
}

export function GettingStarted() {
  const [active, setActive] = useState<string>("build");
  const tab = installTabs.find((t) => t.id === active) ?? installTabs[0];
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = installTabs.length - 1;
    let next: number;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = i === last ? 0 : i + 1;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = i === 0 ? last : i - 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = last;
        break;
      default:
        return;
    }
    e.preventDefault();
    setActive(installTabs[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="getting-started" className="mx-auto max-w-[1200px] scroll-mt-24 px-6 py-24">
      <div className="mb-14">
        <div
          className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase"
          style={{ color: "var(--brand)" }}
        >
          <div className="h-px w-4" style={{ background: "var(--brand)" }} />
          Getting Started
        </div>
        <h2
          className="text-[40px] leading-[1.15] font-bold tracking-[-0.025em]"
          style={{ fontFamily: "var(--font-display)", color: "var(--fg1)" }}
        >
          Up and running in minutes.
        </h2>
        <p
          className="mt-3.5 max-w-[500px] text-base leading-[1.65]"
          style={{ color: "var(--fg2)" }}
        >
          Install the binary, generate a config, and run your first workflow. No Gemfile. No
          Bundler. No Ruby.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div>
          <div className="mb-10">
            <StepHeader n="1" title="Install shipit" />
            <div className="mb-4 flex flex-wrap gap-1.5" role="tablist" aria-label="Install method">
              {installTabs.map((t, i) => {
                const isActive = active === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    id={`install-tab-${t.id}`}
                    aria-selected={isActive}
                    aria-controls="install-panel"
                    tabIndex={isActive ? 0 : -1}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    onClick={() => setActive(t.id)}
                    onKeyDown={(e) => onTabKeyDown(e, i)}
                    className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-[13px] font-medium transition-colors"
                    style={{
                      background: isActive ? "var(--brand)" : "transparent",
                      color: isActive ? "#fff" : "var(--fg2)",
                      borderColor: isActive ? "var(--brand)" : "var(--border)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {t.label}
                    {t.badge && (
                      <span
                        className="ml-0.5 rounded-sm px-1 py-px text-[10px] tracking-wider uppercase"
                        style={{
                          background: isActive ? "rgba(255,255,255,0.2)" : "var(--brand-muted)",
                          color: isActive ? "#fff" : "var(--brand)",
                        }}
                      >
                        {t.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {tab.desc && (
              <p className="mb-3 text-[13px] leading-[1.6]" style={{ color: "var(--fg3)" }}>
                {tab.desc}
              </p>
            )}
            <div
              role="tabpanel"
              id="install-panel"
              aria-labelledby={`install-tab-${tab.id}`}
              tabIndex={0}
            >
              <CodeBlock lang="bash">{tab.code}</CodeBlock>
            </div>
          </div>

          <div className="mb-10">
            <StepHeader n="2" title="Generate your config" />
            <p className="mb-4 text-sm leading-[1.7]" style={{ color: "var(--fg2)" }}>
              Run{" "}
              <code
                className="rounded px-1.5 py-px text-xs"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--brand)",
                  background: "var(--brand-muted)",
                }}
              >
                shipit generate
              </code>{" "}
              to inspect your project and scaffold a{" "}
              <code
                className="rounded px-1.5 py-px text-xs"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--fg2)",
                  background: "var(--elevated)",
                }}
              >
                Shipfile.yml
              </code>{" "}
              in seconds. No hand-writing YAML — shipit detects your scheme, bundle ID, and the
              right workflow automatically.
            </p>
            <CodeBlock lang="bash">{`shipit generate --goal beta

# Or scaffold interactively
shipit init`}</CodeBlock>
          </div>

          <div className="mb-10">
            <StepHeader n="3" title="Verify your environment" />
            <p className="mb-4 text-sm leading-[1.7]" style={{ color: "var(--fg2)" }}>
              Check that Xcode, credentials, and profiles are all in order before running a build.
            </p>
            <CodeBlock lang="bash">{`shipit env\nshipit doctor`}</CodeBlock>
          </div>

          <div>
            <StepHeader n="4" title="Run your first workflow" />
            <p className="mb-4 text-sm leading-[1.7]" style={{ color: "var(--fg2)" }}>
              Dry-run first to preview steps. Then run for real.
            </p>
            <CodeBlock lang="bash">{`# Preview without executing
shipit run beta --dry-run

# Ship it
shipit run beta --ci`}</CodeBlock>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div
            className="rounded-[10px] border p-6"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          >
            <div className="mb-3.5 flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{
                  background: "var(--brand-muted)",
                  border: "1px solid rgba(240,81,56,0.2)",
                  color: "var(--brand)",
                }}
              >
                <Terminal size={16} />
              </div>
              <div>
                <div
                  className="text-sm font-semibold"
                  style={{ fontFamily: "var(--font-display)", color: "var(--fg1)" }}
                >
                  shipit generate in action
                </div>
                <div className="text-[13px]" style={{ color: "var(--fg2)" }}>
                  Inspects your project and writes Shipfile.yml — ready to run.
                </div>
              </div>
            </div>
            <AnimTerminal lines={generateLines} loopMs={7000} />
            <p className="mt-4 text-[13px] leading-[1.65]" style={{ color: "var(--fg2)" }}>
              Generate produces a stable, reviewable config. Edit it once if you need to, then
              commit it. Every CI run after that is just{" "}
              <code
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--brand)",
                  fontSize: 12,
                }}
              >
                shipit run
              </code>
              .
            </p>
          </div>

          <div
            className="rounded-[10px] border p-6"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          >
            <div
              className="mb-4 text-sm font-semibold"
              style={{ fontFamily: "var(--font-display)", color: "var(--fg1)" }}
            >
              Prerequisites
            </div>
            {[
              "macOS 15+, Xcode 16+",
              "Swift 6 toolchain",
              "Apple Developer account",
              "App Store Connect API key",
            ].map((item) => (
              <div
                key={item}
                className="mb-2.5 flex items-center gap-2.5 text-[13px]"
                style={{ color: "var(--fg2)" }}
              >
                <Check size={14} style={{ color: "var(--green)" }} />
                {item}
              </div>
            ))}
            <div className="mt-4 border-t pt-4" style={{ borderColor: "var(--border)" }}>
              <Link
                href="/docs/getting-started/walkthrough"
                className="inline-flex items-center gap-1 text-[13px]"
                style={{ color: "var(--blue)" }}
              >
                Read the full walkthrough →
              </Link>
            </div>
          </div>

          <div
            className="rounded-[10px] border p-6"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          >
            <div
              className="mb-3 text-sm font-semibold"
              style={{ fontFamily: "var(--font-display)", color: "var(--fg1)" }}
            >
              Running in CI?
            </div>
            <p className="mb-3.5 text-[13px] leading-[1.65]" style={{ color: "var(--fg2)" }}>
              Every command is non-interactive by default. Export credentials as environment
              variables and set{" "}
              <code
                className="rounded px-1.5 py-px text-xs"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--brand)",
                  background: "var(--brand-muted)",
                }}
              >
                --ci
              </code>{" "}
              to disable TTY prompts.
            </p>
            <CodeBlock lang="yaml">{`# GitHub Actions
- run: shipit run beta --ci
  env:
    ASC_KEY_ID: \${{ secrets.ASC_KEY_ID }}
    ASC_ISSUER_ID: \${{ secrets.ASC_ISSUER_ID }}
    MATCH_PASSWORD: \${{ secrets.MATCH_PASSWORD }}`}</CodeBlock>
          </div>
        </div>
      </div>
    </section>
  );
}
