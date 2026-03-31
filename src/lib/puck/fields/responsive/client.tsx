"use client";

import type { ComponentType } from "react";
import {
  responsiveFieldClientRegistry,
  type ResponsiveFieldClientProps,
} from "./kinds/registry";

export type { ResponsiveFieldClientProps } from "./kinds/registry";

export function ResponsiveFieldClient(props: ResponsiveFieldClientProps) {
  const FieldComponent = responsiveFieldClientRegistry[props.descriptor.kind] as ComponentType<any> | undefined;

  if (!FieldComponent) {
    throw new Error(`Unknown responsive field kind: ${props.descriptor.kind}`);
  }

  return <FieldComponent {...props} />;
}
