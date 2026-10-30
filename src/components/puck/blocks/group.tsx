import type { ComponentConfig, Slot } from "@puckeditor/core";
import type { ElementType } from "react";
import {
  getGroupSlotClassName,
  getGroupSurfaceClassName,
  type GroupStyle,
} from "@/lib/puck/layout";
import { defineProps, responsive, field } from "@/lib/puck/define-props";
import { defineToken, type TokenValue, padding, gap, bgColor, textColor, radius, shadow, crossAxisAlign, layout, justify, width } from "@/lib/puck/tokens";
import { getContrastWarning, MAIN_CONTENT_ID } from "@/lib/puck/a11y";
import { EditorWarning } from "@/components/puck/editor-warning";
import { cn } from "@/lib/utils";

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

type GroupProps = GroupStyle & {
  content: Slot;
  tag: Tag;
};

const props = defineProps({
  content: field.slot(),
  layout: field.radio(layout, { label: "Layout" }),
  padding: responsive.select(padding, { label: "Padding", default: "md" }),
  gap: responsive.select(gap, { label: "Gap", default: "md" }),
  align: field.radio(crossAxisAlign, { label: "Align items" }),
  justify: field.radio(justify, { label: "Justify" }),
  width: field.select(width, { label: "Max width" }),
  bgColor: field.select(bgColor, { label: "Background" }),
  textColor: field.select(textColor, { label: "Text color", default: "foreground" }),
  radius: field.select(radius, { label: "Corners" }),
  shadow: field.select(shadow, { label: "Shadow" }),
  tag: field.select(tag, { label: "HTML tag" }),
});

export const Group: ComponentConfig<GroupProps> = {
  label: "Group",
  inline: true,
  ...props,
  render: ({ content: Content, tag: t, puck, ...style }) => {
    const Tag = t as ElementType;
    const contrastWarning = puck.isEditing ? getContrastWarning(style.bgColor, style.textColor) : null;

    return (
      <Tag
        ref={puck.dragRef}
        // A <main> Group becomes the skip link target (see PuckRender).
        id={t === "main" ? MAIN_CONTENT_ID : undefined}
        className={cn(getGroupSurfaceClassName(style), contrastWarning && "relative")}
      >
        {contrastWarning && <EditorWarning label="Low contrast">{contrastWarning}</EditorWarning>}
        {Content && (
          <Content
            className={getGroupSlotClassName(style)}
            minEmptyHeight="200px"
          />
        )}
      </Tag>
    );
  },
};
