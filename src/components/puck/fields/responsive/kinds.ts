import type { TokenOption } from "@/lib/puck/tokens";
import type { SizeUnit } from "@/lib/puck/style-values";

/**
 * Number
 */
export const responsiveNumberFieldKind = "number";

export type ResponsiveNumberFieldDescriptor = {
  kind: typeof responsiveNumberFieldKind;
  min?: number;
  max?: number;
  step?: number;
};

export function createResponsiveNumberFieldDescriptor(
  options: Omit<ResponsiveNumberFieldDescriptor, "kind"> = {},
): ResponsiveNumberFieldDescriptor {
  return { kind: responsiveNumberFieldKind, ...options };
}


/**
 * Select
 */
export const responsiveSelectFieldKind = "select";

export type ResponsiveSelectFieldDescriptor<T extends string> = {
  kind: typeof responsiveSelectFieldKind;
  options: TokenOption<T>[];
};

export function createResponsiveSelectFieldDescriptor<T extends string>(
  options: TokenOption<T>[],
): ResponsiveSelectFieldDescriptor<T> {
  return { kind: responsiveSelectFieldKind, options };
}

/**
 * Size
 */
export const responsiveSizeFieldKind = "size";

export type ResponsiveSizeFieldDescriptor<P extends string = string> = {
  kind: typeof responsiveSizeFieldKind;
  presets?: TokenOption<P>[];
  units?: SizeUnit[];
  allowAuto?: boolean;
  allowFull?: boolean;
  allowFit?: boolean;
};

export function createResponsiveSizeFieldDescriptor<P extends string>(
  options: Omit<ResponsiveSizeFieldDescriptor<P>, "kind"> = {},
): ResponsiveSizeFieldDescriptor<P> {
  return { kind: responsiveSizeFieldKind, ...options };
}

/**
 * Ratio
 */
export const responsiveRatioFieldKind = "ratio";

export type ResponsiveRatioFieldDescriptor = {
  kind: typeof responsiveRatioFieldKind;
};

export function createResponsiveRatioFieldDescriptor(): ResponsiveRatioFieldDescriptor {
  return { kind: responsiveRatioFieldKind };
}

// Aggregate
export type ResponsiveFieldKind =
  | typeof responsiveSelectFieldKind
  | typeof responsiveNumberFieldKind
  | typeof responsiveSizeFieldKind
  | typeof responsiveRatioFieldKind;

export const responsiveFieldDescriptor = {
  select: createResponsiveSelectFieldDescriptor,
  number: createResponsiveNumberFieldDescriptor,
  size: createResponsiveSizeFieldDescriptor,
  ratio: createResponsiveRatioFieldDescriptor,
};
