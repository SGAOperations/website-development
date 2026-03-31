import { FieldLabel } from "@puckeditor/core";
import {
  responsiveBreakpoints,
  setAt,
  type ResponsiveBreakpoint,
  type ResponsiveValue,
} from "@/lib/puck/responsive";
import type { ReactNode } from "react";

const breakpointLabels: Record<ResponsiveBreakpoint, string> = {
  base: "Base",
  md: "Tablet",
  lg: "Desktop",
};

export type ResponsiveFieldControlProps<T> = {
  breakpoint: ResponsiveBreakpoint;
  isBase: boolean;
  value: T | undefined;
  onChange: (value: T | undefined) => void;
  readOnly?: boolean;
};

export function ResponsiveFieldFrame<T>({
  label,
  value,
  onChange,
  readOnly,
  renderControl,
}: {
  label: string;
  value: ResponsiveValue<T>;
  onChange: (value: ResponsiveValue<T>) => void;
  readOnly?: boolean;
  renderControl: (props: ResponsiveFieldControlProps<T>) => ReactNode;
}) {
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
              {renderControl({
                breakpoint: bp,
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
