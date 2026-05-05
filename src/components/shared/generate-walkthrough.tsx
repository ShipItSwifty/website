"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { Check, Terminal } from "lucide-react";
import { AnimTerminal, type TerminalLine } from "@/components/marketing/anim-terminal";
import { CodeBlock } from "@/components/marketing/code-block";
import { siteConfig } from "@/lib/site";

interface InstallTab {
  id: string;
  label: string;
  code: string;
  available: boolean;
  badge?: string;
  desc?: string;
}

interface GenerateWalkthroughProps {
  layout?: "section" | "content";
  sectionId?: string;
  showDocsLink?: boolean;
  videoEmbedUrl?: string;
}

const installTabs: InstallTab[] = [
  {
    id: "homebrew",
    label: "Homebrew",
    available: siteConfig.install.homebrewAvailable,
    badge: siteConfig.install.homebrewAvailable ? undefined : "Soon",
    code: siteConfig.install.homebrewAvailable
      ? siteConfig.install.homebrewCommand
      : "# The Homebrew tap is being prepared.\n# In the meantime, build from source — it takes under a minute.",
    desc: siteConfig.install.homebrewAvailable
      ? "The fastest way to get started. One command, always up to date."
      : "A Homebrew tap is on its way. Until then, building from source is quick and gives you the same binary.",
  },
  {
    id: "build",
    label: "Build from Source",
    available: true,
    code: `git clone ${siteConfig.github.cli}.git
cd shipitswifty
swift build -c release
# Binary at .build/release/shipit`,
    desc: "Build from source if you want to audit the code or work from the latest main branch.",
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
    desc: "Add ShipItSwifty as a library dependency to embed ShipItKit in your own tooling.",
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
      <div
        className="text-[17px] font-semibold"
        style={{ fontFamily: "var(--font-display)", color: "var(--fg1)" }}
      >
        {title}
      </div>
    </div>
  );
}

function WalkthroughBody({
  showDocsLink,
  videoEmbedUrl,
}: Pick<GenerateWalkthroughProps, "showDocsLink" | "videoEmbedUrl">) {
  const [active, setActive] = useState<string>("homebrew");
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
    <div className="flex max-w-[720px] flex-col gap-12">
      {/* Prerequisites */}
      <div className="rounded-[10px] border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="mb-4 text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--fg1)" }}>
          Before you start
        </div>
        <p className="mb-4 text-[13px] leading-[1.65]" style={{ color: "var(--fg2)" }}>
          ShipItSwifty drives Xcode directly, so it needs a Mac with a modern Swift toolchain.
          The API key is only required for commands that talk to App Store Connect — local builds work without one.
        </p>
        {[
          { item: "macOS 15+, Xcode 16+", why: "ShipItSwifty calls xcodebuild under the hood" },
          { item: "Swift 6 toolchain", why: "the CLI is built with Swift 6 concurrency" },
          { item: "Apple Developer account", why: "required for code signing and provisioning" },
          { item: "App Store Connect API key", why: "needed only for upload, testflight, and metadata commands" },
        ].map(({ item, why }) => (
          <div key={item} className="mb-2.5 flex items-start gap-2.5 text-[13px]" style={{ color: "var(--fg2)" }}>
            <Check size={14} className="mt-0.5 shrink-0" style={{ color: "var(--green)" }} />
            <span><strong style={{ color: "var(--fg1)" }}>{item}</strong> — {why}</span>
          </div>
        ))}
        {showDocsLink ? (
          <div className="mt-4 border-t pt-4" style={{ borderColor: "var(--border)" }}>
            <Link href="/docs/getting-started/ios-quickstart" className="inline-flex items-center gap-1 text-[13px]" style={{ color: "var(--blue)" }}>
              Read the full quickstart →
            </Link>
          </div>
        ) : null}
      </div>

      {/* Step 1 — Install */}
      <div>
        <StepHeader n="1" title="Install shipit" />
        <p className="mb-4 text-sm leading-[1.7]" style={{ color: "var(--fg2)" }}>
          ShipItSwifty is a single static binary with no runtime dependencies. Pick whichever install method suits your workflow.
        </p>
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

      {/* Step 2 — Generate */}
      <div>
        <StepHeader n="2" title="Generate your config" />
        <p className="mb-4 text-sm leading-[1.7]" style={{ color: "var(--fg2)" }}>
          Instead of writing YAML by hand, let ShipItSwifty inspect your Xcode project. It detects your scheme, bundle ID, and team — then writes a{" "}
          <code className="rounded px-1.5 py-px text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--fg2)", background: "var(--elevated)" }}>Shipfile.yml</code>{" "}
          you can review and commit. This is the recommended starting point for every project.
        </p>
        <CodeBlock lang="bash">{`shipit generate

# Or target a specific release flow
shipit generate --goal beta

# Machine-readable output for CI or agents
shipit generate --goal beta --non-interactive --output json`}</CodeBlock>
      </div>

      {/* Terminal demo */}
      <div className="rounded-[10px] border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="mb-3.5 flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: "var(--brand-muted)", border: "1px solid rgba(240,81,56,0.2)", color: "var(--brand)" }}>
            <Terminal size={16} />
          </div>
          <div>
            <div className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--fg1)" }}>
              shipit generate in action
            </div>
            <div className="text-[13px]" style={{ color: "var(--fg2)" }}>
              Scans your project and writes a complete config in seconds.
            </div>
          </div>
        </div>
        {videoEmbedUrl ? (
          <div className="overflow-hidden rounded-lg border" style={{ borderColor: "var(--border)" }}>
            <div className="aspect-video">
              <iframe
                src={videoEmbedUrl}
                title="ShipItSwifty walkthrough video"
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        ) : (
          <AnimTerminal lines={generateLines} loopMs={7000} />
        )}
      </div>

      {/* Step 3 — Verify */}
      <div>
        <StepHeader n="3" title="Verify your environment" />
        <p className="mb-4 text-sm leading-[1.7]" style={{ color: "var(--fg2)" }}>
          Before running a build, confirm that Xcode, credentials, and provisioning profiles are wired up correctly.{" "}
          <code className="rounded px-1.5 py-px text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--brand)", background: "var(--brand-muted)" }}>shipit env</code>{" "}
          prints every resolved value, and{" "}
          <code className="rounded px-1.5 py-px text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--brand)", background: "var(--brand-muted)" }}>shipit doctor</code>{" "}
          checks for common issues like missing entitlements or expired certificates.
        </p>
        <CodeBlock lang="bash">{`shipit env\nshipit doctor`}</CodeBlock>
      </div>

      {/* Step 4 — Run */}
      <div>
        <StepHeader n="4" title="Run your first workflow" />
        <p className="mb-4 text-sm leading-[1.7]" style={{ color: "var(--fg2)" }}>
          Always dry-run first to see exactly what ShipItSwifty will do — which actions run, in what order, and with what options. Once you are satisfied, drop the flag and ship.
        </p>
        <CodeBlock lang="bash">{`# Preview without executing
shipit run beta --dry-run

# Ship it
shipit run beta --ci`}</CodeBlock>
      </div>

      {/* CI callout */}
      <div className="rounded-[10px] border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="mb-3 text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--fg1)" }}>
          Running in CI?
        </div>
        <p className="mb-3.5 text-[13px] leading-[1.65]" style={{ color: "var(--fg2)" }}>
          Every command is non-interactive by default. Export credentials as environment
          variables and pass{" "}
          <code className="rounded px-1.5 py-px text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--brand)", background: "var(--brand-muted)" }}>--ci</code>{" "}
          to disable TTY prompts and enable structured logging.
        </p>
        <CodeBlock lang="yaml">{`# GitHub Actions
- run: shipit run beta --ci
  env:
    ASC_KEY_ID: \${{ secrets.ASC_KEY_ID }}
    ASC_ISSUER_ID: \${{ secrets.ASC_ISSUER_ID }}
    ASC_PRIVATE_KEY: \${{ secrets.ASC_PRIVATE_KEY }}`}</CodeBlock>
      </div>
    </div>
  );
}

export function GenerateWalkthrough({
  layout = "content",
  sectionId = "getting-started",
  showDocsLink = false,
  videoEmbedUrl,
}: GenerateWalkthroughProps) {
  if (layout === "content") {
    return <WalkthroughBody showDocsLink={showDocsLink} videoEmbedUrl={videoEmbedUrl} />;
  }

  return (
    <section id={sectionId} className="mx-auto max-w-[1200px] scroll-mt-24 px-6 py-24">
      <div className="mb-14">
        <div className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase" style={{ color: "var(--brand)" }}>
          <div className="h-px w-4" style={{ background: "var(--brand)" }} />
          Getting Started
        </div>
        <h2 className="text-[40px] leading-[1.15] font-bold tracking-[-0.025em]" style={{ fontFamily: "var(--font-display)", color: "var(--fg1)" }}>
          Up and running in minutes.
        </h2>
        <p className="mt-3.5 max-w-[500px] text-base leading-[1.65]" style={{ color: "var(--fg2)" }}>
          Install the binary, generate a config, and run your first workflow. No Gemfile. No
          Bundler. No Ruby.
        </p>
      </div>

      <WalkthroughBody showDocsLink={showDocsLink} videoEmbedUrl={videoEmbedUrl} />
    </section>
  );
}
