"use client";

import Link from "next/link";
import { Bot, ArrowRight } from "lucide-react";
import { AnimTerminal, type TerminalLine } from "./anim-terminal";
import { CodeBlock } from "./code-block";

const sessionLines: TerminalLine[] = [
  { t: "prompt", s: "shipit ai-session" },
  { t: "dim", s: "▸ analyzing project…" },
  { t: "ok", s: "  ✓ project context captured" },
  { t: "ok", s: "  ✓ shipit documentation included" },
  { t: "ok", s: "  ✓ available commands resolved" },
  { t: "done", s: "✓ session JSON ready — paste into your agent prompt" },
];

const steps = [
  {
    num: "01",
    title: "Run ai-session",
    desc: (
      <>
        <code>shipit ai-session</code> generates a machine-readable snapshot: your project
        structure, available <code>shipit</code> commands, and documentation - everything an AI
        agent needs to understand your setup.
      </>
    ),
  },
  {
    num: "02",
    title: "Feed it to your agent",
    desc: (
      <>
        Paste the JSON into your coding agent's prompt. The agent learns about <code>shipit</code>,
        analyzes your project context, and generates a <code>Shipfile.yml</code> tailored to your
        app.
      </>
    ),
  },
  {
    num: "03",
    title: "Agent asks, you confirm",
    desc: (
      <>
        If anything is ambiguous - signing identity, <code>TestFlight</code> group, and
        <code>export method</code> - the agent asks for clarification before proceeding.
      </>
    ),
  },
];

export function AISession() {
  return (
    <section
      id="ai-session"
      className="border-y px-6 py-24"
      style={{ background: "var(--bg)", borderColor: "var(--border)" }}
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
            Tell your agent
            <br />
            what to ship.
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
              shipit ai-session
            </code>{" "}
            generates a machine-readable context dump — shipit documentation, available commands,
            and your project details — so any coding agent can understand the tool and generate a
            correct Shipfile.yml without guessing.
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
                    <p
                      className="text-[13.5px] leading-[1.65] [&_code]:rounded [&_code]:bg-[var(--brand-muted)] [&_code]:px-1.5 [&_code]:py-px [&_code]:text-[11px] [&_code]:text-[var(--brand)] [&_code]:font-[var(--font-mono)]"
                      style={{
                        color: "var(--fg2)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
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
              <CodeBlock lang="text">{`Run shipit ai-session --output json and use
the output as context to understand my project
and the shipit tool. Then generate a Shipfile.yml
for my app. Ask me for clarification if anything
is ambiguous or missing.`}</CodeBlock>
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
                  shipit ai-session
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
                ["docs", "Full shipit command documentation and usage"],
                ["commands", "All available shipit commands and their flags"],
                ["project", "Detected project structure and targets"],
                ["context", "Environment details the agent needs to know"],
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
                  href="/docs/getting-started/ios-quickstart"
                  className="inline-flex items-center gap-1 text-[13px]"
                  style={{ color: "var(--blue)" }}
                >
                  Generate walkthrough
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
