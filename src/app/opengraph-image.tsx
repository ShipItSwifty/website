import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#0d1117",
        color: "#e6edf3",
        padding: 80,
        fontFamily: "system-ui, sans-serif",
        position: "relative",
      }}
    >
      {/* Subtle grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(to right, rgba(110,118,129,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(110,118,129,0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Logo + wordmark */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 56,
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 14,
            background: "#fa6800",
            color: "white",
            fontSize: 32,
            fontWeight: 700,
          }}
        >
          S
        </div>
        <div style={{ display: "flex", fontSize: 36, fontWeight: 700, letterSpacing: "-0.02em" }}>
          ShipIt<span style={{ color: "#fa6800" }}>Swifty</span>
        </div>
      </div>

      {/* Main heading */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "auto",
          gap: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            maxWidth: 980,
          }}
        >
          Swift-native release automation for iOS &amp; Android.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#8d96a0",
            lineHeight: 1.4,
            maxWidth: 900,
          }}
        >
          One YAML config. Build, archive, sign, ship. No Ruby required.
        </div>
      </div>

      {/* Footer URL */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 56,
          paddingTop: 24,
          borderTop: "1px solid rgba(110,118,129,0.2)",
          fontSize: 22,
          color: "#8d96a0",
        }}
      >
        <div>shipitswifty.tools</div>
        <div style={{ fontFamily: "monospace" }}>$ shipit ship</div>
      </div>
    </div>,
    { ...size },
  );
}
