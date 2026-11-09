import type { ComponentConfig, RichText } from "@puckeditor/core";
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
};

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
  },
  defaultProps: {
    items: [
      {
        title: "Section title",
        content: DEFAULT_CONTENT,
      },
    ],
  },
  render: ({ items }) => {
    return (
      <Accordion multiple className="w-full p-3">
        {items.map((item, index) => (
          <AccordionItem key={index} value={String(index)}>
            <AccordionTrigger className="py-4 font-display text-2xl uppercase tracking-[0.08em] hover:no-underline">
              {item.title}
            </AccordionTrigger>
            <AccordionContent>
              <div className="prose max-w-none pb-4">
                {typeof item.content === "string" ? (
                  <div dangerouslySetInnerHTML={{ __html: item.content }} />
                ) : (
                  item.content
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  },
};
