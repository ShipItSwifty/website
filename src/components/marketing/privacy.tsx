"use client";

import { useState } from "react";
import { Lock, EyeOff, HardDrive } from "lucide-react";

const points = [
  {
    Icon: HardDrive,
    title: "Runs on your machine",
    desc: "ShipItSwifty is a native Swift CLI. Every build, archive, signing, and upload step executes locally on your Mac or Linux box — there is no cloud backend processing your project.",
  },
  {
    Icon: Lock,
    title: "No LLM in the pipeline",
    desc: "The tool itself makes zero AI or LLM calls. shipit ai-session generates a context snapshot for your agent to use — ShipItSwifty never calls any model on your behalf.",
  },
  {
    Icon: EyeOff,
    title: "Zero telemetry",
    desc: "No analytics, no crash reporting, no usage tracking. ShipItSwifty never phones home. Your project structure, credentials, and workflows stay on your machine.",
  },
];

function PrivacyCard({
  Icon,
  title,
  desc,
}: {
  Icon: (typeof points)[number]["Icon"];
  title: string;
  desc: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="rounded-[10px] border p-6 transition-colors"
      style={{
        background: "var(--bg)",
        borderColor: hov ? "var(--border-active)" : "var(--border)",
      }}
    >
      <div
        className="mb-4 flex h-[38px] w-[38px] items-center justify-center rounded-lg"
        style={{
          background: "rgba(63,185,80,0.1)",
          border: "1px solid rgba(63,185,80,0.25)",
          color: "#3FB950",
        }}
      >
        <Icon size={18} />
      </div>
      <h3
        className="mb-2 text-[15px] font-semibold"
        style={{ fontFamily: "var(--font-display)", color: "var(--fg1)" }}
      >
        {title}
      </h3>
      <p className="text-[13.5px] leading-[1.65]" style={{ color: "var(--fg2)" }}>
        {desc}
      </p>
    </div>
  );
}

export function Privacy() {
  return (
    <section
      id="privacy"
      className="border-y px-6 py-24"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-13">
          <div
            className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase"
            style={{ color: "#3FB950" }}
          >
            <div className="h-px w-4" style={{ background: "#3FB950" }} />
            Privacy First
          </div>
          <h2
            className="text-[40px] leading-[1.15] font-bold tracking-[-0.025em]"
            style={{ fontFamily: "var(--font-display)", color: "var(--fg1)" }}
          >
            Your data never leaves your machine.
          </h2>
          <p
            className="mt-3.5 max-w-[520px] text-base leading-[1.65]"
            style={{ color: "var(--fg2)" }}
          >
            No third-party services. No AI calls baked in. No hidden network requests. ShipItSwifty
            is a local CLI — what happens on your machine stays on your machine.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {points.map((p) => (
            <PrivacyCard key={p.title} {...p} />
          ))}
        </div>

        <div
          className="mt-8 flex items-start gap-3 rounded-[10px] border px-6 py-5"
          style={{ background: "var(--bg)", borderColor: "var(--border)" }}
        >
          <span
            className="mt-px shrink-0 text-[11px] font-semibold tracking-[0.08em] uppercase"
            style={{ color: "#3FB950" }}
          >
            Note
          </span>
          <p className="text-[13px] leading-[1.65]" style={{ color: "var(--fg2)" }}>
            <code
              className="rounded px-1.5 py-px text-[11px]"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--brand)",
                background: "var(--brand-muted)",
              }}
            >
              shipit ai-session
            </code>{" "}
            generates a machine-readable JSON snapshot of your project and shipit documentation. You
            paste that into your own AI agent — ShipItSwifty itself never calls any LLM or sends
            data to any third-party service.
          </p>
        </div>
      </div>
    </section>
  );
}
