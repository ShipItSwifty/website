import { Nav } from "@/components/marketing/nav";
import { Hero } from "@/components/marketing/hero";
import { Overview } from "@/components/marketing/overview";
import { Features } from "@/components/marketing/features";
import { AISession } from "@/components/marketing/ai-session";
import { GettingStarted } from "@/components/marketing/getting-started";
import { Privacy } from "@/components/marketing/privacy";
import { DocsCTA } from "@/components/marketing/docs-cta";
import { Footer } from "@/components/marketing/footer";
import { siteConfig } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "macOS, Linux",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    license: `${siteConfig.github.cli}/blob/main/LICENSE`,
    codeRepository: siteConfig.github.cli,
    programmingLanguage: "Swift",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main id="main-content">
        <div style={{ background: "var(--surface)" }}>
          <Hero />
        </div>
        <Overview />
        <Features />
        <AISession />
        <div style={{ background: "var(--surface)" }}>
          <GettingStarted />
        </div>
        <Privacy />
        <div style={{ background: "var(--surface)" }}>
          <DocsCTA />
        </div>
      </main>
      <Footer />
    </>
  );
}
