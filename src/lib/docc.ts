/**
 * DocC RenderNode loader and type definitions.
 *
 * Reads JSON files emitted by `swift package generate-documentation` (DocC)
 * from `data/docc/` and exposes a typed API plus reference-resolution helpers.
 *
 * Only the subset of the RenderNode schema actually used by ShipItKit is typed.
 * Unknown fields are preserved as `unknown` to remain forward-compatible.
 */
import fs from "node:fs";
import path from "node:path";

const INDEX_PATH = path.join(process.cwd(), "data", "docc", "index", "index.json");
const METADATA_PATH = path.join(process.cwd(), "data", "docc", "metadata.json");
const MODULE_NODE_PATH = path.join(
  process.cwd(),
  "data",
  "docc",
  "data",
  "documentation",
  "shipitkit.json",
);
const MODULE_NODES_ROOT = path.join(
  process.cwd(),
  "data",
  "docc",
  "data",
  "documentation",
  "shipitkit",
);

// ---------- Inline content ----------

export type InlineFragment =
  | { type: "text"; text: string }
  | { type: "codeVoice"; code: string }
  | { type: "emphasis"; inlineContent: InlineFragment[] }
  | { type: "strong"; inlineContent: InlineFragment[] }
  | {
      type: "reference";
      identifier: string;
      isActive?: boolean;
      overridingTitle?: string;
      overridingTitleInlineContent?: InlineFragment[];
    }
  | { type: "link"; title?: string; destination: string }
  | { type: "image"; identifier: string; metadata?: unknown }
  | { type: "inlineHead"; inlineContent: InlineFragment[] }
  | { type: "newTerm"; inlineContent: InlineFragment[] }
  | { type: "superscript"; inlineContent: InlineFragment[] }
  | { type: "subscript"; inlineContent: InlineFragment[] }
  | { type: "strikethrough"; inlineContent: InlineFragment[] }
  | { type: string; [k: string]: unknown };

// ---------- Block content ----------

export type BlockContent =
  | { type: "paragraph"; inlineContent: InlineFragment[] }
  | { type: "heading"; level: number; text: string; anchor?: string }
  | { type: "codeListing"; syntax?: string | null; code: string[] }
  | {
      type: "unorderedList" | "orderedList";
      items: Array<{ content: BlockContent[] }>;
    }
  | {
      type: "aside";
      style?: string;
      name?: string;
      content: BlockContent[];
    }
  | {
      type: "table";
      header?: "row" | "both" | "none";
      rows: BlockContent[][][];
    }
  | {
      type: "termList";
      items: Array<{
        term: { inlineContent: InlineFragment[] };
        definition: { content: BlockContent[] };
      }>;
    }
  | { type: string; [k: string]: unknown };

// ---------- Sections ----------

export type DeclarationToken = {
  kind: string;
  text: string;
  preciseIdentifier?: string;
  identifier?: string;
};

export type DeclarationSection = {
  kind: "declarations";
  declarations: Array<{
    languages: string[];
    platforms?: string[];
    tokens: DeclarationToken[];
  }>;
};

export type ParametersSection = {
  kind: "parameters";
  parameters: Array<{ name: string; content: BlockContent[] }>;
};

export type ContentSection = {
  kind: "content";
  content: BlockContent[];
};

export type PrimarySection =
  | DeclarationSection
  | ParametersSection
  | ContentSection
  | { kind: string; [k: string]: unknown };

export type TopicSection = {
  title?: string;
  anchor?: string;
  identifiers: string[];
  generated?: boolean;
};

export type RelationshipsSection = {
  kind: "relationships";
  type: string;
  title: string;
  identifiers: string[];
};

// ---------- References ----------

export type RenderReference = {
  type: string;
  identifier: string;
  title?: string;
  url?: string;
  kind?: string;
  role?: string;
  abstract?: InlineFragment[];
  fragments?: DeclarationToken[];
  navigatorTitle?: DeclarationToken[];
  [k: string]: unknown;
};

// ---------- Top-level render node ----------

export type RenderNodeKind = "symbol" | "article" | "collection" | string;

export type RenderNode = {
  kind?: RenderNodeKind;
  schemaVersion?: { major: number; minor: number; patch: number };
  identifier: { interfaceLanguage: string; url: string };
  metadata: {
    title: string;
    role?: string;
    roleHeading?: string;
    symbolKind?: string;
    externalID?: string;
    fragments?: DeclarationToken[];
    navigatorTitle?: DeclarationToken[];
    modules?: Array<{ name: string }>;
    required?: boolean;
    platforms?: Array<{ name: string; introducedAt?: string; deprecated?: string }>;
  };
  hierarchy?: { paths?: string[][] };
  abstract?: InlineFragment[];
  primaryContentSections?: PrimarySection[];
  topicSections?: TopicSection[];
  relationshipsSections?: RelationshipsSection[];
  seeAlsoSections?: TopicSection[];
  references?: Record<string, RenderReference>;
  variants?: Array<{ paths: string[]; traits: Array<{ interfaceLanguage: string }> }>;
};

// ---------- Index ----------

export type IndexNodeKind =
  | "groupMarker"
  | "module"
  | "article"
  | "protocol"
  | "struct"
  | "class"
  | "enum"
  | "method"
  | "property"
  | "init"
  | "case"
  | "associatedtype"
  | "typealias"
  | "func"
  | "var"
  | "extension"
  | string;

export type IndexNode = {
  type: IndexNodeKind;
  title: string;
  path?: string;
  children?: IndexNode[];
};

export type DoccIndex = {
  includedArchiveIdentifiers: string[];
  interfaceLanguages: { swift: IndexNode[] };
};

export type DoccMetadata = {
  schemaVersion: { major: number; minor: number; patch: number };
  bundleDisplayName: string;
  bundleID: string;
};

// ---------- Filesystem availability ----------

export function isDoccAvailable(): boolean {
  try {
    return fs.existsSync(INDEX_PATH) && fs.existsSync(METADATA_PATH);
  } catch {
    return false;
  }
}

let _metadataCache: DoccMetadata | null = null;
let _indexCache: DoccIndex | null = null;
let _nodeCache: Map<string, RenderNode> | null = null;

export function getDoccMetadata(): DoccMetadata | null {
  if (!isDoccAvailable()) return null;
  if (_metadataCache) return _metadataCache;
  const raw = fs.readFileSync(METADATA_PATH, "utf8");
  _metadataCache = JSON.parse(raw) as DoccMetadata;
  return _metadataCache;
}

export function getDoccIndex(): DoccIndex | null {
  if (!isDoccAvailable()) return null;
  if (_indexCache) return _indexCache;
  const raw = fs.readFileSync(INDEX_PATH, "utf8");
  _indexCache = JSON.parse(raw) as DoccIndex;
  return _indexCache;
}

export function loadRenderNode(slug: string[]): RenderNode | null {
  const key = slug.map((s) => s.toLowerCase()).join("/");
  return getRenderNodeCache().get(key) ?? null;
}

function getRenderNodeCache(): Map<string, RenderNode> {
  if (_nodeCache) return _nodeCache;
  const nodes = new Map<string, RenderNode>();
  _nodeCache = nodes;
  if (!isDoccAvailable()) return nodes;

  if (fs.existsSync(MODULE_NODE_PATH)) {
    const raw = fs.readFileSync(MODULE_NODE_PATH, "utf8");
    nodes.set("", JSON.parse(raw) as RenderNode);
  }

  if (!fs.existsSync(MODULE_NODES_ROOT)) return nodes;

  const walk = (dir: string, slugPrefix: string[]) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(entryPath, [...slugPrefix, entry.name.toLowerCase()]);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith(".json")) continue;

      const fileSlug = entry.name.slice(0, -".json".length).toLowerCase();
      const key = [...slugPrefix, fileSlug].join("/");
      const raw = fs.readFileSync(entryPath, "utf8");
      nodes.set(key, JSON.parse(raw) as RenderNode);
    }
  };

  walk(MODULE_NODES_ROOT, []);
  return nodes;
}

/**
 * Convert a DocC identifier URL (e.g. `doc://ShipItKit/documentation/ShipItKit/Action`)
 * into a website route (e.g. `/docs/api/shipitkit/action`). Returns null for
 * external, unresolved, or non-shipitkit references.
 */
export function identifierToHref(identifier: string): string | null {
  // doc://<bundle>/documentation/<module>/<...path>
  const m = identifier.match(/^doc:\/\/[^/]+\/documentation\/([^/]+)(\/.*)?$/i);
  if (!m) return null;
  const moduleName = m[1];
  if (moduleName.toLowerCase() !== "shipitkit") return null;
  const rest = (m[2] ?? "").toLowerCase();
  return `/docs/api/${moduleName.toLowerCase()}${rest}`;
}

/**
 * Walk the DocC index and yield every leaf path (article + symbol). Used by
 * `generateStaticParams` to prerender every API page.
 */
export function listAllSlugs(): string[][] {
  const index = getDoccIndex();
  if (!index) return [];
  const slugs: string[][] = [];
  const walk = (nodes: IndexNode[]) => {
    for (const n of nodes) {
      if (n.type === "groupMarker") continue;
      if (n.path) {
        // path is `/documentation/shipitkit/...`
        const parts = n.path.split("/").filter(Boolean);
        // strip leading "documentation" and module name
        if (parts[0] === "documentation" && parts[1]) {
          const slug = parts.slice(2).map((s) => s.toLowerCase());
          slugs.push(slug);
        }
      }
      if (n.children?.length) walk(n.children);
    }
  };
  walk(index.interfaceLanguages.swift ?? []);
  return slugs;
}

/**
 * Look up the index node for a given slug (used to render local sub-tree
 * navigation under a symbol page).
 */
export function findIndexNode(slug: string[]): IndexNode | null {
  const index = getDoccIndex();
  if (!index) return null;
  const target = "/documentation/shipitkit/" + slug.join("/").toLowerCase();
  let found: IndexNode | null = null;
  const walk = (nodes: IndexNode[]) => {
    for (const n of nodes) {
      if (found) return;
      if (n.path && n.path.toLowerCase() === target) {
        found = n;
        return;
      }
      if (n.children?.length) walk(n.children);
    }
  };
  walk(index.interfaceLanguages.swift ?? []);
  return found;
}
