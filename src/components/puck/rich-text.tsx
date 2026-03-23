import type { ComponentConfig, RichText } from "@puckeditor/core";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { fields, textColorVariants, type Color, type Align } from "@/lib/puck/tokens";

const richTextVariants = cva("prose max-w-none", {
  variants: {
    textColor: textColorVariants,
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: {
    textColor: "foreground",
    align: "left",
  },
});

type RichTextProps = {
  content: RichText;
  textColor: Color;
  align: Align;
};

export const RichTextComponent: ComponentConfig<RichTextProps> = {
  label: "Text",
  fields: {
    content: {
      type: "richtext",
      contentEditable: true,
    },
    textColor: fields.textColor(),
    align: fields.align(),
  },
  defaultProps: {
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    textColor: "foreground",
    align: "left",
  } as RichTextProps,
  render: ({ content, textColor, align }) => {
    return (
      <div className={cn(richTextVariants({ textColor, align }))}>
        {content}
      </div>
    );
  },
};
