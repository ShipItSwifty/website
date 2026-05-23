"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { AnimTerminal, type TerminalLine } from "./anim-terminal";
import { CodeBlock } from "./code-block";

interface OverviewStep {
  num: string;
  title: string;
  desc: string;
  code?: string;
  lang?: string;
  termLines?: TerminalLine[];
}

const steps: OverviewStep[] = [
  {
    num: "01",
    title: "Define your config",
    desc: "Create a Shipfile.yml at the project root. Declare your app identifiers, signing, and workflow steps.",
    code: `# Shipfile.yml
app:
  bundle_id: com.example.myapp
  scheme: MyApp

app_store_connect:
  key_id: \${ASC_KEY_ID}
  issuer_id: \${ASC_ISSUER_ID}
  key_path: ./asc.p8

workflows:
  beta:
    - action: version
      options: { bump: build }
    - action: archive
      options: { export_method: app-store }
    - action: export
    - action: testflight
      options:
        groups: ["Internal QA"]
`,
    lang: "yaml",
  },
  {
    num: "02",
    title: "Validate your setup",
    desc: "Run doctor and env checks before committing to a full build. Catches missing credentials and config errors early.",
    termLines: [
      { t: "prompt", s: "shipit doctor" },
      { t: "ok", s: "  ✓ Xcode 16.2 detected" },
      { t: "ok", s: "  ✓ Shipfile.yml found" },
      { t: "ok", s: "  ✓ ASC key readable" },
      { t: "ok", s: "  ✓ provisioning profile valid" },
      { t: "done", s: "All checks passed. Ready to ship." },
    ],
  },
  {
    num: "03",
    title: "Dry-run first",
    desc: "Preview exactly what will run without touching your build system or uploading anything.",
    termLines: [
      { t: "prompt", s: "shipit run beta --dry-run --output json" },
      { t: "json", s: "{" },
      { t: "json", s: '  "status": "dry_run",' },
      { t: "json", s: '  "workflow": "beta",' },
      { t: "json", s: '  "steps": [' },
      { t: "json", s: '    "archive",' },
      { t: "json", s: '    "export",' },
      { t: "json", s: '    "testflight",' },
      { t: "json", s: '    "version"' },
      { t: "json", s: "  ]" },
      { t: "json", s: "}" },
      { t: "done", s: "✓ dry-run — no changes made" },
    ],
  },
  {
    num: "04",
    title: "Ship it",
    desc: "Run the workflow. ShipItSwifty handles archiving, code signing, TestFlight distribution, and version bumping in sequence.",
    termLines: [
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
    ],
  },
];

export function Overview() {
  const [active, setActive] = useState(0);
  const s = steps[active];
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = steps.length - 1;
    let next: number;
    switch (e.key) {
      case "ArrowDown":
      case "ArrowRight":
        next = i === last ? 0 : i + 1;
        break;
      case "ArrowUp":
      case "ArrowLeft":
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
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section
      id="overview"
      className="border-y px-6 pt-16 pb-12 md:pt-20 md:pb-14"
      style={{ background: "var(--bg)", borderColor: "var(--border)" }}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-14">
          <div
            className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase"
            style={{ color: "var(--brand)" }}
          >
            <div className="h-px w-4" style={{ background: "var(--brand)" }} />
            Overview
          </div>
          <h2
            className="max-w-[560px] text-[40px] leading-[1.15] font-bold tracking-[-0.025em]"
            style={{ fontFamily: "var(--font-display)", color: "var(--fg1)" }}
          >
            From zero to release automation
            <br />
            in four steps.
          </h2>
          <p
            className="mt-3.5 max-w-[500px] text-base leading-[1.65]"
            style={{ color: "var(--fg2)" }}
          >
            One YAML file. One command.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-[280px_1fr] md:items-start">
          <div
            className="flex flex-col gap-1"
            role="tablist"
            aria-orientation="vertical"
            aria-label="Overview steps"
          >
            {steps.map((step, i) => {
              const isActive = active === i;
              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  id={`overview-tab-${i}`}
                  aria-selected={isActive}
                  aria-controls={`overview-panel-${i}`}
                  tabIndex={isActive ? 0 : -1}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onTabKeyDown(e, i)}
                  className="rounded-lg p-4 text-left transition-colors"
                  style={{
                    background: isActive ? "var(--elevated)" : "transparent",
                    border: `1px solid ${isActive ? "var(--border-active)" : "transparent"}`,
                    borderLeft: `3px solid ${isActive ? "var(--brand)" : "transparent"}`,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "var(--elevated)";
                      e.currentTarget.style.borderColor = "var(--border)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = "transparent";
                    }
                  }}
                >
                  <div
                    className="mb-1 text-[11px]"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: isActive ? "var(--brand)" : "var(--fg3)",
                    }}
                  >
                    {step.num}
                  </div>
                  <div
                    className="text-sm font-semibold"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: isActive ? "var(--fg1)" : "var(--fg2)",
                    }}
                  >
                    {step.title}
                  </div>
                </button>
              );
            })}
          </div>

          <div
            className="fade-up md:-mt-1"
            role="tabpanel"
            id={`overview-panel-${active}`}
            aria-labelledby={`overview-tab-${active}`}
            tabIndex={0}
          >
            <p className="mb-4 text-[15px] leading-[1.7]" style={{ color: "var(--fg2)" }}>
              {s.desc}
            </p>
            <div className="md:h-[460px] md:overflow-y-auto md:pr-1">
              {s.code ? (
                <CodeBlock lang={s.lang || "bash"}>{s.code}</CodeBlock>
              ) : (
                <AnimTerminal lines={s.termLines!} loopMs={6000} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
