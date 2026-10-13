import { Input } from "@/components/ui/input";
import type { ResponsiveFieldControlProps } from "./frame";

export type ResponsiveNumberChange =
  | { kind: "ignore" }
  | { kind: "set"; value: number };

export function formatResponsiveNumberValue(value: number): string {
  return String(value);
}

export function getResponsiveNumberChange(
  rawValue: string,
  {
    min,
    max,
  }: {
    min?: number;
    max?: number;
  } = {},
): ResponsiveNumberChange {
  // Every breakpoint must keep a value, so an empty input is never committed.
  if (rawValue === "") {
    return { kind: "ignore" };
  }

  const nextValue = Number(rawValue);
  if (Number.isNaN(nextValue)) {
    return { kind: "ignore" };
  }

  if (typeof min !== "undefined" && nextValue < min) {
    return { kind: "ignore" };
  }

  if (typeof max !== "undefined" && nextValue > max) {
    return { kind: "ignore" };
  }

  return { kind: "set", value: nextValue };
}

export function ResponsiveNumberControl({
  value,
  onChange,
  readOnly,
  min,
  max,
  step,
}: ResponsiveFieldControlProps<number> & {
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <Input
      type="number"
      value={formatResponsiveNumberValue(value)}
      onChange={(event) => {
        const change = getResponsiveNumberChange(event.currentTarget.value, {
          min,
          max,
        });

        if (change.kind === "set") {
          onChange(change.value);
        }
      }}
      readOnly={readOnly}
      min={min}
      max={max}
      step={step}
    />
  );
}
