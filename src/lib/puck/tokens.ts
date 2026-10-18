export type TokenOption<K extends string = string> = {
  value: K;
  label: string;
};

export type Token<K extends string = string> = {
  options: TokenOption<K>[];
  defaultValue: K;
};

// Extracts the extra columns (everything except "label") from a spec value type
// and maps each column to Record<K, V>.
type TokenColumns<K extends string, V extends { label: string }> = {
  [P in keyof V as P extends "label" ? never : P]: Record<K, V[P]>;
};

export type ClassToken<K extends string = string> = Token<K> & {
  classes: Record<K, string>;
};

export function defineToken<const K extends string>(
  spec: Record<K, string>,
  defaultValue?: NoInfer<K>,
): Token<K>;

export function defineToken<
  const K extends string,
  const V extends { label: string },
>(
  spec: Record<K, V>,
  defaultValue?: NoInfer<K>,
): Token<K> & TokenColumns<K, V>;

export function defineToken<const K extends string>(
  spec: Record<K, string | { label: string }>,
  defaultValue?: NoInfer<K>,
) {
  const keys = Object.keys(spec) as K[];
  const first = spec[keys[0]];

  // Plain string values → key is both value and label
  if (typeof first === "string") {
    const options = keys.map((k) => ({
      value: k,
      label: spec[k] as string,
    })) as TokenOption<K>[];
    return { options, defaultValue: defaultValue ?? keys[0] };
  }

  // Object values → extract label + all extra columns
  const options = keys.map((k) => ({
    value: k,
    label: (spec[k] as { label: string }).label,
  })) as TokenOption<K>[];

  const columnNames = Object.keys(first as object).filter(
    (p) => p !== "label",
  );

  const columns = Object.fromEntries(
    columnNames.map((col) => [
      col,
      Object.fromEntries(
        keys.map((k) => [k, (spec[k] as Record<string, unknown>)[col]]),
      ),
    ]),
  );

  return { options, defaultValue: defaultValue ?? keys[0], ...columns };
}

export type TokenValue<T> = T extends Token<infer K> ? K : never;

export const padding = defineToken({
  none:  { label: "None",   classes: "p-0" },
  xs:    { label: "XS",     classes: "p-1" },
  sm:    { label: "Small",  classes: "p-2" },
  md:    { label: "Medium", classes: "p-4" },
  lg:    { label: "Large",  classes: "p-6" },
  xl:    { label: "XL",     classes: "p-8" },
  "2xl": { label: "2XL",    classes: "p-12" },
});

export const paddingX = defineToken({
  none:  { label: "None",   classes: "px-0" },
  xs:    { label: "XS",     classes: "px-1" },
  sm:    { label: "Small",  classes: "px-2" },
  md:    { label: "Medium", classes: "px-4" },
  lg:    { label: "Large",  classes: "px-6" },
  xl:    { label: "XL",     classes: "px-8" },
  "2xl": { label: "2XL",    classes: "px-12" },
});

export const paddingY = defineToken({
  none:  { label: "None",   classes: "py-0" },
  xs:    { label: "XS",     classes: "py-1" },
  sm:    { label: "Small",  classes: "py-2" },
  md:    { label: "Medium", classes: "py-4" },
  lg:    { label: "Large",  classes: "py-6" },
  xl:    { label: "XL",     classes: "py-8" },
  "2xl": { label: "2XL",    classes: "py-12" },
});

export const gap = defineToken({
  none:  { label: "None",   classes: "gap-0" },
  xs:    { label: "XS",     classes: "gap-1" },
  sm:    { label: "Small",  classes: "gap-2" },
  md:    { label: "Medium", classes: "gap-4" },
  lg:    { label: "Large",  classes: "gap-6" },
  xl:    { label: "XL",     classes: "gap-8" },
  "2xl": { label: "2XL",    classes: "gap-12" },
});

export const columnGap = defineToken({
  none:  { label: "None",   classes: "gap-x-0" },
  xs:    { label: "XS",     classes: "gap-x-1" },
  sm:    { label: "Small",  classes: "gap-x-2" },
  md:    { label: "Medium", classes: "gap-x-4" },
  lg:    { label: "Large",  classes: "gap-x-6" },
  xl:    { label: "XL",     classes: "gap-x-8" },
  "2xl": { label: "2XL",    classes: "gap-x-12" },
});

export type Spacing = TokenValue<typeof padding>;

export const bgColor = defineToken({
  background:           { label: "Background",         classes: "bg-background" },
  foreground:           { label: "Foreground",          classes: "bg-foreground" },
  primary:              { label: "Primary",             classes: "bg-primary" },
  "primary-foreground": { label: "Primary Foreground",  classes: "bg-primary-foreground" },
  muted:                { label: "Muted",               classes: "bg-muted" },
  "muted-foreground":   { label: "Muted Foreground",    classes: "bg-muted-foreground" },
  accent:               { label: "Accent",              classes: "bg-accent" },
  "accent-foreground":  { label: "Accent Foreground",   classes: "bg-accent-foreground" },
  destructive:          { label: "Destructive",         classes: "bg-destructive" },
  "sga-red":            { label: "SGA Red",             classes: "bg-sga-red" },
});

export const hexCodeColor = defineToken({
  background:           { label: "Background",         classes: "#ffffff" },
  foreground:           { label: "Foreground",          classes: "#0a0a0a" },
  primary:              { label: "Primary",             classes: "#171717" },
  "primary-foreground": { label: "Primary Foreground",  classes: "#fafafa" },
  muted:                { label: "Muted",               classes: "#f5f5f5" },
  "muted-foreground":   { label: "Muted Foreground",    classes: "#737373" },
  accent:               { label: "Accent",              classes: "#f5f5f5" },
  "accent-foreground":  { label: "Accent Foreground",   classes: "#171717" },
  destructive:          { label: "Destructive",         classes: "#e7000b" },
  "sga-red":            { label: "SGA Red",             classes: "#C8102E" },
});

export const textColor = defineToken({
  background:           { label: "Background",         classes: "text-background" },
  foreground:           { label: "Foreground",          classes: "text-foreground" },
  primary:              { label: "Primary",             classes: "text-primary" },
  "primary-foreground": { label: "Primary Foreground",  classes: "text-primary-foreground" },
  muted:                { label: "Muted",               classes: "text-muted" },
  "muted-foreground":   { label: "Muted Foreground",    classes: "text-muted-foreground" },
  accent:               { label: "Accent",              classes: "text-accent" },
  "accent-foreground":  { label: "Accent Foreground",   classes: "text-accent-foreground" },
  destructive:          { label: "Destructive",         classes: "text-destructive" },
  "sga-red":            { label: "SGA Red",             classes: "text-sga-red" },
});

export type Color = TokenValue<typeof bgColor>;

export const radius = defineToken({
  none: { label: "Square",      classes: "rounded-none" },
  sm:   { label: "Soft",        classes: "rounded-sm" },
  md:   { label: "Rounded",     classes: "rounded-md" },
  lg:   { label: "Large",       classes: "rounded-lg" },
  xl:   { label: "Extra Large", classes: "rounded-xl" },
  full: { label: "Pill",        classes: "rounded-full" },
});

export type Radius = TokenValue<typeof radius>;

export const shadow = defineToken({
  none: { label: "None",     classes: "shadow-none" },
  sm:   { label: "Soft",     classes: "shadow-sm" },
  md:   { label: "Medium",   classes: "shadow-md" },
  lg:   { label: "Large",    classes: "shadow-lg" },
  xl:   { label: "Dramatic", classes: "shadow-xl" },
});

export type Shadow = TokenValue<typeof shadow>;

export const textAlign = defineToken({
  left:   { label: "Left",   classes: "text-left" },
  center: { label: "Center", classes: "text-center" },
  right:  { label: "Right",  classes: "text-right" },
});

export type TextAlign = TokenValue<typeof textAlign>;

export const lineSpacing = defineToken({
  default: { label: "Default", classes: "" },
  tight:   { label: "Tight",   classes: "rich-text-line-spacing leading-tight" },
  snug:    { label: "Snug",    classes: "rich-text-line-spacing leading-snug" },
  normal:  { label: "Normal",  classes: "rich-text-line-spacing leading-normal" },
  relaxed: { label: "Relaxed", classes: "rich-text-line-spacing leading-relaxed" },
  loose:   { label: "Loose",   classes: "rich-text-line-spacing leading-loose" },
});

export type LineSpacing = TokenValue<typeof lineSpacing>;

export const crossAxisAlign = defineToken({
  start:  { label: "Start",  classes: "items-start" },
  center: { label: "Center", classes: "items-center" },
  end:    { label: "End",    classes: "items-end" },
});

export type CrossAxisAlign = TokenValue<typeof crossAxisAlign>;

export const columnCount = defineToken({
  "1": { label: "1", classes: "grid-cols-1" },
  "2": { label: "2", classes: "grid-cols-2" },
  "3": { label: "3", classes: "grid-cols-3" },
  "4": { label: "4", classes: "grid-cols-4" },
  "5": { label: "5", classes: "grid-cols-5" },
  "6": { label: "6", classes: "grid-cols-6" },
});

export type ColumnCount = TokenValue<typeof columnCount>;

export const textColumns = defineToken({
  "1": { label: "1", classes: "columns-1" },
  "2": { label: "2", classes: "columns-2" },
  "3": { label: "3", classes: "columns-3" },
  "4": { label: "4", classes: "columns-4" },
});

export type TextColumnCount = TokenValue<typeof textColumns>;

export const layout = defineToken({
  stack: { label: "Stack", classes: "flex flex-col" },
  row:   { label: "Row",   classes: "flex flex-row flex-wrap" },
});
export type Layout = TokenValue<typeof layout>;

export const justify = defineToken({
  start:   { label: "Start",   classes: "justify-start" },
  center:  { label: "Center",  classes: "justify-center" },
  end:     { label: "End",     classes: "justify-end" },
  between: { label: "Between", classes: "justify-between" },
});
export type Justify = TokenValue<typeof justify>;

export const width = defineToken({
  full:        { label: "Full",     classes: "w-full" },
  prose:       { label: "Prose",    classes: "w-full max-w-prose" },
  "screen-sm": { label: "Small",   classes: "w-full max-w-screen-sm" },
  "screen-md": { label: "Medium",  classes: "w-full max-w-screen-md" },
  "screen-lg": { label: "Large",   classes: "w-full max-w-screen-lg" },
  "screen-xl": { label: "X-Large", classes: "w-full max-w-screen-xl" },
});
export type Width = TokenValue<typeof width>;

// Fixed row counts use auto-rows-[0] + overflow-hidden to collapse excess items,
// so a grid with more children than rows hides the overflow rather than expanding.
export const gridRows = defineToken({
  auto: { label: "Auto", classes: "grid-rows-none auto-rows-auto overflow-visible" },
  "1":  { label: "1",    classes: "grid-rows-1 auto-rows-[0] overflow-hidden" },
  "2":  { label: "2",    classes: "grid-rows-2 auto-rows-[0] overflow-hidden" },
  "3":  { label: "3",    classes: "grid-rows-3 auto-rows-[0] overflow-hidden" },
  "4":  { label: "4",    classes: "grid-rows-4 auto-rows-[0] overflow-hidden" },
  "5":  { label: "5",    classes: "grid-rows-5 auto-rows-[0] overflow-hidden" },
  "6":  { label: "6",    classes: "grid-rows-6 auto-rows-[0] overflow-hidden" },
});
export type GridRows = TokenValue<typeof gridRows>;
