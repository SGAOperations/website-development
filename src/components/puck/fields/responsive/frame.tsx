import { FieldLabel } from "@puckeditor/core";
import {
  responsiveBreakpoints,
  setAt,
  type ResponsiveBreakpoint,
  type ResponsiveValue,
} from "@/lib/puck/responsive";
import { useId, type ReactNode } from "react";

const breakpointLabels: Record<ResponsiveBreakpoint, string> = {
  phone: "Phone",
  md: "Tablet",
  lg: "Desktop",
};

export type ResponsiveFieldControlProps<T extends string | number> = {
  id: string;
  breakpoint: ResponsiveBreakpoint;
  isPhone: boolean;
  value: T | undefined;
  onChange: (value: T | undefined) => void;
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
  value: ResponsiveValue<T>;
  onChange: (value: ResponsiveValue<T>) => void;
  readOnly?: boolean;
  renderControl: (props: ResponsiveFieldControlProps<T>) => ReactNode;
}) {
  const id = useId();

  return (
    <FieldLabel label={label} el="div" readOnly={readOnly}>
      <div className="grid grid-cols-3 gap-1">
        {responsiveBreakpoints.map((bp) => {
          const isPhone = bp === "phone";
          const currentValue = value[bp];
          const controlId = `${id}-${bp}`;

          return (
            <div key={bp} className="flex flex-col gap-1">
              {/* Name each control "<field> <breakpoint>" so a screen reader announces e.g. "Padding Tablet". */}
              <label htmlFor={controlId} className="text-xs font-semibold text-muted-foreground">
                <span className="sr-only">{label} </span>
                {breakpointLabels[bp]}
              </label>
              {renderControl({
                id: controlId,
                breakpoint: bp,
                isPhone,
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
