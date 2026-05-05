import type { ReactNode } from "react";
import { DocsScrollReset } from "@/components/docs/docs-scroll-reset";
import { Nav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DocsScrollReset />
      <Nav />
      {children}
      <Footer />
    </>
  );
}
