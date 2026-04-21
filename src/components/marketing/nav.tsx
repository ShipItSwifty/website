"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GithubIcon as Github } from "@/components/icons/github";
import { LogoMark } from "./logo-mark";
import { ThemeToggle } from "./theme-toggle";
import { SearchButton } from "@/components/search/search-button";
import { siteConfig } from "@/lib/site";

const links = [
  { label: "Overview", href: "/#overview" },
  { label: "Getting Started", href: "/#getting-started" },
  { label: "Features", href: "/#features" },
  { label: "Docs", href: "/docs" },
  { label: "Changelog", href: "/changelog" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: scrolled ? "color-mix(in srgb, var(--bg) 92%, transparent)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: `1px solid ${scrolled ? "var(--border)" : "transparent"}`,
        transition: "background 250ms, border-color 250ms, backdrop-filter 250ms",
      }}
    >
      <nav
        className="mx-auto flex h-[62px] max-w-[1200px] items-center justify-between px-6"
        aria-label="Primary"
      >
        <Link href="/" className="flex items-center gap-2.5" aria-label="ShipItSwifty home">
          <LogoMark aria-hidden />
          <span
            className="text-[17px] font-bold tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ShipIt<span style={{ color: "var(--brand)" }}>Swifty</span>
          </span>
        </Link>
        <div className="flex items-center gap-0.5">
          <div className="hidden items-center gap-0.5 md:flex">
            {links.map((l) => {
              // Hash links are home-page anchors; only treat plain routes as
              // "current". Match by exact path or by /docs prefix for the
              // Docs link so deep doc pages still highlight it.
              const isCurrent = !l.href.includes("#")
                ? pathname === l.href || (l.href !== "/" && pathname?.startsWith(`${l.href}/`))
                : false;
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  aria-current={isCurrent ? "page" : undefined}
                  className="rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors"
                  style={{ color: isCurrent ? "var(--fg1)" : "var(--fg2)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--fg1)";
                    e.currentTarget.style.background = "var(--surface)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = isCurrent ? "var(--fg1)" : "var(--fg2)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
          <div className="mx-2 hidden h-5 w-px md:block" style={{ background: "var(--border)" }} />
          <a
            href={siteConfig.github.cli}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors md:inline-flex"
            style={{ color: "var(--fg2)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--fg1)";
              e.currentTarget.style.background = "var(--surface)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--fg2)";
              e.currentTarget.style.background = "transparent";
            }}
            aria-label="View ShipItSwifty on GitHub"
          >
            <Github size={16} />
            GitHub
          </a>
          <div className="ml-1 flex items-center gap-2">
            <SearchButton variant="compact" />
            <ThemeToggle />
            <Link
              href="/#getting-started"
              className="rounded-md px-4 py-1.5 text-sm font-medium text-white transition-colors"
              style={{
                background: "var(--brand)",
                border: "1px solid var(--brand)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--brand-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--brand)")}
            >
              Install
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
