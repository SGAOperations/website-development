import type { ComponentData, Data } from "@puckeditor/core";
import type { Color } from "@/lib/puck/tokens";

/** Target of the "Skip to main content" link rendered on every published page. */
export const MAIN_CONTENT_ID = "main-content";

// sRGB equivalents of the theme variables in src/app/styles.css.
// Keep in sync when the palette changes.
export const colorHex: Record<Color, string> = {
  background: "#ffffff",
  foreground: "#0a0a0a",
  primary: "#171717",
  "primary-foreground": "#fafafa",
  muted: "#f5f5f5",
  "muted-foreground": "#737373",
  accent: "#f5f5f5",
  "accent-foreground": "#171717",
  destructive: "#e7000b",
  "sga-red": "#c8102e",
};

/** WCAG 2.2 SC 1.4.3 (AA) minimum for body-size text. */
export const MIN_TEXT_CONTRAST = 4.5;

function relativeLuminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const [light, dark] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/** Editor-facing warning when a text/background token pair fails WCAG AA, otherwise null. */
export function getContrastWarning(bg: Color, text: Color): string | null {
  const ratio = contrastRatio(colorHex[bg], colorHex[text]);
  if (ratio >= MIN_TEXT_CONTRAST) return null;

  // Round down so a failing ratio like 4.47 never displays as "4.5".
  const shown = Math.floor(ratio * 10) / 10;
  return `Low text contrast ${shown}:1 (needs ${MIN_TEXT_CONTRAST}:1)`;
}

function isComponentData(value: unknown): value is ComponentData {
  return typeof value === "object" && value !== null && "type" in value && "props" in value;
}

function containsMain(item: ComponentData): boolean {
  if (item.type === "Group" && item.props.tag === "main") return true;

  return Object.values(item.props).some(
    (value) => Array.isArray(value) && value.some((child) => isComponentData(child) && containsMain(child)),
  );
}

/** Whether the editor already marked part of the page as <main> via a Group. */
export function hasMainLandmark(data: Data): boolean {
  const zones = Object.values(data.zones ?? {});
  return [data.content, ...zones].some((items) => items.some(containsMain));
}
