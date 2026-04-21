"use client";

import Link from "next/link";
import { Smartphone, Shield } from "lucide-react";
import { GithubIcon as Github } from "@/components/icons/github";
import { LogoMark } from "./logo-mark";
import { siteConfig } from "@/lib/site";

const cols = [
  {
    title: "Docs",
    links: [
      { label: "Quick Start", href: "/docs/getting-started/quick-start" },
      { label: "Walkthrough", href: "/docs/getting-started/walkthrough" },
      { label: "Configuration Reference", href: "/docs/reference/configuration" },
      { label: "CI Setup", href: "/docs/guides/ci-setup" },
      { label: "Plugin Development", href: "/docs/guides/plugin-development" },
    ],
  },
  {
    title: "Commands",
    links: [
      { label: "shipit build", href: "/docs/reference/configuration#build" },
      { label: "shipit archive", href: "/docs/reference/configuration#archive" },
      { label: "shipit testflight", href: "/docs/reference/configuration#testflight" },
      { label: "shipit ai-session", href: "/docs/getting-started/walkthrough" },
      { label: "shipit doctor", href: "/docs/getting-started/walkthrough" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "GitHub", href: siteConfig.github.cli, external: true },
      {
        label: "Contributing",
        href: `${siteConfig.github.cli}/blob/main/CONTRIBUTING.md`,
        external: true,
      },
      { label: "Changelog", href: "/changelog" },
      {
        label: "License (MIT)",
        href: `${siteConfig.github.cli}/blob/main/LICENSE`,
        external: true,
      },
      { label: "API Reference", href: "/docs/api" },
    ],
  },
];

const badges = [
  {
    label: "iOS",
    color: "#F05138",
    icon: <Smartphone size={10} />,
  },
  {
    label: "Android",
    color: "#3FB950",
    icon: <Smartphone size={10} />,
  },
  {
    label: "Open Source",
    color: "#58A6FF",
    icon: <Github size={10} />,
  },
  {
    label: "MIT License",
    color: "#D29922",
    icon: <Shield size={10} />,
  },
];

export function Footer() {
  return (
    <footer
      className="border-t px-6 pt-16 pb-10"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-14 grid grid-cols-2 gap-12 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4 flex items-center gap-2.5">
              <LogoMark size={22} aria-hidden />
              <span
                className="text-[15px] font-bold tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                ShipIt<span style={{ color: "var(--brand)" }}>Swifty</span>
              </span>
            </div>
            <p className="max-w-[260px] text-[13px] leading-[1.7]" style={{ color: "var(--fg3)" }}>
              Swift-native CLI toolkit for iOS and Android release automation. Built entirely in
              Swift 6.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {badges.map(({ label, color, icon }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1 rounded-full border px-2 py-[3px] text-[11px] font-medium"
                  style={{
                    color,
                    background: `${color}12`,
                    borderColor: `${color}30`,
                  }}
                >
                  {icon}
                  {label}
                </span>
              ))}
            </div>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <div
                className="mb-4 text-[11px] font-medium tracking-[0.08em] uppercase"
                style={{ color: "var(--fg3)" }}
              >
                {col.title}
              </div>
              {col.links.map((l) => {
                const isExternal = "external" in l && l.external;
                const isMono = l.label.startsWith("shipit");
                const className = "mb-2.5 block text-[13px] transition-colors";
                const style = {
                  color: "var(--fg3)",
                  fontFamily: isMono ? "var(--font-mono)" : "var(--font-body)",
                } as const;
                if (isExternal) {
                  return (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={className}
                      style={style}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg1)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg3)")}
                    >
                      {l.label}
                    </a>
                  );
                }
                return (
                  <Link
                    key={l.label}
                    href={l.href}
                    className={className}
                    style={style}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg1)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg3)")}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
        <div
          className="flex flex-wrap items-center justify-between gap-3 border-t pt-6"
          style={{ borderColor: "var(--border)" }}
        >
          <span className="text-xs" style={{ color: "var(--fg3)" }}>
            MIT License · {siteConfig.github.cliRepo}
          </span>
          <span
            className="text-[11px]"
            style={{ fontFamily: "var(--font-mono)", color: "var(--fg3)" }}
          >
            Swift 6 · macOS 15+
          </span>
        </div>
      </div>
    </footer>
  );
}
