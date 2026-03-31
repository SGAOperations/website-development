"use client";

import type { ResponsiveValue } from "@/lib/puck/responsive";
import { ratioPresets, type RatioPreset, type RatioValue } from "@/lib/puck/style-values";
import { ResponsiveFieldFrame } from "./frame";
import { ResponsiveRatioControl } from "./ratio-control";
import type { ResponsiveRatioFieldDescriptor } from "./kinds";

export type ResponsiveRatioFieldProps = {
  label: string;
  descriptor: ResponsiveRatioFieldDescriptor;
  value: ResponsiveValue<RatioValue> | RatioPreset | "auto" | undefined;
  onChange: (value: ResponsiveValue<RatioValue>) => void;
  readOnly?: boolean;
};

function normalizeResponsiveRatioFieldValue(
  value: ResponsiveValue<RatioValue> | RatioPreset | "auto" | undefined,
): ResponsiveValue<RatioValue> {
  if (typeof value === "string") {
    if (value === "auto") {
      return { base: { mode: "none" } };
    }

    if (value in ratioPresets) {
      return {
        base: {
          mode: "preset",
          preset: value as RatioPreset,
        },
      };
    }
  }

  if (
    value &&
    typeof value === "object" &&
    "base" in value &&
    typeof value.base === "object" &&
    value.base !== null &&
    "mode" in value.base
  ) {
    return value as ResponsiveValue<RatioValue>;
  }

  return {
    base: { mode: "none" },
  };
}

export function ResponsiveRatioField({
  label,
  descriptor,
  value,
  onChange,
  readOnly,
}: ResponsiveRatioFieldProps) {
  const normalizedValue = normalizeResponsiveRatioFieldValue(value);

  return (
    <ResponsiveFieldFrame
      label={label}
      value={normalizedValue}
      onChange={onChange}
      readOnly={readOnly}
      renderControl={(controlProps) => (
        <ResponsiveRatioControl
          {...controlProps}
        />
      )}
    />
  );
}
