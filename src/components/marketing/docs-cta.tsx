"use client";

import { useState } from "react";
import Link from "next/link";
import { Cpu, Shield, GitBranch, type LucideIcon } from "lucide-react";
import { GithubIcon as Github } from "@/components/icons/github";
import { siteConfig } from "@/lib/site";

interface DocCard {
  Icon: LucideIcon;
  title: string;
  desc: string;
  href: string;
  link: string;
}

const cards: DocCard[] = [
  {
    Icon: Cpu,
    title: "Configuration Reference",
    desc: "Full Shipfile.yml schema, all keys and defaults.",
    href: "/docs/reference/configuration",
    link: "View reference →",
  },
  {
    Icon: Shield,
    title: "CI Setup Guide",
    desc: "GitHub Actions, Bitrise, and self-hosted runners.",
    href: "/docs/guides/ci-setup",
    link: "Read guide →",
  },
  {
    Icon: GitBranch,
    title: "Migrating from fastlane",
    desc: "Lane-by-lane migration playbook with examples.",
    href: "/docs/getting-started/migrating-from-fastlane",
    link: "Start migration →",
  },
];

function Card({ Icon, title, desc, link, href }: DocCard) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="block rounded-[10px] border p-6 transition-colors"
      style={{
        background: "var(--surface)",
        borderColor: hov ? "var(--border-active)" : "var(--border)",
      }}
    >
      <div className="mb-3.5" style={{ color: "var(--brand)" }}>
        <Icon size={20} />
      </div>
      <h3
        className="mb-2 text-[15px] font-semibold"
        style={{ fontFamily: "var(--font-display)", color: "var(--fg1)" }}
      >
        {title}
      </h3>
      <p className="mb-4 text-[13.5px] leading-[1.6]" style={{ color: "var(--fg2)" }}>
        {desc}
      </p>
      <span
        className="text-[13px] transition-colors"
        style={{ color: hov ? "var(--blue-hover)" : "var(--blue)" }}
      >
        {link}
      </span>
    </Link>
  );
}

export function DocsCTA() {
  return (
    <section id="docs" className="mx-auto max-w-[1200px] px-6 py-24">
      <div className="mb-13">
        <div
          className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase"
          style={{ color: "var(--brand)" }}
        >
          <div className="h-px w-4" style={{ background: "var(--brand)" }} />
          Documentation
        </div>
        <h2
          className="text-[40px] leading-[1.15] font-bold tracking-[-0.025em]"
          style={{ fontFamily: "var(--font-display)", color: "var(--fg1)" }}
        >
          Everything is documented.
        </h2>
        <p
          className="mt-3.5 max-w-[460px] text-base leading-[1.65]"
          style={{ color: "var(--fg2)" }}
        >
          Reference docs, guides, and CI playbooks — all in one place.
        </p>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.title} {...c} />
        ))}
      </div>

      <div
        className="grid grid-cols-1 items-center gap-8 rounded-xl border px-12 py-10 md:grid-cols-[1fr_auto]"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div>
          <h3
            className="mb-2.5 text-2xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--fg1)" }}
          >
            Public beta, feedback via GitHub issues.
          </h3>
          <p className="max-w-[480px] text-[15px] leading-[1.65]" style={{ color: "var(--fg2)" }}>
            ShipItSwifty is ready to try, but we are still smoothing edges. Use it, ship with it,
            and open GitHub issues for bug reports, feedback, or missing features.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <a
            href={siteConfig.github.cli}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border px-[26px] py-2.5 text-[15px] font-medium transition-colors"
            style={{ color: "var(--fg2)", borderColor: "var(--border)" }}
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
            View Source
          </a>
        </div>
      </div>
    </section>
  );
}
