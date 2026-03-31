import type { CustomField } from "@puckeditor/core";
import type { ResponsiveValue } from "@/lib/puck/responsive";
import { ResponsiveFieldClient } from "./responsive-field-client";
import {
  type ResponsiveNumberFieldDescriptor,
  type ResponsiveSelectFieldDescriptor,
} from "./responsive-kinds";

export { responsiveFieldDescriptor } from "./responsive-kinds";
export type {
  ResponsiveNumberFieldDescriptor,
  ResponsiveSelectFieldDescriptor,
} from "./responsive-kinds";

export function responsiveField<T extends string>(
  descriptor: ResponsiveSelectFieldDescriptor<T>,
  label: string,
): CustomField<ResponsiveValue<T>>;
export function responsiveField(
  descriptor: ResponsiveNumberFieldDescriptor,
  label: string,
): CustomField<ResponsiveValue<number>>;
export function responsiveField(
  descriptor: ResponsiveSelectFieldDescriptor<string> | ResponsiveNumberFieldDescriptor,
  label: string,
): CustomField<any> {
  return {
    type: "custom" as const,
    label,
    render: ({
      value,
      onChange,
      readOnly,
    }: {
      value: ResponsiveValue<string> | ResponsiveValue<number>;
      onChange:
        | ((value: ResponsiveValue<string>) => void)
        | ((value: ResponsiveValue<number>) => void);
      readOnly?: boolean;
    }) => (
      // Puck's custom field render callback does not preserve the descriptor/value coupling,
      // so the client dispatcher re-establishes it from descriptor.kind.
      <ResponsiveFieldClient
        label={label}
        descriptor={descriptor as any}
        value={value as any}
        onChange={onChange as any}
        readOnly={readOnly}
      />
    ),
  };
}
