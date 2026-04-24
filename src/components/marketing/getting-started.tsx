"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { AnimTerminal, type TerminalLine } from "./anim-terminal";
import { CodeBlock } from "./code-block";
import { siteConfig } from "@/lib/site";

interface InstallTab {
  id: string;
  label: string;
  code: string;
  available: boolean;
  badge?: string;
}

const installTabs: InstallTab[] = [
  {
    id: "build",
    label: "Build from Source",
    available: true,
    code: `git clone ${siteConfig.github.cli}.git
cd shipitswifty
swift build -c release
# Binary at .build/release/shipit`,
  },
  {
    id: "spm",
    label: "Swift Package Manager",
    available: true,
    code: `// Package.swift
dependencies: [
  .package(
    url: "${siteConfig.github.cli}.git",
    from: "1.0.0"
  )
]`,
  },
  {
    id: "homebrew",
    label: "Homebrew",
    available: siteConfig.install.homebrewAvailable,
    badge: siteConfig.install.homebrewAvailable ? undefined : "Coming soon",
    code: siteConfig.install.homebrewAvailable
      ? siteConfig.install.homebrewCommand
      : `# Coming soon — the Homebrew tap is in private beta.
# In the meantime, build from source or use SPM.`,
  },
];

const aiLines: TerminalLine[] = [
  { t: "prompt", s: "shipit ai-session --goal beta --output json" },
  { t: "dim", s: "▸ inspecting project…" },
  { t: "ok", s: "  detected scheme: MyApp (high confidence)" },
  { t: "ok", s: "  detected bundle_id: com.example.myapp" },
  { t: "info", s: "  hint: workflow beta -> version, archive, export, testflight" },
  { t: "info", s: "  nextAction: generate_shipfile" },
  { t: "info", s: "  command: shipit run beta --dry-run" },
  { t: "done", s: "✓ ai-session ready — give this JSON to your agent" },
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
          Install the binary, scaffold a config, and run your first workflow. No Gemfile. No
          Bundler. No Ruby.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div>
          <div className="mb-10">
            <StepHeader n="1" title="Install shipit" />
            <div
              className="mb-4 flex flex-wrap gap-1.5"
              role="tablist"
              aria-label="Install method"
            >
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
            <StepHeader n="2" title="Prompt your agent with project hints" />
            <p className="mb-4 text-sm leading-[1.7]" style={{ color: "var(--fg2)" }}>
              Ask your coding agent to use{" "}
              <code
                className="rounded px-1.5 py-px text-xs"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--brand)",
                  background: "var(--brand-muted)",
                }}
              >
                shipit ai-session
              </code>{" "}
              as grounding context. Instead of hand-writing YAML, the agent can inspect the project,
              resolve the likely workflow, and draft the full config for you.
            </p>
            <CodeBlock lang="bash">{`Prompt:
Generate my ShipItSwifty beta setup for this app.
Run shipit ai-session --goal beta --output json first and use it as source of truth.
If something is ambiguous, ask me one question. Otherwise create Shipfile.yml and tell me the next shipit command.

# Optional manual fallback
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
                  background: "rgba(88,166,255,0.1)",
                  border: "1px solid rgba(88,166,255,0.2)",
                  color: "var(--blue)",
                }}
              >
                <Sparkles size={16} />
              </div>
              <div>
                <div
                  className="text-sm font-semibold"
                  style={{ fontFamily: "var(--font-display)", color: "var(--fg1)" }}
                >
                  AI-first setup
                </div>
                <div className="text-[13px]" style={{ color: "var(--fg2)" }}>
                  One prompt plus ai-session hints can generate the whole release workflow.
                </div>
              </div>
            </div>
            <AnimTerminal lines={aiLines} loopMs={7000} />
            <p className="mt-4 text-[13px] leading-[1.65]" style={{ color: "var(--fg2)" }}>
              The agent gets a stable JSON snapshot of detected scheme, bundle ID, readiness, and
              the best next action. That keeps the setup grounded in your project instead of making
              the model guess.
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
