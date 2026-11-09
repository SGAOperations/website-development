import type { ComponentConfig, RichText } from "@puckeditor/core";
import { cn } from "@/lib/utils";
import { defineProps, responsive } from "@/lib/puck/define-props";
import { resolveResponsive } from "@/lib/puck/responsive-tailwind";
import { padding, type Spacing } from "@/lib/puck/tokens";
import type { ResponsiveValue } from "@/lib/puck/responsive";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const DEFAULT_CONTENT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

type AccordionItemProps = {
  title: string;
  content: RichText;
};

type AccordionProps = {
  items: AccordionItemProps[];
  padding: ResponsiveValue<Spacing>;
};

const props = defineProps({
  padding: responsive.select(padding, { label: "Padding", default: "md" }),
});

export const AccordionBlock: ComponentConfig<AccordionProps> = {
  label: "Accordion",
  fields: {
    items: {
      type: "array",
      label: "Items",
      getItemSummary: (item) => item.title || "Untitled item",
      arrayFields: {
        title: { type: "text", label: "Title" },
        content: { type: "richtext", label: "Content", contentEditable: true },
      },
      defaultItemProps: {
        title: "Section title",
        content: DEFAULT_CONTENT,
      },
    },
    ...props.fields,
  },
  defaultProps: {
    items: [
      {
        title: "Section title",
        content: DEFAULT_CONTENT,
      },
    ],
    ...props.defaultProps,
  },
  render: ({ items, padding: p }) => {
    return (
      <Accordion
        multiple
        className={cn("w-full", resolveResponsive(p, padding.classes))}
      >
        {items.map((item, index) => (
          <AccordionItem key={index} value={String(index)}>
            <AccordionTrigger className="py-4 font-display text-2xl uppercase tracking-[0.08em] hover:no-underline">
              {item.title}
            </AccordionTrigger>
            <AccordionContent>
              <div className="prose max-w-none pb-4">{item.content}</div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  },
};
