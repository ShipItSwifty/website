import Link from "next/link";
import { siteConfig } from "@/lib/site";

const links = [
  { label: "Docs", href: "/docs", external: false },
  { label: "API Reference", href: siteConfig.docs.api, external: false },
  { label: "GitHub", href: siteConfig.github.cli, external: true },
  { label: "Releases", href: `${siteConfig.github.cli}/releases`, external: true },
  { label: "License (MIT)", href: `${siteConfig.github.cli}/blob/main/LICENSE`, external: true },
] as const;

export function Footer() {
  return (
    <footer
      className="border-t px-6 py-8"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-3 text-center">
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm">
          {links.map((l) =>
            l.external ? (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--fg2)" }}
              >
                {l.label}
              </a>
            ) : (
              <Link key={l.label} href={l.href} style={{ color: "var(--fg2)" }}>
                {l.label}
              </Link>
            ),
          )}
        </nav>
        <p className="max-w-[560px] text-[12px] leading-[1.6]" style={{ color: "var(--fg3)" }}>
          This site uses Vercel&rsquo;s cookieless, anonymous analytics to count page views — no
          cookies, no cross-site tracking. The ShipItSwifty CLI itself collects zero telemetry.
        </p>
        <div className="text-sm" style={{ color: "var(--fg3)" }}>
          Copyright © {new Date().getFullYear()} ShipItSwifty. Released under the MIT License.
        </div>
      </div>
    </footer>
  );
}
