import { Input } from "@/components/ui/input";
import type { ResponsiveFieldControlProps } from "./frame";

export type ResponsiveNumberChange =
  | { kind: "ignore" }
  | { kind: "set"; value: number | undefined };

export function formatResponsiveNumberValue(value: number | undefined): string {
  return value === undefined ? "" : String(value);
}

export function getResponsiveNumberChange(
  rawValue: string,
  {
    isBase,
    min,
    max,
  }: {
    isBase: boolean;
    min?: number;
    max?: number;
  },
): ResponsiveNumberChange {
  if (rawValue === "") {
    return isBase ? { kind: "ignore" } : { kind: "set", value: undefined };
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
  isBase,
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
  const isInheriting = !isBase && value === undefined;

  return (
    <div className={isInheriting ? "opacity-40" : undefined}>
      <Input
        type="number"
        value={formatResponsiveNumberValue(value)}
        onChange={(event) => {
          const change = getResponsiveNumberChange(event.currentTarget.value, {
            isBase,
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
    </div>
  );
}
