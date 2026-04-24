"use client";

export function Footer() {
  return (
    <footer
      className="border-t px-6 py-8"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <div className="mx-auto max-w-[1200px] text-center text-sm" style={{ color: "var(--fg3)" }}>
        Copyright © {new Date().getFullYear()} ShipItSwifty. All rights reserved.
      </div>
    </footer>
  );
}
