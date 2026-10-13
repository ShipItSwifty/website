/**
 * API navigation sidebar built from DocC's `index.json`.
 *
 * Server component that reads the index from disk and renders the symbol
 * tree as nested links. Active-link highlighting is delegated to a small
 * client subcomponent that reads `usePathname()`.
 *
 * Only the top level and the branch containing the current page are expanded.
 * The full tree has thousands of nodes, and rendering it into every prerendered
 * page multiplied the build output by the number of pages.
 */
import { type IndexNode, getDoccIndex, isDoccAvailable, routeSegment } from "@/lib/docc";
import { ApiSidebarLink } from "./api-sidebar-link";

export function ApiSidebar({ slug = [] }: { slug?: string[] }) {
  if (!isDoccAvailable()) return null;
  const index = getDoccIndex();
  if (!index) return null;
  const root = index.interfaceLanguages.swift?.[0];
  if (!root) return null;

  return (
    <nav className="docc-sidebar" aria-label="ShipItKit API">
      <ApiSidebarLink href="/docs/api/shipitkit" className="docc-sidebar-root">
        {root.title}
      </ApiSidebarLink>
      {root.children?.length ? (
        <NavList nodes={root.children} activeBranch={slug[0]?.toLowerCase()} />
      ) : null}
    </nav>
  );
}

function NavList({
  nodes,
  depth = 0,
  activeBranch,
}: {
  nodes: IndexNode[];
  depth?: number;
  activeBranch?: string;
}) {
  return (
    <ul className="docc-sidebar-list" style={{ paddingLeft: depth === 0 ? 0 : "0.75rem" }}>
      {nodes.map((n, i) => {
        if (n.type === "groupMarker") {
          return (
            <li key={`g-${i}`} className="docc-sidebar-group">
              {n.title}
            </li>
          );
        }
        const href = n.path
          ? `/docs/api${n.path.toLowerCase().replace("/documentation/", "/").split("/").map(routeSegment).join("/")}`
          : null;
        return (
          <li key={n.path ?? `n-${i}`} className="docc-sidebar-item">
            {href ? (
              <ApiSidebarLink href={href} className="docc-sidebar-link" title={n.title}>
                {n.title}
              </ApiSidebarLink>
            ) : (
              <span className="docc-sidebar-link" title={n.title}>
                {n.title}
              </span>
            )}
            {n.children?.length && (depth > 0 || isActiveBranch(n, activeBranch)) ? (
              <NavList nodes={n.children} depth={depth + 1} />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

/** Whether a top-level node is the first path segment of the page being rendered. */
function isActiveBranch(node: IndexNode, activeBranch?: string): boolean {
  if (!activeBranch || !node.path) return false;
  return node.path.toLowerCase().split("/")[3] === activeBranch;
}
