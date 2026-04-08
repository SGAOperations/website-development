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

export function getColumnTrackCount(columns: ColumnCount): number {
  return columns.includes(":") ? columns.split(":").length : Number(columns);
}

export function getMaxCols(columns: ResponsiveValue<ColumnCount>): number {
  return Math.max(...Object.values(columns).map(getColumnTrackCount));
}
