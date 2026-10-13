import { cn } from "@/lib/utils";
import type { ResponsiveValue } from "@/lib/puck/responsive";
import { resolveResponsive } from "@/lib/puck/responsive-tailwind";
import {
  bgColor,
  columnCount,
  crossAxisAlign,
  gap as gapToken,
  gridRows,
  justify,
  layout as layoutToken,
  padding as paddingToken,
  radius,
  shadow,
  textColor,
  width,
  type Color,
  type ColumnCount,
  type CrossAxisAlign,
  type GridRows,
  type Justify,
  type Layout,
  type Radius,
  type Shadow,
  type Spacing,
  type Width,
} from "@/lib/puck/tokens";

export type ContainerStyle = {
  layout: Layout;
  padding: ResponsiveValue<Spacing>;
  gap: ResponsiveValue<Spacing>;
  align: CrossAxisAlign;
  justify: Justify;
  width: Width;
  bgColor: Color;
  textColor: Color;
  radius: Radius;
  shadow: Shadow;
};

export function getContainerSurfaceClassName({
  padding,
  width: w,
  bgColor: bg,
  textColor: text,
  radius: r,
  shadow: s,
}: ContainerStyle) {
  return cn(
    width.classes[w],
    bgColor.classes[bg],
    textColor.classes[text],
    radius.classes[r],
    shadow.classes[s],
    resolveResponsive(padding, paddingToken.classes),
  );
}

export function getContainerSlotClassName({
  layout: l,
  gap,
  align,
  justify: j,
}: ContainerStyle) {
  return cn(
    "w-full",
    layoutToken.classes[l],
    crossAxisAlign.classes[align],
    justify.classes[j],
    resolveResponsive(gap, gapToken.classes),
  );
}

export function getGridClassName({
  columns,
  rows,
  gap,
  empty = false,
}: {
  columns: ResponsiveValue<ColumnCount>;
  rows: ResponsiveValue<GridRows>;
  gap: ResponsiveValue<Spacing>;
  empty?: boolean;
}) {
  return cn(
    "grid w-full",
    empty && "min-h-[200px]",
    resolveResponsive(columns, columnCount.classes),
    resolveResponsive(rows, gridRows.classes),
    resolveResponsive(gap, gapToken.classes),
  );
}

export function getMaxCols(columns: ResponsiveValue<ColumnCount>): number {
  return Math.max(...Object.values(columns).map(Number));
}

const responsiveViewportWidths = {
  md: 768,
  lg: 1024,
} as const;

function resolveResponsiveValue<T>(
  value: ResponsiveValue<T>,
  viewportWidth: number | "100%",
): T {
  const orderedBreakpoints = viewportWidth === "100%"
    ? ["lg", "md", "base"] as const
    : viewportWidth >= responsiveViewportWidths.lg
      ? ["lg", "md", "base"] as const
      : viewportWidth >= responsiveViewportWidths.md
        ? ["md", "base"] as const
        : ["base"] as const;

  for (const breakpoint of orderedBreakpoints) {
    const breakpointValue = value[breakpoint];

    if (breakpointValue !== undefined) {
      return breakpointValue;
    }
  }

  return value.base;
}

export function getGridCapacity(
  columns: ResponsiveValue<ColumnCount>,
  rows: ResponsiveValue<GridRows>,
  viewportWidth: number | "100%",
): number | null {
  const resolvedRows = resolveResponsiveValue(rows, viewportWidth);

  if (resolvedRows === "auto") {
    return null;
  }

  const resolvedColumns = Number(resolveResponsiveValue(columns, viewportWidth));
  return resolvedColumns * Number(resolvedRows);
}
