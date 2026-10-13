"use client";
import type { ComponentConfig, RichText } from "@puckeditor/core";
import { RichTextMenu } from "@puckeditor/core";
import { cn } from "@/lib/utils";
import { defineProps, field, responsive } from "@/lib/puck/define-props";
import { resolveResponsive } from "@/lib/puck/responsive-tailwind";
import {
  textColor,
  textAlign,
  lineSpacing,
  textColumns,
  columnGap,
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
};

const props = defineProps({
  content: field.raw(
    { type: "richtext",
      contentEditable: true,
      tiptap: {
        selector: ({ editor }: { editor?: any }) => ({
          isLink: editor?.isActive("link"),
        }),
      },
      renderMenu: ({ children, editor, editorState }: { children?: any; editor?: any; editorState?: any }) => (
        <RichTextMenu>
          {children}
          <RichTextMenu.Group>
            <button
              onClick={() => {
                if (editorState?.isLink) {
                  editor?.chain().focus().unsetLink().run();
                } else {
                  const url = window.prompt("Enter URL");
                  if (url) editor?.chain().focus().setLink({ href: url }).run();
                }
              }}
            >
              {editorState?.isLink ? "Unlink" : "Link"}
            </button>
          </RichTextMenu.Group>
        </RichTextMenu>
      ),
    },
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  ),
  textColor: field.select(textColor, { label: "Text color", default: "foreground" }),
  align: field.radio(textAlign, { label: "Text align", default: "left" }),
  lineSpacing: field.select(lineSpacing, { label: "Line spacing", default: "default" }),
  columns: responsive.select(textColumns, { label: "Columns", default: "1" }),
  columnGap: responsive.select(columnGap, { label: "Column gap", default: "md" }),
});

export const RichTextComponent: ComponentConfig<RichTextProps> = {
  label: "Text",
  ...props,
  render: ({ content, textColor: tc, align, lineSpacing: ls, columns, columnGap: cg }) => {
    return (
      <div className={cn(
        "prose max-w-none",
        "[&_a]:text-sga-red [&_a]:underline",
        textColor.classes[tc],
        textAlign.classes[align],
        lineSpacing.classes[ls],
        resolveResponsive(columns, textColumns.classes),
        resolveResponsive(cg, columnGap.classes),
      )}>
        {content}
      </div>
    );
  },
};
