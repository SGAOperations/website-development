export const spacingValues = ["none", "xs", "sm", "md", "lg", "xl", "2xl"] as const;
export const colorValues = [
  "background",
  "foreground",
  "primary",
  "primary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "sga-red",
] as const;
export const radiusValues = ["none", "sm", "md", "lg", "xl", "full"] as const;
export const shadowValues = ["none", "sm", "md", "lg", "xl"] as const;
export const fontSizeValues = [
  "xs",
  "sm",
  "base",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
] as const;
export const fontWeightValues = [
  "normal",
  "medium",
  "semibold",
  "bold",
] as const;
export const alignValues = ["left", "center", "right"] as const;

export type Spacing = (typeof spacingValues)[number];
export type Color = (typeof colorValues)[number];
export type Radius = (typeof radiusValues)[number];
export type Shadow = (typeof shadowValues)[number];
export type FontSize = (typeof fontSizeValues)[number];
export type FontWeight = (typeof fontWeightValues)[number];
export type Align = (typeof alignValues)[number];

// Shared cva variant maps — single source of truth for token-to-class mappings.

export const paddingVariants = {
  none: "p-0",
  xs: "p-1",
  sm: "p-2",
  md: "p-4",
  lg: "p-6",
  xl: "p-8",
  "2xl": "p-12",
} as const;

export const gapVariants = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
  "2xl": "gap-12",
} as const;

export const bgColorVariants = {
  background: "bg-background",
  foreground: "bg-foreground",
  primary: "bg-primary",
  "primary-foreground": "bg-primary-foreground",
  muted: "bg-muted",
  "muted-foreground": "bg-muted-foreground",
  accent: "bg-accent",
  "accent-foreground": "bg-accent-foreground",
  destructive: "bg-destructive",
  "sga-red": "bg-sga-red",
} as const;

export const textColorVariants = {
  background: "text-background",
  foreground: "text-foreground",
  primary: "text-primary",
  "primary-foreground": "text-primary-foreground",
  muted: "text-muted",
  "muted-foreground": "text-muted-foreground",
  accent: "text-accent",
  "accent-foreground": "text-accent-foreground",
  destructive: "text-destructive",
  "sga-red": "text-sga-red",
} as const;

export const radiusVariants = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
} as const;

export const shadowVariants = {
  none: "shadow-none",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
} as const;

export const alignVariants = {
  left: "items-start",
  center: "items-center",
  right: "items-end",
} as const;

export function selectFrom<const T extends readonly string[]>(
  values: T,
  label: string,
) {
  return {
    type: "select" as const,
    label,
    options: values.map((v) => ({
      label: v.charAt(0).toUpperCase() + v.slice(1),
      value: v,
    })),
  };
}

export function radioFrom<const T extends readonly string[]>(
  values: T,
  label: string,
) {
  return {
    type: "radio" as const,
    label,
    options: values.map((v) => ({
      label: v.charAt(0).toUpperCase() + v.slice(1),
      value: v,
    })),
  };
}

export const fields = {
  padding: (label = "Padding") => selectFrom(spacingValues, label),
  gap: (label = "Gap") => selectFrom(spacingValues, label),
  bgColor: (label = "Background") => selectFrom(colorValues, label),
  textColor: (label = "Text color") => selectFrom(colorValues, label),
  radius: (label = "Corners") => selectFrom(radiusValues, label),
  shadow: (label = "Shadow") => selectFrom(shadowValues, label),
  fontSize: (label = "Size") => selectFrom(fontSizeValues, label),
  fontWeight: (label = "Weight") => selectFrom(fontWeightValues, label),
  align: (label = "Alignment") => radioFrom(alignValues, label),
} as const;
