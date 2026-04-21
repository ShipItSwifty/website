import { Nav } from "@/components/marketing/nav";
import { Hero } from "@/components/marketing/hero";
import { Overview } from "@/components/marketing/overview";
import { GettingStarted } from "@/components/marketing/getting-started";
import { Features } from "@/components/marketing/features";
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
        <Hero />
        <Overview />
        <GettingStarted />
        <Features />
        <DocsCTA />
      </main>
      <Footer />
    </>
  );
}
