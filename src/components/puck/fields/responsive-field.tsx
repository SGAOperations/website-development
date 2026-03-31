import type { CustomField } from "@puckeditor/core";
import type { ResponsiveValue } from "@/lib/puck/responsive";
import type { TokenOption } from "@/lib/puck/tokens";
import { ResponsiveFieldClient } from "./responsive-field-client";

export type ResponsiveFieldDescriptor<T extends string> = {
  kind: "select";
  options: TokenOption[];
};

export function responsiveField<T extends string>(
  descriptor: ResponsiveFieldDescriptor<T>,
  label: string,
): CustomField<ResponsiveValue<T>> {
  return {
    type: "custom",
    label,
    render: ({ value, onChange, readOnly }) => (
      <ResponsiveFieldClient
        label={label}
        descriptor={descriptor}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
      />
    ),
  };
}
