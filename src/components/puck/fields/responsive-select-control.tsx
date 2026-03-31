import { AutoField } from "@puckeditor/core";
import type { TokenOption } from "@/lib/puck/tokens";
import type { ResponsiveFieldControlProps } from "./responsive-field-frame";

// Non-base breakpoints can clear their override and inherit from the smaller breakpoint.
const inheritOption: TokenOption<""> = { label: "–", value: "" };

function withInheritOption<T extends string>(
  options: TokenOption<T>[],
): TokenOption<T | "">[] {
  return [inheritOption, ...options];
}

export function toResponsiveSelectValue<T extends string>(value: T | undefined): T | "" {
  return value ?? "";
}

export function fromResponsiveSelectValue<T extends string>(selected: T | ""): T | undefined {
  return selected === "" ? undefined : selected;
}

export function ResponsiveSelectControl<T extends string>({
  isBase,
  value,
  onChange,
  readOnly,
  options,
}: ResponsiveFieldControlProps<T> & {
  options: TokenOption<T>[];
}) {
  const fieldOptions = isBase ? options : withInheritOption(options);
  const isInheriting = !isBase && value === undefined;

  return (
    <div className={isInheriting ? "opacity-40" : undefined}>
      <AutoField
        field={{ type: "select", options: fieldOptions }}
        onChange={(selected: T | "") => {
          onChange(fromResponsiveSelectValue(selected));
        }}
        value={toResponsiveSelectValue(value)}
        readOnly={readOnly}
      />
    </div>
  );
}
