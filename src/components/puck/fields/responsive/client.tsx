"use client";

import type { ComponentType } from "react";
import {
  ResponsiveNumberField,
  type ResponsiveNumberFieldProps,
} from "./number-field";
import {
  ResponsiveRatioField,
  type ResponsiveRatioFieldProps,
} from "./ratio-field";
import {
  ResponsiveSelectField,
  type ResponsiveSelectFieldProps,
} from "./select-field";
import {
  ResponsiveSizeField,
  type ResponsiveSizeFieldProps,
} from "./size-field";
import {
  responsiveNumberFieldKind,
  responsiveRatioFieldKind,
  responsiveSelectFieldKind,
  responsiveSizeFieldKind,
  type ResponsiveFieldKind,
} from "./kinds";

export type ResponsiveFieldClientProps =
  | ResponsiveSelectFieldProps<string>
  | ResponsiveNumberFieldProps
  | ResponsiveSizeFieldProps
  | ResponsiveRatioFieldProps;

const responsiveFieldClientRegistry = {
  [responsiveSelectFieldKind]: ResponsiveSelectField,
  [responsiveNumberFieldKind]: ResponsiveNumberField,
  [responsiveSizeFieldKind]: ResponsiveSizeField,
  [responsiveRatioFieldKind]: ResponsiveRatioField,
} satisfies Record<ResponsiveFieldKind, ComponentType<any>>;

export function ResponsiveFieldClient(props: ResponsiveFieldClientProps) {
  const FieldComponent = responsiveFieldClientRegistry[props.descriptor.kind] as ComponentType<any> | undefined;

  if (!FieldComponent) {
    throw new Error(`Unknown responsive field kind: ${props.descriptor.kind}`);
  }

  return <FieldComponent {...props} />;
}
