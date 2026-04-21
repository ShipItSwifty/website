"use client";

/**
 * Client-side wrapper for sidebar links that adds an `is-current` class
 * when the link's href matches the current pathname. Used by ApiSidebar
 * (a server component) so the heavy index parsing stays on the server while
 * only the active-state hydration runs on the client.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type Props = {
  href: string;
  className: string;
  title?: string;
  children: ReactNode;
};

export function ApiSidebarLink({ href, className, title, children }: Props) {
  const pathname = usePathname();
  const isCurrent = pathname === href;
  return (
    <Link
      href={href}
      aria-current={isCurrent ? "page" : undefined}
      className={`${className}${isCurrent ? "is-current" : ""}`}
      title={title}
    >
      {children}
    </Link>
  );
}
