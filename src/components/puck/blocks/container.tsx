import type { ComponentConfig, Slot } from "@puckeditor/core";
import type { ElementType } from "react";
import type { ResponsiveValue } from "@/lib/puck/responsive";
import {
  getContainerSlotClassName,
  getContainerSurface,
  type ContainerStyle,
} from "@/lib/puck/layout";
import { defineProps, responsive, field } from "@/lib/puck/define-props";
import { widthPresetOptions, type SizeValue } from "@/lib/puck/style-values";
import {
  defineToken,
  type TokenValue,
  padding,
  gap,
  bgColor,
  textColor,
  radius,
  shadow,
  crossAxisAlign,
  layout,
  justify,
  overflowX,
  overflowY,
  type WidthPreset,
} from "@/lib/puck/tokens";

const tag = defineToken({
  div:     "<div>",
  section: "<section>",
  article: "<article>",
  header:  "<header>",
  footer:  "<footer>",
  aside:   "<aside>",
  main:    "<main>",
  nav:     "<nav>",
});
type Tag = TokenValue<typeof tag>;

type ContainerProps = Omit<ContainerStyle, "width"> & {
  content: Slot;
  tag: Tag;
  width: ResponsiveValue<SizeValue<WidthPreset>>;
};

const props = defineProps({
  content: field.slot(),
  layout: field.radio(layout, { label: "Layout" }),
  padding: responsive.select(padding, { label: "Padding", default: "md" }),
  gap: responsive.select(gap, { label: "Gap", default: "md" }),
  align: field.radio(crossAxisAlign, { label: "Align items" }),
  justify: field.radio(justify, { label: "Justify" }),
  boxWidth: responsive.size({
    label: "Width",
    presets: widthPresetOptions,
    default: { mode: "full" },
  }),
  width: responsive.size({
    label: "Max width",
    presets: widthPresetOptions,
    default: { mode: "none" },
  }),
  minWidth: responsive.size({
    label: "Min width",
    presets: widthPresetOptions,
    default: { mode: "none" },
  }),
  height: responsive.size({
    label: "Height",
    default: { mode: "none" },
  }),
  minHeight: responsive.size({
    label: "Min height",
    default: { mode: "none" },
  }),
  maxHeight: responsive.size({
    label: "Max height",
    default: { mode: "none" },
  }),
  aspectRatio: responsive.ratio({
    label: "Aspect ratio",
    default: { mode: "none" },
  }),
  overflowX: field.select(overflowX, { label: "Overflow X", default: "visible" }),
  overflowY: field.select(overflowY, { label: "Overflow Y", default: "visible" }),
  bgColor: field.select(bgColor, { label: "Background" }),
  textColor: field.select(textColor, { label: "Text color", default: "foreground" }),
  radius: field.select(radius, { label: "Corners" }),
  shadow: field.select(shadow, { label: "Shadow" }),
  tag: field.select(tag, { label: "HTML tag" }),
});

export const Container: ComponentConfig<ContainerProps> = {
  label: "Container",
  ...props,
  render: ({ content: Content, tag: t, ...style }) => {
    const Tag = t as ElementType;
    const surface = getContainerSurface(style);

    return (
      <Tag className={surface.className} style={surface.style}>
        {Content && (
          <Content
            className={getContainerSlotClassName(style)}
            minEmptyHeight="200px"
          />
        )}
      </Tag>
    );
  },
};
