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
  fontFamily,
  type FontFamily,
  type Color,
  type LineSpacing,
  type TextAlign,
  type TextColumnCount,
  type Spacing,
} from "@/lib/puck/tokens";
import type { ResponsiveValue } from "@/lib/puck/responsive";
import { CSSProperties } from "react";

type RichTextProps = {
  content: RichText;
  textColor: Color;
  align: TextAlign;
  lineSpacing: LineSpacing;
  columns: ResponsiveValue<TextColumnCount>;
  columnGap: ResponsiveValue<Spacing>;
  fontFamily: FontFamily;
  fontSize: ResponsiveValue<number>;
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
  fontFamily: field.select(fontFamily, { label: "Font", default: "inter" }),
  fontSize: responsive.number({
    label: "Font Size",
    default: {phone: 20, md: 20, lg: 20},
    min: 5,
    max: 500,
    step: 5
  })
});



export const RichTextComponent: ComponentConfig<RichTextProps> = {
  label: "Text",
  ...props,
  render: ({ content, textColor: tc, align, lineSpacing: ls, columns, columnGap: cg, fontFamily: f, fontSize: fs}) => {
    const fontSizeStyle: CSSProperties & {
      "--rich-text-font-size-md": string;
      "--rich-text-font-size-lg": string;
    } = {
      fontSize: `${fs.phone}px`,
      "--rich-text-font-size-md": `${fs.md ?? fs.phone}px`,
      "--rich-text-font-size-lg": `${fs.lg ?? fs.md ?? fs.phone}px`,
    };

    return (
      <div 
      style={fontSizeStyle}
      className={cn(
        "prose max-w-none md:text-[length:var(--rich-text-font-size-md)] lg:text-[length:var(--rich-text-font-size-lg)]",
        textColor.classes[tc],
        textAlign.classes[align],
        lineSpacing.classes[ls],
        fontFamily.classes[f],
        resolveResponsive(columns, textColumns.classes),
        resolveResponsive(cg, columnGap.classes),
      )}>
        {content}
      </div>
    );
  },
};
