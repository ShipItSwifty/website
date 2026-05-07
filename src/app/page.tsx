import { Nav } from "@/components/marketing/nav";
import { Hero } from "@/components/marketing/hero";
import { Overview } from "@/components/marketing/overview";
import { AISession } from "@/components/marketing/ai-session";
import { DocsCTA } from "@/components/marketing/docs-cta";
import { Footer } from "@/components/marketing/footer";
import { siteConfig } from "@/lib/site";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "macOS",
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
        <Overview />
        <div style={{ background: "var(--surface)" }}>
          <Hero />
        </div>
        <AISession />
        <div style={{ background: "var(--surface)" }}>
          <DocsCTA />
        </div>
      </main>
      <Footer />
    </>
  );
}
