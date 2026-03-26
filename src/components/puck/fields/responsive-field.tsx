import { FieldLabel, type CustomField } from "@puckeditor/core";
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

export type ResponsiveEditorAdapter<T> = {
  render: (props: {
    value: T | undefined;
    onChange: (value: T | undefined) => void;
    readOnly?: boolean;
    isBase: boolean;
  }) => ReactNode;
};

function ResponsiveField<T>({
  adapter,
  value,
  onChange,
  readOnly,
}: {
  adapter: ResponsiveEditorAdapter<T>;
  value: ResponsiveValue<T>;
  onChange: (value: ResponsiveValue<T>) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="grid grid-cols-3 gap-1">
      {responsiveBreakpoints.map((bp) => {
        const isBase = bp === "base";
        const currentValue = value[bp];

        return (
          <div key={bp} className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-muted-foreground">
              {breakpointLabels[bp]}
            </span>
            {adapter.render({
              value: currentValue,
              onChange: (nextValue) => {
                onChange(setAt(value, bp, nextValue));
              },
              readOnly,
              isBase,
            })}
          </div>
        );
      })}
    </div>
  );
}

export function responsiveField<T>(
  adapter: ResponsiveEditorAdapter<T>,
  label: string,
): CustomField<ResponsiveValue<T>> {
  return {
    type: "custom",
    label,
    render: ({ value, onChange, readOnly }) => (
      <FieldLabel label={label} el="div" readOnly={readOnly}>
        <ResponsiveField
          adapter={adapter}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
        />
      </FieldLabel>
    ),
  };
}
