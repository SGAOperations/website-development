"use client";

import type { ComponentType } from "react";
import {
  ResponsiveNumberField,
  type ResponsiveNumberFieldProps,
} from "./number-field";
import {
  ResponsiveSelectField,
  type ResponsiveSelectFieldProps,
} from "./select-field";
import {
  responsiveNumberFieldKind,
  responsiveSelectFieldKind,
  type ResponsiveFieldKind,
} from "./kinds";

export type ResponsiveFieldClientProps =
  | ResponsiveSelectFieldProps<string>
  | ResponsiveNumberFieldProps;

const responsiveFieldClientRegistry = {
  [responsiveSelectFieldKind]: ResponsiveSelectField,
  [responsiveNumberFieldKind]: ResponsiveNumberField,
} satisfies Record<ResponsiveFieldKind, ComponentType<any>>;

export function ResponsiveFieldClient(props: ResponsiveFieldClientProps) {
  const FieldComponent = responsiveFieldClientRegistry[props.descriptor.kind] as ComponentType<any> | undefined;

  if (!FieldComponent) {
    throw new Error(`Unknown responsive field kind: ${props.descriptor.kind}`);
  }

  return <FieldComponent {...props} />;
}
