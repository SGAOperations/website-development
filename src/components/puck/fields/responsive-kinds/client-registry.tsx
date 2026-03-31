"use client";

import type { ComponentType } from "react";
import {
  ResponsiveNumberField,
  type ResponsiveNumberFieldProps,
} from "./number/client";
import { responsiveNumberFieldKind } from "./number/shared";
import {
  ResponsiveSelectField,
  type ResponsiveSelectFieldProps,
} from "./select/client";
import { responsiveSelectFieldKind } from "./select/shared";
import type { ResponsiveFieldKind } from "./index";

export type ResponsiveFieldClientProps =
  | ResponsiveSelectFieldProps<string>
  | ResponsiveNumberFieldProps;

export const responsiveFieldClientRegistry = {
  [responsiveSelectFieldKind]: ResponsiveSelectField,
  [responsiveNumberFieldKind]: ResponsiveNumberField,
} satisfies Record<ResponsiveFieldKind, ComponentType<any>>;
