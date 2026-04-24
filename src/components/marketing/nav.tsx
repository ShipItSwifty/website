"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
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
        className="mx-auto flex h-[62px] max-w-[1200px] items-center justify-between px-4 sm:px-6"
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
          <div className="ml-1 flex items-center gap-1.5 sm:gap-2">
            <SearchButton variant="compact" />
            <ThemeToggle />
            <a
              href={siteConfig.github.cli}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border transition-colors"
              style={{ color: "var(--fg2)", borderColor: "var(--border)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--fg1)";
                e.currentTarget.style.background = "var(--surface)";
                e.currentTarget.style.borderColor = "var(--border-active)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--fg2)";
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
              aria-label="View ShipItSwifty on GitHub"
            >
              <Github size={14} />
            </a>
            <details className="relative md:hidden">
              <summary
                className="inline-flex h-8 w-8 cursor-pointer list-none items-center justify-center rounded-md border"
                style={{ color: "var(--fg2)", borderColor: "var(--border)" }}
                aria-label="Open navigation menu"
              >
                <Menu size={14} />
              </summary>
              <div
                className="absolute top-10 right-0 w-[220px] overflow-hidden rounded-xl border py-2 shadow-xl"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.18)",
                }}
              >
                {links.map((l) => {
                  const isCurrent = !l.href.includes("#")
                    ? pathname === l.href || (l.href !== "/" && pathname?.startsWith(`${l.href}/`))
                    : false;

                  return (
                    <Link
                      key={`mobile-${l.label}`}
                      href={l.href}
                      aria-current={isCurrent ? "page" : undefined}
                      className="block px-4 py-2.5 text-sm transition-colors"
                      style={{ color: isCurrent ? "var(--fg1)" : "var(--fg2)" }}
                    >
                      {l.label}
                    </Link>
                  );
                })}
              </div>
            </details>
          </div>
        </div>
      </nav>
    </header>
  );
}
