"use client";

import type { ResponsiveValue } from "@/lib/puck/responsive";
import { ResponsiveFieldFrame } from "../../frame";
import { ResponsiveSelectControl } from "../../select-control";
import type { ResponsiveSelectFieldDescriptor } from "./shared";

export type ResponsiveSelectFieldProps<T extends string> = {
  label: string;
  descriptor: ResponsiveSelectFieldDescriptor<T>;
  value: ResponsiveValue<T>;
  onChange: (value: ResponsiveValue<T>) => void;
  readOnly?: boolean;
};

export function ResponsiveSelectField<T extends string>({
  label,
  descriptor,
  value,
  onChange,
  readOnly,
}: ResponsiveSelectFieldProps<T>) {
  return (
    <ResponsiveFieldFrame
      label={label}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      renderControl={(controlProps) => (
        <ResponsiveSelectControl
          {...controlProps}
          options={descriptor.options}
        />
      )}
    />
  );
}
