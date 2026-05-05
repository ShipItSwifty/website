import { Suspense, type ReactNode } from "react";
import { DocsScrollReset } from "@/components/docs/docs-scroll-reset";
import { Nav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <DocsScrollReset />
      </Suspense>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
