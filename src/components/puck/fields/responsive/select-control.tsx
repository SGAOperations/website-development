import { AutoField } from "@puckeditor/core";
import type { TokenOption } from "@/lib/puck/tokens";
import type { ResponsiveFieldControlProps } from "./frame";

export function ResponsiveSelectControl<T extends string>({
  value,
  onChange,
  readOnly,
  options,
}: ResponsiveFieldControlProps<T> & {
  options: TokenOption<T>[];
}) {
  return (
    <AutoField
      field={{ type: "select", options }}
      onChange={onChange}
      value={value}
      readOnly={readOnly}
    />
  );
}
