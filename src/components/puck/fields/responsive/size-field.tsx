"use client";

import type { ResponsiveValue } from "@/lib/puck/responsive";
import type { SizeValue } from "@/lib/puck/style-values";
import { ResponsiveFieldFrame } from "./frame";
import { ResponsiveSizeControl } from "./size-control";
import type { ResponsiveSizeFieldDescriptor } from "./kinds";

export type ResponsiveSizeFieldProps = {
  label: string;
  descriptor: ResponsiveSizeFieldDescriptor<string>;
  value: ResponsiveValue<SizeValue<string>> | string | undefined;
  onChange: (value: ResponsiveValue<SizeValue<string>>) => void;
  readOnly?: boolean;
};

function normalizeResponsiveSizeFieldValue(
  value: ResponsiveValue<SizeValue<string>> | string | undefined,
  descriptor: ResponsiveSizeFieldDescriptor<string>,
): ResponsiveValue<SizeValue<string>> {
  if (typeof value === "string") {
    const hasPreset = descriptor.presets?.some((option) => option.value === value);
    if (hasPreset) {
      return {
        base: {
          mode: "preset",
          preset: value,
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
    return value as ResponsiveValue<SizeValue<string>>;
  }

  return {
    base: { mode: "none" },
  };
}

export function ResponsiveSizeField({
  label,
  descriptor,
  value,
  onChange,
  readOnly,
}: ResponsiveSizeFieldProps) {
  const normalizedValue = normalizeResponsiveSizeFieldValue(value, descriptor);

  return (
    <ResponsiveFieldFrame
      label={label}
      value={normalizedValue}
      onChange={onChange}
      readOnly={readOnly}
      renderControl={(controlProps) => (
        <ResponsiveSizeControl
          {...controlProps}
          descriptor={descriptor}
        />
      )}
    />
  );
}
