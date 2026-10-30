import type { ComponentData, Data } from "@puckeditor/core";
import type { Color } from "@/lib/puck/tokens";
import { colorHex, contrastRatio, MAIN_CONTENT_ID, MIN_TEXT_CONTRAST } from "@/lib/puck/a11y";

// Whole-page accessibility checks for the editor's Accessibility panel and the
// pre-publish prompt. Pure and isomorphic so it can be unit tested and run anywhere.

export type A11yIssue = {
  /** Component id the issue belongs to, or ROOT_ISSUE_ID for page-level issues. */
  id: string;
  /** Component type, e.g. "Image". */
  type: string;
  /** "error" fails WCAG; "warning" is very likely a problem but needs judgement. */
  severity: "error" | "warning";
  message: string;
  /** WCAG success criterion, e.g. "1.1.1 Non-text Content". */
  criterion: string;
};

export const ROOT_ISSUE_ID = "root";

/** WCAG 2.2 SC 1.4.3 (AA) minimum for large text (24px+, or 18.66px+ bold). Headings qualify. */
const MIN_LARGE_TEXT_CONTRAST = 3;

const VAGUE_LINK_TEXT = new Set([
  "click",
  "click here",
  "click me",
  "go",
  "here",
  "learn more",
  "link",
  "more",
  "read more",
  "this link",
]);

const FILE_NAME_RE = /\.(avif|gif|jpe?g|png|svg|webp)$/i;
const MAX_ALT_LENGTH = 150;
const RICH_TEXT_TAG_RE = /<(h[1-6]|a)\b[^>]*>([\s\S]*?)<\/\1>/gi;
const LINK_RE = /<a\b[^>]*>([\s\S]*?)<\/a>/gi;

export function stripTags(html: string): string {
  return html
    // Block boundaries become spaces so "<h1>A</h1><p>B</p>" reads "A B", not "AB".
    .replace(/<\/(p|div|li|h[1-6]|blockquote)>|<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function isComponentData(value: unknown): value is ComponentData {
  return typeof value === "object" && value !== null && "type" in value && "props" in value;
}

function childrenOf(item: ComponentData): ComponentData[] {
  return Object.values(item.props).flatMap((value) =>
    Array.isArray(value) ? value.filter(isComponentData) : [],
  );
}

function isVague(text: string) {
  return VAGUE_LINK_TEXT.has(text.toLowerCase().replace(/[.!…]+$/, ""));
}

function round(ratio: number) {
  return Math.floor(ratio * 10) / 10;
}

/** Effective alt text for an Image block: its own, falling back to the media library's. */
export function getImageAlt(props: Record<string, unknown>): string {
  const own = typeof props.alt === "string" ? props.alt.trim() : "";
  const image = props.image as { alt?: unknown } | null | undefined;
  const library = typeof image?.alt === "string" ? image.alt.trim() : "";
  return own || library;
}

export function checkAccessibility(data: Data): A11yIssue[] {
  const issues: A11yIssue[] = [];
  const headings: { id: string; level: number }[] = [];
  const mainIds: string[] = [];
  const anchors = new Map<string, string[]>();

  const add = (item: { id: string; type: string }, severity: A11yIssue["severity"], message: string, criterion: string) =>
    issues.push({ id: item.id, type: item.type, severity, message, criterion });

  const title = typeof data.root.props?.title === "string" ? data.root.props.title.trim() : "";
  if (!title) {
    add({ id: ROOT_ISSUE_ID, type: "Page" }, "error", "Page has no title. Set one in the Page fields.", "2.4.2 Page Titled");
  }

  function checkContrast(item: { id: string; type: string }, bg: Color, text: Color, min = MIN_TEXT_CONTRAST) {
    const ratio = contrastRatio(colorHex[bg], colorHex[text]);
    if (ratio < min) {
      add(item, "error", `Text contrast is ${round(ratio)}:1; it needs at least ${min}:1.`, "1.4.3 Contrast (Minimum)");
    }
  }

  function checkRichText(item: { id: string; type: string }, html: string, bg: Color) {
    let h2Checked = false;

    const checkLink = (inner: string) => {
      const text = stripTags(inner);
      if (!text) add(item, "error", "A link has no text.", "2.4.4 Link Purpose (In Context)");
      else if (isVague(text)) add(item, "warning", `Link text "${text}" doesn't say where it goes.`, "2.4.4 Link Purpose (In Context)");
    };

    for (const match of html.matchAll(RICH_TEXT_TAG_RE)) {
      const [, tag, inner] = match;

      if (tag.toLowerCase() === "a") {
        checkLink(inner);
        continue;
      }

      // A heading match swallows any links inside it, so check those here.
      for (const [, linkInner] of inner.matchAll(LINK_RE)) checkLink(linkInner);

      const text = stripTags(inner);

      const level = Number(tag[1]);
      if (!text) {
        add(item, "error", `An H${level} heading is empty.`, "1.3.1 Info and Relationships");
        continue;
      }
      headings.push({ id: item.id, level });

      // H2s are always drawn in SGA red (see .prose h2 in styles.css), whatever the text color.
      if (level === 2 && !h2Checked) {
        h2Checked = true;
        const ratio = contrastRatio(colorHex[bg], colorHex["sga-red"]);
        if (ratio < MIN_LARGE_TEXT_CONTRAST) {
          add(item, "error", `H2 headings are SGA red, ${round(ratio)}:1 on this background; they need ${MIN_LARGE_TEXT_CONTRAST}:1.`, "1.4.3 Contrast (Minimum)");
        }
      }
    }
  }

  function visit(item: ComponentData, bg: Color) {
    const props = item.props as Record<string, unknown>;
    const ref = { id: String(props.id), type: item.type };
    let childBg = bg;

    switch (item.type) {
      case "Anchor":
      case "Group": {
        const ownBg = (props.bgColor as Color | undefined) ?? "background";
        checkContrast(ref, ownBg, (props.textColor as Color | undefined) ?? "foreground");
        childBg = ownBg;

        if (item.type === "Group" && props.tag === "main") mainIds.push(ref.id);

        const anchor = typeof props.anchorId === "string" ? props.anchorId.trim() : "";
        if (anchor) anchors.set(anchor, [...(anchors.get(anchor) ?? []), ref.id]);
        break;
      }

      case "Text": {
        checkContrast(ref, bg, (props.textColor as Color | undefined) ?? "foreground");
        if (typeof props.content === "string") checkRichText(ref, props.content, bg);
        break;
      }

      case "Image": {
        const image = props.image as { url?: string } | null | undefined;
        if (!image?.url || props.decorative) break;

        const alt = getImageAlt(props);
        if (!alt) add(ref, "error", "Image has no alt text. Describe it, or mark it as decorative.", "1.1.1 Non-text Content");
        else if (FILE_NAME_RE.test(alt)) add(ref, "warning", `Alt text "${alt}" looks like a file name.`, "1.1.1 Non-text Content");
        else if (alt.length > MAX_ALT_LENGTH) add(ref, "warning", `Alt text is ${alt.length} characters; keep it under ${MAX_ALT_LENGTH} and put details in the page text.`, "1.1.1 Non-text Content");
        break;
      }

      case "Button": {
        const label = typeof props.label === "string" ? props.label.trim() : "";
        if (!label) add(ref, "error", "Button has no text.", "2.4.4 Link Purpose (In Context)");
        else if (isVague(label)) add(ref, "warning", `Button text "${label}" doesn't say what it does.`, "2.4.4 Link Purpose (In Context)");
        if (!props.href) add(ref, "warning", "Button has no link URL, so it looks clickable but does nothing.", "4.1.2 Name, Role, Value");
        break;
      }
    }

    for (const child of childrenOf(item)) visit(child, childBg);
  }

  const zones = Object.values(data.zones ?? {});
  for (const items of [data.content, ...zones]) {
    for (const item of items) visit(item, "background");
  }

  // Page-wide structure.
  for (const id of mainIds.slice(1)) {
    add({ id, type: "Group" }, "error", "Only one Group per page can use the <main> tag.", "1.3.1 Info and Relationships");
  }

  for (const [anchor, ids] of anchors) {
    if (anchor === MAIN_CONTENT_ID) {
      add({ id: ids[0], type: "Anchor" }, "error", `Anchor ID "${anchor}" is reserved for the skip link.`, "2.4.1 Bypass Blocks");
    }
    for (const id of ids.slice(1)) {
      add({ id, type: "Anchor" }, "error", `Anchor ID "${anchor}" is used more than once, so links to it can land on the wrong section.`, "2.4.1 Bypass Blocks");
    }
  }

  const h1s = headings.filter((h) => h.level === 1);
  for (const h of h1s.slice(1)) {
    add({ id: h.id, type: "Text" }, "warning", "Page has more than one H1. Use one H1 for the page's main topic.", "1.3.1 Info and Relationships");
  }

  headings.forEach((h, i) => {
    const previous = headings[i - 1];
    if (previous && h.level > previous.level + 1) {
      add({ id: h.id, type: "Text" }, "warning", `Heading jumps from H${previous.level} to H${h.level}. Don't skip levels.`, "1.3.1 Info and Relationships");
    }
  });

  return issues;
}

/** Spoken name for a block on the editor canvas, e.g. "Image: SGA logo". */
export function describeComponent(item: ComponentData, label: string): string {
  const props = item.props as Record<string, unknown>;
  let summary = "";

  switch (item.type) {
    case "Text":
      summary = typeof props.content === "string" ? stripTags(props.content) : "";
      break;
    case "Image":
      summary = props.decorative ? "decorative" : getImageAlt(props) || "no alt text";
      break;
    case "Button":
      summary = typeof props.label === "string" ? props.label.trim() : "";
      break;
    case "Group":
      summary = props.tag && props.tag !== "div" ? `<${props.tag}>` : "";
      break;
    case "Anchor":
      summary = typeof props.anchorId === "string" ? props.anchorId.trim() : "";
      break;
  }

  if (summary.length > 60) summary = `${summary.slice(0, 59)}…`;
  return summary ? `${label}: ${summary}` : label;
}
