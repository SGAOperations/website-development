import { AutoField } from "@puckeditor/core";
import type { TokenOption } from "@/lib/puck/tokens";
import type { ResponsiveEditorAdapter } from "./responsive-field";

// Shown in non-base breakpoints to let the user clear an override and inherit from the smaller breakpoint.
const inheritOption: TokenOption = { label: "–", value: "" };

export function selectAdapter<T extends string>(
  options: TokenOption[],
): ResponsiveEditorAdapter<T> {
  return {
    render: ({ value, onChange, readOnly, isBase }) => {
      const fieldOptions = isBase ? options : [inheritOption, ...options];
      const currentValue = value ?? "";
      const isInheriting = !isBase && value === undefined;

      return (
        <div className={isInheriting ? "opacity-40" : undefined}>
          <AutoField
            field={{ type: "select", options: fieldOptions }}
            onChange={(selected: string) => {
              onChange(selected === "" ? undefined : (selected as T));
            }}
            value={currentValue}
            readOnly={readOnly}
          />
        </div>
      );
    },
  };
}
