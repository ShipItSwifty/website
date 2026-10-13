import type { ReactNode } from "react";

// The two-column shell lives in the page (see ApiShell) because the sidebar
// needs the current slug, which a layout above the catch-all can't see.
export default function ApiDocsLayout({ children }: { children: ReactNode }) {
  return children;
}
