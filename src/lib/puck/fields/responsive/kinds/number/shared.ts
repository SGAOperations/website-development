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
