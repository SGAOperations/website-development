import type { ComponentConfig } from "@puckeditor/core";
import type { ElementType } from "react";
import {
  getContainerSlotClassName,
  getContainerSurfaceClassName,
  type ContainerStyle,
} from "@/lib/puck/layout";
import { defineProps, responsive, field } from "@/lib/puck/define-props";
import { defineToken, type TokenValue, padding, gap, bgColor, textColor, radius, shadow, crossAxisAlign, layout, justify, width } from "@/lib/puck/tokens";

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

type ContainerProps = ContainerStyle & {
  content: any;
  tag: Tag;
};

const props = defineProps({
  content: field.raw({ type: "slot" } as const),
  layout: field.radio(layout, { label: "Layout" }),
  padding: responsive.token(padding, { label: "Padding", default: "md" }),
  gap: responsive.token(gap, { label: "Gap", default: "md" }),
  align: field.radio(crossAxisAlign, { label: "Align items" }),
  justify: field.radio(justify, { label: "Justify" }),
  width: field.select(width, { label: "Max width" }),
  bgColor: field.select(bgColor, { label: "Background" }),
  textColor: field.select(textColor, { label: "Text color", default: "foreground" }),
  radius: field.select(radius, { label: "Corners" }),
  shadow: field.select(shadow, { label: "Shadow" }),
  tag: field.select(tag, { label: "HTML tag" }),
});

export const Container: ComponentConfig<ContainerProps> = {
  label: "Container",
  ...props,
  defaultProps: props.defaultProps,
  render: ({ content: Content, tag: t, ...style }) => {
    const Tag = t as ElementType;

    return (
      <Tag className={getContainerSurfaceClassName(style)}>
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
