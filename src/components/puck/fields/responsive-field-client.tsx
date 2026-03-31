"use client";

import { AutoField, FieldLabel } from "@puckeditor/core";
import {
  responsiveBreakpoints,
  setAt,
  type ResponsiveBreakpoint,
  type ResponsiveValue,
} from "@/lib/puck/responsive";
import type { TokenOption } from "@/lib/puck/tokens";
import type { ResponsiveFieldDescriptor } from "./responsive-field";

const breakpointLabels: Record<ResponsiveBreakpoint, string> = {
  base: "Base",
  md: "Tablet",
  lg: "Desktop",
};

// Non-base breakpoints can clear their override and inherit from the smaller breakpoint.
const inheritOption: TokenOption = { label: "–", value: "" };

type ResponsiveFieldClientProps<T extends string> = {
  label: string;
  descriptor: ResponsiveFieldDescriptor<T>;
  value: ResponsiveValue<T>;
  onChange: (value: ResponsiveValue<T>) => void;
  readOnly?: boolean;
};

function renderFieldControl<T extends string>({
  descriptor,
  isBase,
  value,
  onChange,
  readOnly,
}: {
  descriptor: ResponsiveFieldDescriptor<T>;
  isBase: boolean;
  value: T | undefined;
  onChange: (value: T | undefined) => void;
  readOnly?: boolean;
}) {
  switch (descriptor.kind) {
    case "select": {
      const fieldOptions = isBase ? descriptor.options : [inheritOption, ...descriptor.options];
      const isInheriting = !isBase && value === undefined;

      return (
        <div className={isInheriting ? "opacity-40" : undefined}>
          <AutoField
            field={{ type: "select", options: fieldOptions }}
            onChange={(selected: string) => {
              onChange(selected === "" ? undefined : (selected as T));
            }}
            value={value ?? ""}
            readOnly={readOnly}
          />
        </div>
      );
    }
  }
}

export function ResponsiveFieldClient<T extends string>({
  label,
  descriptor,
  value,
  onChange,
  readOnly,
}: ResponsiveFieldClientProps<T>) {
  return (
    <FieldLabel label={label} el="div" readOnly={readOnly}>
      <div className="grid grid-cols-3 gap-1">
        {responsiveBreakpoints.map((bp) => {
          const isBase = bp === "base";
          const currentValue = value[bp];

          return (
            <div key={bp} className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-muted-foreground">
                {breakpointLabels[bp]}
              </span>
              {renderFieldControl({
                descriptor,
                isBase,
                value: currentValue,
                onChange: (nextValue) => {
                  onChange(setAt(value, bp, nextValue));
                },
                readOnly,
              })}
            </div>
          );
        })}
      </div>
    </FieldLabel>
  );
}
