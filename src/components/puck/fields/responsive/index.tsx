import type { CustomField } from "@puckeditor/core";
import type { ResponsiveValue } from "@/lib/puck/responsive";
import type { RatioValue, SizeValue } from "@/lib/puck/style-values";
import { ResponsiveFieldClient } from "./client";
import {
  type ResponsiveNumberFieldDescriptor,
  type ResponsiveRatioFieldDescriptor,
  type ResponsiveSelectFieldDescriptor,
  type ResponsiveSizeFieldDescriptor,
} from "./kinds";

export { responsiveFieldDescriptor } from "./kinds";
export type {
  ResponsiveNumberFieldDescriptor,
  ResponsiveRatioFieldDescriptor,
  ResponsiveSelectFieldDescriptor,
  ResponsiveSizeFieldDescriptor,
} from "./kinds";


export function responsiveField<T extends string>(
  descriptor: ResponsiveSelectFieldDescriptor<T>,
  label: string,
): CustomField<ResponsiveValue<T>>;
export function responsiveField(
  descriptor: ResponsiveNumberFieldDescriptor,
  label: string,
): CustomField<ResponsiveValue<number>>;
export function responsiveField<P extends string>(
  descriptor: ResponsiveSizeFieldDescriptor<P>,
  label: string,
): CustomField<ResponsiveValue<SizeValue<P>>>;
export function responsiveField(
  descriptor: ResponsiveRatioFieldDescriptor,
  label: string,
): CustomField<ResponsiveValue<RatioValue>>;
export function responsiveField(
  descriptor:
    | ResponsiveSelectFieldDescriptor<string>
    | ResponsiveNumberFieldDescriptor
    | ResponsiveSizeFieldDescriptor<string>
    | ResponsiveRatioFieldDescriptor,
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
      value:
        | ResponsiveValue<string>
        | ResponsiveValue<number>
        | ResponsiveValue<SizeValue<string>>
        | ResponsiveValue<RatioValue>
        | string
        | undefined;
      onChange:
        | ((value: ResponsiveValue<string>) => void)
        | ((value: ResponsiveValue<number>) => void)
        | ((value: ResponsiveValue<SizeValue<string>>) => void)
        | ((value: ResponsiveValue<RatioValue>) => void);
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
