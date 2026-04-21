import type { ReactNode } from "react";
import { ApiSidebar } from "@/components/docs/api/api-sidebar";

export default function ApiDocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
        <aside
          aria-label="ShipItKit API navigation"
          className="lg:sticky lg:top-[80px] lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto lg:pr-2"
        >
          <ApiSidebar />
        </aside>
        <main id="main-content">{children}</main>
      </div>
    </div>
  );
}
