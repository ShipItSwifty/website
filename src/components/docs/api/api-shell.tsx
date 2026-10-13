import type { ReactNode } from "react";
import { ApiSidebar } from "./api-sidebar";

/** Two-column API layout. Lives in the page, not a layout, so the sidebar knows the current slug. */
export function ApiShell({ slug, children }: { slug: string[]; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">
        <aside
          aria-label="ShipItKit API navigation"
          className="lg:sticky lg:top-[80px] lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto lg:pr-2"
        >
          <div
            className="overflow-hidden rounded-xl border lg:hidden"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
          >
            <details>
              <summary
                className="cursor-pointer list-none px-4 py-3 text-sm font-medium"
                style={{ color: "var(--fg1)" }}
              >
                Browse API docs
              </summary>
              <div className="border-t px-3 py-3" style={{ borderColor: "var(--border)" }}>
                <ApiSidebar slug={slug} />
              </div>
            </details>
          </div>
          <div className="hidden lg:block">
            <ApiSidebar slug={slug} />
          </div>
        </aside>
        <main id="main-content" className="min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
