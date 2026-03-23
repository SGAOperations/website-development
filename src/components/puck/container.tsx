import type { ComponentConfig } from "@puckeditor/core";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  fields,
  paddingVariants,
  gapVariants,
  alignVariants,
  bgColorVariants,
  textColorVariants,
  radiusVariants,
  shadowVariants,
  type Spacing,
  type Color,
  type Radius,
  type Shadow,
  type Align,
} from "@/lib/puck/tokens";

const tags = [
  "div",
  "section",
  "article",
  "header",
  "footer",
  "aside",
  "main",
  "nav",
] as const;

type Tag = (typeof tags)[number];

const layoutValues = ["stack", "row"] as const;
type Layout = (typeof layoutValues)[number];

const justifyValues = ["start", "center", "end", "between"] as const;
type Justify = (typeof justifyValues)[number];

const widthValues = [
  "full",
  "prose",
  "screen-sm",
  "screen-md",
  "screen-lg",
  "screen-xl",
] as const;
type Width = (typeof widthValues)[number];

const containerVariants = cva("", {
  variants: {
    layout: {
      stack: "flex flex-col",
      row: "flex flex-row flex-wrap",
    },
    padding: paddingVariants,
    gap: gapVariants,
    align: alignVariants,
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
    },
    width: {
      full: "w-full",
      prose: "w-full max-w-prose",
      "screen-sm": "w-full max-w-screen-sm",
      "screen-md": "w-full max-w-screen-md",
      "screen-lg": "w-full max-w-screen-lg",
      "screen-xl": "w-full max-w-screen-xl",
    },
    bgColor: bgColorVariants,
    textColor: textColorVariants,
    radius: radiusVariants,
    shadow: shadowVariants,
  },
  defaultVariants: {
    layout: "stack",
    padding: "md",
    gap: "md",
    align: "left",
    justify: "start",
    width: "full",
    bgColor: "background",
    textColor: "foreground",
    radius: "none",
    shadow: "none",
  },
});

type ContainerProps = {
  content: any;
  layout: Layout;
  padding: Spacing;
  gap: Spacing;
  align: Align;
  justify: Justify;
  width: Width;
  bgColor: Color;
  textColor: Color;
  radius: Radius;
  shadow: Shadow;
  tag: Tag;
};

export const Container: ComponentConfig<ContainerProps> = {
  label: "Container",
  fields: {
    content: { type: "slot" },
    layout: {
      type: "radio",
      label: "Layout",
      options: [
        { label: "Stack", value: "stack" },
        { label: "Row", value: "row" },
      ],
    },
    padding: fields.padding(),
    gap: fields.gap(),
    align: fields.align(),
    justify: {
      type: "radio",
      label: "Justify",
      options: [
        { label: "Start", value: "start" },
        { label: "Center", value: "center" },
        { label: "End", value: "end" },
        { label: "Between", value: "between" },
      ],
    },
    width: {
      type: "select",
      label: "Max width",
      options: [
        { label: "Full", value: "full" },
        { label: "Prose", value: "prose" },
        { label: "Small", value: "screen-sm" },
        { label: "Medium", value: "screen-md" },
        { label: "Large", value: "screen-lg" },
        { label: "X-Large", value: "screen-xl" },
      ],
    },
    bgColor: fields.bgColor(),
    textColor: fields.textColor(),
    radius: fields.radius(),
    shadow: fields.shadow(),
    tag: {
      type: "select",
      label: "HTML tag",
      options: tags.map((t) => ({ label: `<${t}>`, value: t })),
    },
  },
  defaultProps: {
    layout: "stack",
    padding: "md",
    gap: "md",
    align: "left",
    justify: "start",
    width: "full",
    bgColor: "background",
    textColor: "foreground",
    radius: "none",
    shadow: "none",
    tag: "div",
  } as ContainerProps,
  render: ({
    content: Content,
    layout,
    padding,
    gap,
    align,
    justify,
    width,
    bgColor,
    textColor,
    radius,
    shadow,
    tag,
  }) => {
    const Tag = tag as React.ElementType;

    return (
      <Tag
        className={cn(
          containerVariants({
            layout,
            padding,
            gap,
            align,
            justify,
            width,
            bgColor,
            textColor,
            radius,
            shadow,
          }),
        )}
      >
        {Content && <Content />}
      </Tag>
    );
  },
};
