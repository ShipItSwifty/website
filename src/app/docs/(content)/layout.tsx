import type { ReactNode } from "react";
import { DocsSidebar } from "@/components/docs/sidebar";
import { getDocGroups } from "@/lib/docs";

export default async function ContentDocsLayout({ children }: { children: ReactNode }) {
  const groups = await getDocGroups();
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
        <aside
          aria-label="Documentation navigation"
          className="lg:sticky lg:top-[80px] lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto"
        >
          <DocsSidebar groups={groups} />
        </aside>
        <main id="main-content">{children}</main>
      </div>
    </div>
  );
}
