"use client";

import type { ComponentType } from "react";
import {
  responsiveFieldClientRegistry,
  type ResponsiveFieldClientProps,
} from "./responsive-kinds/client-registry";

export type { ResponsiveFieldClientProps } from "./responsive-kinds/client-registry";

export function ResponsiveFieldClient(props: ResponsiveFieldClientProps) {
  const FieldComponent = responsiveFieldClientRegistry[props.descriptor.kind] as ComponentType<any>;

  return <FieldComponent {...props} />;
}
