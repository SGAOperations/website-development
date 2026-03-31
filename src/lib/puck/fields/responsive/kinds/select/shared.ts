import type { TokenOption } from "@/lib/puck/tokens";

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
