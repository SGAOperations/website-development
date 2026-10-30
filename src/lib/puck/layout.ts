import { cn } from "@/lib/utils";
import { responsiveBreakpoints, type ResponsiveValue } from "@/lib/puck/responsive";
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

export type GroupStyle = {
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

export function getGroupSurfaceClassName({
  padding,
  width: w,
  bgColor: bg,
  textColor: text,
  radius: r,
  shadow: s,
}: GroupStyle) {
  return cn(
    width.classes[w],
    bgColor.classes[bg],
    textColor.classes[text],
    radius.classes[r],
    shadow.classes[s],
    resolveResponsive(padding, paddingToken.classes),
  );
}

export function getGroupSlotClassName({
  layout: l,
  gap,
  align,
  justify: j,
}: GroupStyle) {
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
    getGridOverflowClassName(columns, rows),
  );
}

/**
 * Fixed row counts collapse extra items to zero height, but they would still be
 * focusable and read by screen readers. Hide them with `visibility` at each breakpoint
 * (rows x columns items stay visible). Needs the matching @source hints in styles.css.
 */
export function getGridOverflowClassName(
  columns: ResponsiveValue<ColumnCount>,
  rows: ResponsiveValue<GridRows>,
) {
  let cols = columns.phone;
  let rowCount = rows.phone;

  return responsiveBreakpoints
    .map((bp) => {
      if (columns[bp] === undefined && rows[bp] === undefined) return "";
      cols = columns[bp] ?? cols;
      rowCount = rows[bp] ?? rowCount;

      const prefix = bp === "phone" ? "" : `${bp}:`;
      if (rowCount === "auto") {
        return bp === "phone" ? "" : `${prefix}[&>*:nth-child(n)]:visible`;
      }

      const limit = Number(rowCount) * Number(cols);
      return `${prefix}[&>*:nth-child(-n+${limit})]:visible ${prefix}[&>*:nth-child(n+${limit + 1})]:invisible`;
    })
    .filter(Boolean)
    .join(" ");
}

export function getMaxCols(columns: ResponsiveValue<ColumnCount>): number {
  return Math.max(...Object.values(columns).map(Number));
}
