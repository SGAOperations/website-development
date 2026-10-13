import { FieldLabel } from "@puckeditor/core";
import {
  fillResponsiveValue,
  responsiveBreakpoints,
  setAt,
  type PartialResponsiveValue,
  type ResponsiveBreakpoint,
  type ResponsiveValue,
} from "@/lib/puck/responsive";
import type { ReactNode } from "react";

const breakpointLabels: Record<ResponsiveBreakpoint, string> = {
  base: "Phone",
  md: "Tablet",
  lg: "Desktop",
};

export type ResponsiveFieldControlProps<T extends string | number> = {
  breakpoint: ResponsiveBreakpoint;
  value: T;
  onChange: (value: T) => void;
  readOnly?: boolean;
};

export function ResponsiveFieldFrame<T extends string | number>({
  label,
  value,
  onChange,
  readOnly,
  renderControl,
}: {
  label: string;
  value: PartialResponsiveValue<T>;
  onChange: (value: ResponsiveValue<T>) => void;
  readOnly?: boolean;
  renderControl: (props: ResponsiveFieldControlProps<T>) => ReactNode;
}) {
  // Legacy content may omit breakpoints; fall back to base so every control
  // shows a value and any edit writes back a complete set.
  const filledValue = fillResponsiveValue(value);

  return (
    <FieldLabel label={label} el="div" readOnly={readOnly}>
      <div className="grid grid-cols-3 gap-1">
        {responsiveBreakpoints.map((bp) => (
          <div key={bp} className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-muted-foreground">
              {breakpointLabels[bp]}
            </span>
            {renderControl({
              breakpoint: bp,
              value: filledValue[bp],
              onChange: (nextValue) => {
                onChange(setAt(filledValue, bp, nextValue));
              },
              readOnly,
            })}
          </div>
        ))}
      </div>
    </FieldLabel>
  );
}
