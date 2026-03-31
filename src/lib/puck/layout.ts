import { cn } from "@/lib/utils";
import type { ResponsiveValue } from "@/lib/puck/responsive";
import { resolveResponsive } from "@/lib/puck/responsive-tailwind";
import {
  createResponsiveStyle,
  mapResponsiveValue,
  mergeResponsiveStyles,
  normalizeLegacyMaxWidthSizeValue,
  normalizeResponsiveRatioValue,
  normalizeResponsiveSizeValue,
  ratioValueToCss,
  sizeValueToCss,
  widthPresetValues,
  type RatioValue,
  type ResponsiveCssVariables,
  type SizeValue,
} from "@/lib/puck/style-values";
import {
  bgColor,
  columnCount,
  columnTemplate,
  crossAxisAlign,
  gap as gapToken,
  gridRows,
  justify,
  layout as layoutToken,
  overflowX as overflowXToken,
  overflowY as overflowYToken,
  padding as paddingToken,
  paddingX as paddingXToken,
  paddingY as paddingYToken,
  radius,
  shadow,
  textColor,
  verticalAlign,
  type Color,
  type ColumnCount,
  type ColumnTemplate,
  type CrossAxisAlign,
  type GridRows,
  type Justify,
  type Layout,
  type OverflowX,
  type OverflowY,
  type Radius,
  type Shadow,
  type Spacing,
  type VerticalAlign,
  type Width,
  type WidthPreset,
} from "@/lib/puck/tokens";

export type ResponsiveSize<P extends string = string> = ResponsiveValue<SizeValue<P>>;
export type ResponsiveMaxWidth = ResponsiveValue<SizeValue<WidthPreset>> | Width;

export type ContainerStyle = {
  layout: Layout;
  padding: ResponsiveValue<Spacing>;
  gap: ResponsiveValue<Spacing>;
  align: CrossAxisAlign;
  justify: Justify;
  boxWidth: ResponsiveSize<WidthPreset>;
  width: ResponsiveMaxWidth;
  minWidth: ResponsiveSize<WidthPreset>;
  height: ResponsiveSize;
  minHeight: ResponsiveSize;
  maxHeight: ResponsiveSize;
  aspectRatio: ResponsiveValue<RatioValue>;
  overflowX: OverflowX;
  overflowY: OverflowY;
  bgColor: Color;
  textColor: Color;
  radius: Radius;
  shadow: Shadow;
};

function getResponsiveSizeStyle<P extends string>({
  className,
  variableName,
  value,
  presetValues,
}: {
  className: string;
  variableName: string;
  value: ResponsiveValue<SizeValue<P>>;
  presetValues?: Record<P, string>;
}) {
  return createResponsiveStyle(
    className,
    variableName,
    mapResponsiveValue(
      normalizeResponsiveSizeValue(value),
      (currentValue) => sizeValueToCss(currentValue, presetValues),
    ),
  );
}

function getResponsiveRatioStyle({
  className,
  variableName,
  value,
}: {
  className: string;
  variableName: string;
  value: ResponsiveValue<RatioValue>;
}) {
  return createResponsiveStyle(
    className,
    variableName,
    mapResponsiveValue(normalizeResponsiveRatioValue(value), ratioValueToCss),
  );
}

export function getContainerSurface({
  padding,
  boxWidth,
  width,
  minWidth,
  height,
  minHeight,
  maxHeight,
  aspectRatio,
  overflowX,
  overflowY,
  bgColor: bg,
  textColor: text,
  radius: r,
  shadow: s,
}: ContainerStyle): { className: string; style?: ResponsiveCssVariables } {
  const responsiveStyle = mergeResponsiveStyles(
    getResponsiveSizeStyle({
      className: "puck-width",
      variableName: "puck-width",
      value: boxWidth,
      presetValues: widthPresetValues,
    }),
    getResponsiveSizeStyle({
      className: "puck-max-width",
      variableName: "puck-max-width",
      value: normalizeLegacyMaxWidthSizeValue(width),
      presetValues: widthPresetValues,
    }),
    getResponsiveSizeStyle({
      className: "puck-min-width",
      variableName: "puck-min-width",
      value: minWidth,
      presetValues: widthPresetValues,
    }),
    getResponsiveSizeStyle({
      className: "puck-height",
      variableName: "puck-height",
      value: height,
    }),
    getResponsiveSizeStyle({
      className: "puck-min-height",
      variableName: "puck-min-height",
      value: minHeight,
    }),
    getResponsiveSizeStyle({
      className: "puck-max-height",
      variableName: "puck-max-height",
      value: maxHeight,
    }),
    getResponsiveRatioStyle({
      className: "puck-aspect-ratio",
      variableName: "puck-aspect-ratio",
      value: aspectRatio,
    }),
  );

  return {
    className: cn(
      "w-full",
      bgColor.classes[bg],
      textColor.classes[text],
      radius.classes[r],
      shadow.classes[s],
      overflowXToken.classes[overflowX],
      overflowYToken.classes[overflowY],
      resolveResponsive(padding, paddingToken.classes),
      responsiveStyle.className,
    ),
    style: responsiveStyle.style,
  };
}

export function getContainerSlotClassName({
  layout: l,
  gap,
  align,
  justify: j,
}: Pick<ContainerStyle, "layout" | "gap" | "align" | "justify">) {
  return cn(
    "w-full",
    layoutToken.classes[l],
    crossAxisAlign.classes[align],
    justify.classes[j],
    resolveResponsive(gap, gapToken.classes),
  );
}

export function getSectionOuter({
  paddingX,
  paddingY,
  bgColor: bg,
  textColor: text,
  minHeight,
  verticalContentAlign,
}: {
  paddingX: ResponsiveValue<Spacing>;
  paddingY: ResponsiveValue<Spacing>;
  bgColor: Color;
  textColor: Color;
  minHeight: ResponsiveSize;
  verticalContentAlign: VerticalAlign;
}): { className: string; style?: ResponsiveCssVariables } {
  const responsiveStyle = mergeResponsiveStyles(
    getResponsiveSizeStyle({
      className: "puck-min-height",
      variableName: "puck-min-height",
      value: minHeight,
    }),
  );

  return {
    className: cn(
      "flex w-full flex-col",
      bgColor.classes[bg],
      textColor.classes[text],
      verticalAlign.classes[verticalContentAlign],
      resolveResponsive(paddingY, paddingYToken.classes),
      resolveResponsive(paddingX, paddingXToken.classes),
      responsiveStyle.className,
    ),
    style: responsiveStyle.style,
  };
}

export function getSectionContent({
  width,
}: {
  width: ResponsiveMaxWidth;
}): { className: string; style?: ResponsiveCssVariables } {
  const responsiveStyle = mergeResponsiveStyles(
    getResponsiveSizeStyle({
      className: "puck-max-width",
      variableName: "puck-max-width",
      value: normalizeLegacyMaxWidthSizeValue(width),
      presetValues: widthPresetValues,
    }),
  );

  return {
    className: cn("mx-auto w-full", responsiveStyle.className),
    style: responsiveStyle.style,
  };
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

export function getColumnTemplateStyles(
  columns: ResponsiveValue<ColumnTemplate>,
): { className: string; style?: ResponsiveCssVariables } {
  return mergeResponsiveStyles(
    createResponsiveStyle(
      "puck-grid-template-columns",
      "puck-grid-template-columns",
      mapResponsiveValue(columns, (value) => columnTemplate.template[value]),
    ),
  );
}

export function getMaxCols(columns: ResponsiveValue<ColumnTemplate>): number {
  return Math.max(...Object.values(columns).map((value) => columnTemplate.count[value]));
}
