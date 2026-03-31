import type { CSSProperties } from "react";
import { responsiveBreakpoints, type ResponsiveValue } from "@/lib/puck/responsive";
import { width, type Width, type WidthPreset } from "@/lib/puck/tokens";

export const sizeUnits = ["px", "rem", "%", "vw", "vh", "svh"] as const;
export type SizeUnit = (typeof sizeUnits)[number];
export const sizeModes = ["none", "auto", "full", "fit", "preset", "custom"] as const;
export type SizeMode = (typeof sizeModes)[number];

export type SizeValue<P extends string = string> =
  | { mode: Extract<SizeMode, "none"> }
  | { mode: Extract<SizeMode, "auto"> }
  | { mode: Extract<SizeMode, "full"> }
  | { mode: Extract<SizeMode, "fit"> }
  | { mode: Extract<SizeMode, "preset">; preset: P }
  | { mode: Extract<SizeMode, "custom">; value: number; unit: SizeUnit };

export const ratioPresets = {
  square: "1 / 1",
  photo: "4 / 3",
  landscape: "3 / 2",
  video: "16 / 9",
  wide: "21 / 9",
} as const;

export type RatioPreset = keyof typeof ratioPresets;

export type RatioValue =
  | { mode: "none" }
  | { mode: "preset"; preset: RatioPreset }
  | { mode: "custom"; width: number; height: number };

export type ResponsiveCssVariables = CSSProperties & Record<`--${string}`, string>;

export const widthPresetOptions = width.options.filter(
  (option): option is { value: WidthPreset; label: string } => option.value !== "full",
);

export function sizeValueToCss<P extends string>(
  value: SizeValue<P> | undefined,
  presetValues?: Record<P, string>,
): string | undefined {
  if (!value) {
    return undefined;
  }

  switch (value.mode) {
    case "none":
      return undefined;
    case "auto":
      return "auto";
    case "full":
      return "100%";
    case "fit":
      return "fit-content";
    case "preset":
      return presetValues?.[value.preset];
    case "custom":
      return `${value.value}${value.unit}`;
    default:
      return undefined;
  }
}

export function ratioValueToCss(value: RatioValue | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  switch (value.mode) {
    case "none":
      return undefined;
    case "preset":
      return ratioPresets[value.preset];
    case "custom":
      return `${value.width} / ${value.height}`;
    default:
      return undefined;
  }
}

export function normalizeLegacyRatioValue(
  value: RatioPreset | "auto" | ResponsiveValue<RatioValue> | undefined,
): ResponsiveValue<RatioValue> {
  if (!value || typeof value !== "object") {
    if (!value) {
      return { base: { mode: "none" } };
    }
  }

  if (typeof value === "string") {
    if (value === "auto") {
      return { base: { mode: "none" } };
    }

    return {
      base: { mode: "preset", preset: value },
    };
  }

  return value;
}

export function normalizeLegacyMaxWidthSizeValue(
  value: Width | ResponsiveValue<SizeValue<WidthPreset>> | undefined,
): ResponsiveValue<SizeValue<WidthPreset>> {
  if (!value || typeof value !== "object") {
    if (!value) {
      return { base: { mode: "none" } };
    }
  }

  if (typeof value === "string") {
    if (value === "full") {
      return {
        base: { mode: "none" },
      };
    }

    return {
      base: { mode: "preset", preset: value },
    };
  }

  return value;
}

export function normalizeResponsiveSizeValue<P extends string>(
  value: ResponsiveValue<SizeValue<P>> | undefined,
): ResponsiveValue<SizeValue<P>> {
  if (!value || typeof value !== "object" || value.base === undefined) {
    return { base: { mode: "none" } };
  }

  return value;
}

export function normalizeResponsiveRatioValue(
  value: ResponsiveValue<RatioValue> | undefined,
): ResponsiveValue<RatioValue> {
  if (!value || typeof value !== "object" || value.base === undefined) {
    return { base: { mode: "none" } };
  }

  return value;
}

export function createResponsiveStyle(
  className: string,
  variableName: string,
  value: ResponsiveValue<string | undefined> | undefined,
): { className?: string; style?: ResponsiveCssVariables } {
  if (!value || value.base === undefined) {
    return {};
  }

  const style = {} as ResponsiveCssVariables;
  let hasValue = false;

  for (const breakpoint of responsiveBreakpoints) {
    const cssValue = value[breakpoint];
    if (cssValue === undefined) {
      continue;
    }

    style[`--${variableName}-${breakpoint}`] = cssValue;
    hasValue = true;
  }

  return hasValue
    ? {
      className,
      style,
    }
    : {};
}

export function mapResponsiveValue<T, R>(
  value: ResponsiveValue<T> | undefined,
  mapValue: (value: T) => R,
): ResponsiveValue<R> | undefined {
  if (!value || value.base === undefined) {
    return undefined;
  }

  const mapped = {
    base: mapValue(value.base),
  } as ResponsiveValue<R>;

  for (const breakpoint of responsiveBreakpoints) {
    if (breakpoint === "base") {
      continue;
    }

    const breakpointValue = value[breakpoint];
    if (breakpointValue !== undefined) {
      mapped[breakpoint] = mapValue(breakpointValue);
    }
  }

  return mapped;
}

export function mergeResponsiveStyles(
  ...entries: Array<{ className?: string; style?: ResponsiveCssVariables }>
): { className: string; style: ResponsiveCssVariables | undefined } {
  const className = entries
    .map((entry) => entry.className)
    .filter(Boolean)
    .join(" ");

  const style = entries.reduce<ResponsiveCssVariables>((acc, entry) => {
    if (entry.style) {
      Object.assign(acc, entry.style);
    }

    return acc;
  }, {} as ResponsiveCssVariables);

  return {
    className,
    style: Object.keys(style).length > 0 ? style : undefined,
  };
}

export const widthPresetValues = widthPresetOptions.reduce<Record<WidthPreset, string>>(
  (acc, option) => {
    acc[option.value] = width.cssValue[option.value];
    return acc;
  },
  {} as Record<WidthPreset, string>,
);
