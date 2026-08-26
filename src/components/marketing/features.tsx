"use client";

import { useState, type ComponentType } from "react";
import {
  Bot,
  ChartNoAxesColumn,
  GitBranch,
  Shield,
  Smartphone,
  Terminal,
  Upload,
} from "lucide-react";

interface Feature {
  Icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  tag?: "iOS" | "Android" | "Cross-platform";
  desc: string;
}

const featureData: Feature[] = [
  {
    Icon: Smartphone,
    title: "One CLI, two stores",
    tag: "Cross-platform",
    desc: "Build, test, archive, and distribute iOS and Android apps from the same Shipfile.yml whether you are targeting App Store Connect or Google Play.",
  },
  {
    Icon: Upload,
    title: "Store & tester delivery",
    tag: "Cross-platform",
    desc: "Upload to TestFlight, App Store Connect, Google Play, or Firebase App Distribution with native clients, release tracks, tester groups, and CI-friendly credentials.",
  },
  {
    Icon: ChartNoAxesColumn,
    title: "Coverage & validation",
    tag: "Cross-platform",
    desc: "Run lint, tests, coverage, and validation commands before shipping. ShipItSwifty reads native build outputs and keeps dry-runs machine-readable.",
  },
  {
    Icon: Shield,
    title: "Code Signing",
    tag: "iOS",
    desc: "Encrypted cert vault from a Git repo. Create certs and profiles via ASC API. CI-safe keychain management.",
  },
  {
    Icon: Bot,
    title: "Guided setup",
    tag: "Cross-platform",
    desc: "Start with shipit generate to infer config from Xcode, Gradle, or shared projects, then use ai-session when you want an agent-ready JSON hand-off.",
  },
  {
    Icon: Terminal,
    title: "AndroidCLI, when you want it",
    tag: "Android",
    desc: "Opt into Google's preview AndroidCLI for project, layout, emulator, SDK, skills, and Android Studio tooling while keeping Gradle and ADB as the dependable release pipeline.",
  },
  {
    Icon: GitBranch,
    title: "Composable Workflows",
    desc: "Define reusable step sequences in Shipfile.yml. Parameterized custom actions, version tokens, conditional steps, and a release scaffold that bumps, tags, and pushes in one shipit run.",
  },
];

function FeatureCard({ Icon, title, desc, tag }: Feature) {
  const [hov, setHov] = useState(false);
  const tagCols: Record<string, { c: string; bg: string }> = {
    iOS: { c: "var(--brand)", bg: "var(--brand-muted)" },
    Android: { c: "#3DDC84", bg: "rgba(61,220,132,0.14)" },
    "Cross-platform": { c: "var(--blue)", bg: "rgba(88,166,255,0.14)" },
  };
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="rounded-[10px] border p-6 transition-colors"
      style={{
        background: "var(--surface)",
        borderColor: hov ? "var(--border-active)" : "var(--border)",
      }}
    >
      <div
        className="mb-4 flex h-[38px] w-[38px] items-center justify-center rounded-lg"
        style={{
          background: "var(--brand-muted)",
          border: "1px solid rgba(240,81,56,0.2)",
          color: "var(--brand)",
        }}
      >
        <Icon size={18} />
      </div>
      <div className="mb-2 flex items-center gap-2">
        <h3
          className="text-[15px] font-semibold"
          style={{ fontFamily: "var(--font-display)", color: "var(--fg1)" }}
        >
          {title}
        </h3>
        {tag && (
          <span
            className="rounded px-1.5 py-px text-[10px] font-medium"
            style={{ color: tagCols[tag]?.c, background: tagCols[tag]?.bg }}
          >
            {tag}
          </span>
        )}
      </div>
      <p className="text-[13.5px] leading-[1.65]" style={{ color: "var(--fg2)" }}>
        {desc}
      </p>
    </div>
  );
}

export function Features() {
  return (
    <section
      id="features"
      className="border-y px-6 py-24"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-13">
          <div
            className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase"
            style={{ color: "var(--brand)" }}
          >
            <div className="h-px w-4" style={{ background: "var(--brand)" }} />
            Features
          </div>
          <h2
            className="text-[40px] leading-[1.15] font-bold tracking-[-0.025em]"
            style={{ fontFamily: "var(--font-display)", color: "var(--fg1)" }}
          >
            Everything you need to ship.
          </h2>
          <p
            className="mt-3.5 max-w-[480px] text-base leading-[1.65]"
            style={{ color: "var(--fg2)" }}
          >
            From local validation to App Store Connect, Google Play, and Firebase App Distribution.
            No Ruby, no Fastfile, no fragile shell glue.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featureData.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>

        <div
          className="grid grid-cols-1 items-center gap-10 rounded-[10px] border px-8 py-7 md:grid-cols-[1fr_auto_1fr]"
          style={{ background: "var(--bg)", borderColor: "var(--border)" }}
        >
          <div>
            <div
              className="mb-3 text-[11px] font-medium tracking-[0.08em] uppercase"
              style={{ color: "var(--fg3)" }}
            >
              Migrating from fastlane?
            </div>
            {[
              ["match", "shipit sign sync"],
              ["gym", "shipit archive + export"],
              ["pilot", "shipit testflight"],
              ["deliver", "shipit metadata + upload"],
            ].map(([f, t]) => (
              <div key={f} className="mb-1.5 flex items-center gap-2.5 text-[13px]">
                <code
                  className="line-through"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--fg3)", fontSize: 12 }}
                >
                  {f}
                </code>
                <span style={{ color: "var(--fg3)" }}>→</span>
                <code
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--brand)",
                    fontSize: 12,
                  }}
                >
                  {t}
                </code>
              </div>
            ))}
          </div>
          <div className="hidden h-20 w-px md:block" style={{ background: "var(--border)" }} />
          <div>
            <div
              className="mb-3 text-[11px] font-medium tracking-[0.08em] uppercase"
              style={{ color: "var(--fg3)" }}
            >
              Built-in validation
            </div>
            {[
              "shipit validate yml",
              "shipit validate metadata",
              "shipit validate archive",
              "shipit doctor",
            ].map((cmd) => (
              <div
                key={cmd}
                className="mb-1.5 text-[12px]"
                style={{ fontFamily: "var(--font-mono)", color: "var(--fg2)" }}
              >
                <span style={{ color: "var(--brand)" }}>$ </span>
                {cmd}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
