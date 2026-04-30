"use client";

import Link from "next/link";
import { Bot, ArrowRight } from "lucide-react";
import { AnimTerminal, type TerminalLine } from "./anim-terminal";
import { CodeBlock } from "./code-block";

const sessionLines: TerminalLine[] = [
  { t: "prompt", s: "shipit ai-session run --goal beta --output json" },
  { t: "dim", s: "▸ inspecting project…" },
  { t: "ok", s: "  detected scheme: MyApp (high confidence)" },
  { t: "ok", s: "  detected bundle_id: com.example.myapp" },
  { t: "ok", s: "  signing: automatic — provisioning profile valid" },
  { t: "info", s: "  workflow: version → archive → export → testflight" },
  { t: "info", s: "  nextAction: shipit run beta --dry-run" },
  { t: "done", s: "✓ session ready — attach this JSON to your agent prompt" },
];

const steps = [
  {
    num: "01",
    title: "Run the session command",
    desc: "ai-session inspects your Xcode project and emits a stable JSON snapshot — detected scheme, bundle ID, signing state, and the exact next shipit command.",
  },
  {
    num: "02",
    title: "Hand it to your agent",
    desc: "Paste the JSON into your coding agent's context. It already knows what your project needs — no guessing, no hallucinated flags.",
  },
  {
    num: "03",
    title: "Let the agent drive",
    desc: "The agent runs the suggested commands, handles any questions, and iterates until your beta is in TestFlight. You just review the diff.",
  },
];

export function AISession() {
  return (
    <section
      id="ai-session"
      className="border-y px-6 py-24"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-14">
          <div
            className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase"
            style={{ color: "var(--brand)" }}
          >
            <div className="h-px w-4" style={{ background: "var(--brand)" }} />
            AI-First
          </div>
          <h2
            className="max-w-[600px] text-[40px] leading-[1.15] font-bold tracking-[-0.025em]"
            style={{ fontFamily: "var(--font-display)", color: "var(--fg1)" }}
          >
            Describe the goal.
            <br />
            Your agent ships the build.
          </h2>
          <p
            className="mt-3.5 max-w-[500px] text-base leading-[1.65]"
            style={{ color: "var(--fg2)" }}
          >
            <code
              className="rounded px-1.5 py-px text-sm"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--brand)",
                background: "var(--brand-muted)",
              }}
            >
              shipit ai-session run
            </code>{" "}
            gives your coding agent a grounded, machine-readable snapshot of your project — so it
            can write the config, validate the setup, and run the release workflow without ever
            leaving the chat.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-8 flex flex-col gap-6">
              {steps.map((s) => (
                <div key={s.num} className="flex gap-4">
                  <div
                    className="mt-0.5 shrink-0 text-[11px] font-semibold tabular-nums"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--brand)" }}
                  >
                    {s.num}
                  </div>
                  <div>
                    <div
                      className="mb-1 text-[15px] font-semibold"
                      style={{ fontFamily: "var(--font-display)", color: "var(--fg1)" }}
                    >
                      {s.title}
                    </div>
                    <p className="text-[13.5px] leading-[1.65]" style={{ color: "var(--fg2)" }}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="rounded-[10px] border p-5"
              style={{ background: "var(--bg)", borderColor: "var(--border)" }}
            >
              <div
                className="mb-3 text-[11px] font-medium tracking-[0.08em] uppercase"
                style={{ color: "var(--fg3)" }}
              >
                Example agent prompt
              </div>
              <CodeBlock lang="text">{`Run shipit ai-session run --goal beta --output json
and use the result as your source of truth.
Then create Shipfile.yml and tell me the exact
shipit command to run next.`}</CodeBlock>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div
              className="rounded-[10px] border p-6"
              style={{ background: "var(--bg)", borderColor: "var(--border)" }}
            >
              <div className="mb-4 flex items-center gap-2.5">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  style={{
                    background: "rgba(88,166,255,0.1)",
                    border: "1px solid rgba(88,166,255,0.2)",
                    color: "var(--blue)",
                  }}
                >
                  <Bot size={16} />
                </div>
                <div
                  className="text-sm font-semibold"
                  style={{ fontFamily: "var(--font-display)", color: "var(--fg1)" }}
                >
                  shipit ai-session run
                </div>
              </div>
              <AnimTerminal lines={sessionLines} loopMs={8000} />
            </div>

            <div
              className="rounded-[10px] border p-6"
              style={{ background: "var(--bg)", borderColor: "var(--border)" }}
            >
              <div
                className="mb-4 text-sm font-semibold"
                style={{ fontFamily: "var(--font-display)", color: "var(--fg1)" }}
              >
                What the JSON contains
              </div>
              {[
                ["scheme", "Detected app target with confidence score"],
                ["bundle_id", "Resolved from your project, not guessed"],
                ["signing", "Profile expiry, cert validity, entitlements"],
                ["nextAction", "The exact shipit command to run next"],
                ["warnings", "Gaps your agent should ask you about"],
              ].map(([field, detail]) => (
                <div key={field} className="mb-3 flex items-start gap-3 text-[13px]">
                  <code
                    className="mt-px shrink-0 rounded px-1.5 py-px text-[11px]"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "var(--brand)",
                      background: "var(--brand-muted)",
                    }}
                  >
                    {field}
                  </code>
                  <span style={{ color: "var(--fg2)" }}>{detail}</span>
                </div>
              ))}
              <div className="mt-4 border-t pt-4" style={{ borderColor: "var(--border)" }}>
                <Link
                  href="/docs/getting-started/walkthrough#step-2-create-your-config-file"
                  className="inline-flex items-center gap-1 text-[13px]"
                  style={{ color: "var(--blue)" }}
                >
                  AI session walkthrough
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
