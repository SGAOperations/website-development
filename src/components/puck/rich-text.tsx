import type { ComponentConfig, RichText } from "@puckeditor/core";
import { cn } from "@/lib/utils";
import { defineProps, field } from "@/lib/puck/define-props";
import {
  textColor,
  textAlign,
  type Color,
  type TextAlign,
} from "@/lib/puck/tokens";

type RichTextProps = {
  content: RichText;
  textColor: Color;
  align: TextAlign;
};

const props = defineProps({
  content: field.raw(
    { type: "richtext", contentEditable: true } as const,
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." as unknown as RichText,
  ),
  textColor: field.select(textColor, { label: "Text color", default: "foreground" }),
  align: field.radio(textAlign, { label: "Text align", default: "left" }),
});

export const RichTextComponent: ComponentConfig<RichTextProps> = {
  label: "Text",
  ...props,
  render: ({ content, textColor: tc, align }) => {
    return (
      <div className={cn("prose max-w-none", textColor.classes[tc], textAlign.classes[align])}>
        {content}
      </div>
    );
  },
};
