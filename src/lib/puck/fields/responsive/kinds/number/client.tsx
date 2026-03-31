"use client";

import type { ResponsiveValue } from "@/lib/puck/responsive";
import { ResponsiveFieldFrame } from "../../frame";
import { ResponsiveNumberControl } from "../../number-control";
import type { ResponsiveNumberFieldDescriptor } from "./shared";

export type ResponsiveNumberFieldProps = {
  label: string;
  descriptor: ResponsiveNumberFieldDescriptor;
  value: ResponsiveValue<number>;
  onChange: (value: ResponsiveValue<number>) => void;
  readOnly?: boolean;
};

export function ResponsiveNumberField({
  label,
  descriptor,
  value,
  onChange,
  readOnly,
}: ResponsiveNumberFieldProps) {
  return (
    <ResponsiveFieldFrame
      label={label}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      renderControl={(controlProps) => (
        <ResponsiveNumberControl
          {...controlProps}
          min={descriptor.min}
          max={descriptor.max}
          step={descriptor.step}
        />
      )}
    />
  );
}
