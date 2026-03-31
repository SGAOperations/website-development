import {
  createResponsiveNumberFieldDescriptor,
  responsiveNumberFieldKind,
  type ResponsiveNumberFieldDescriptor,
} from "./number/shared";
import {
  createResponsiveSelectFieldDescriptor,
  responsiveSelectFieldKind,
  type ResponsiveSelectFieldDescriptor,
} from "./select/shared";

export type { ResponsiveNumberFieldDescriptor } from "./number/shared";
export type { ResponsiveSelectFieldDescriptor } from "./select/shared";

export type ResponsiveFieldKind =
  | typeof responsiveSelectFieldKind
  | typeof responsiveNumberFieldKind;

export const responsiveFieldDescriptor = {
  select: createResponsiveSelectFieldDescriptor,
  number: createResponsiveNumberFieldDescriptor,
};
