import type { ComponentConfig, RichText } from "@puckeditor/core";
import { cn } from "@/lib/utils";
import { defineProps, field, responsive } from "@/lib/puck/define-props";
import { resolveResponsive } from "@/lib/puck/responsive-tailwind";
import {
  textColor,
  textAlign,
  lineSpacing,
  textColumns,
  columnGap,
  padding,
  bgColor,
  type Color,
  type LineSpacing,
  type TextAlign,
  type TextColumnCount,
  type Spacing,
} from "@/lib/puck/tokens";
import type { ResponsiveValue } from "@/lib/puck/responsive";

type RichTextProps = {
  content: RichText;
  textColor: Color;
  align: TextAlign;
  lineSpacing: LineSpacing;
  columns: ResponsiveValue<TextColumnCount>;
  columnGap: ResponsiveValue<Spacing>;
  padding: Spacing;
  backgroundColor: Color;
};

const props = defineProps({
  content: field.raw(
    { type: "richtext", contentEditable: true },
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  ),
  textColor: field.select(textColor, { label: "Text color", default: "foreground" }),
  align: field.radio(textAlign, { label: "Text align", default: "left" }),
  lineSpacing: field.select(lineSpacing, { label: "Line spacing", default: "default" }),
  columns: responsive.select(textColumns, { label: "Columns", default: "1" }),
  columnGap: responsive.select(columnGap, { label: "Column gap", default: "md" }),
  padding: field.select(padding, {label: "Padding", default: "md"}),
  backgroundColor: field.select(bgColor, {label: "Background Color", default: "background"}),
});

export const RichTextComponent: ComponentConfig<RichTextProps> = {
  label: "Text",
  ...props,
  render: ({ content, textColor: tc, align, lineSpacing: ls, columns, columnGap: cg, padding: p, backgroundColor: bg }) => {
    return (
      <div className={cn(
        "prose max-w-none",
        textColor.classes[tc],
        textAlign.classes[align],
        lineSpacing.classes[ls],
        padding.classes[p],
        bgColor.classes[bg],
        resolveResponsive(columns, textColumns.classes),
        resolveResponsive(cg, columnGap.classes),
      )}>
        {content}
      </div>
    );
  },
};
