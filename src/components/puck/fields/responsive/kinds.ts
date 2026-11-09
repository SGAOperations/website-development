import type { TokenOption } from "@/lib/puck/tokens";

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

// Aggregate
export type ResponsiveFieldKind =
  | typeof responsiveSelectFieldKind
  | typeof responsiveNumberFieldKind;

export const responsiveFieldDescriptor = {
  select: createResponsiveSelectFieldDescriptor,
  number: createResponsiveNumberFieldDescriptor,
};
