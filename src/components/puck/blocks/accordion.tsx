import type { ComponentConfig, RichText } from "@puckeditor/core";
import { cn } from "@/lib/utils";
import { resolveResponsive } from "@/lib/puck/responsive-tailwind";
import type { ResponsiveValue } from "@/lib/puck/responsive";
import {
  accordionTitleSize,
  fontFamily,
  padding,
  paddingBottom,
  paddingY,
  type AccordionTitleSize,
  type Spacing,
} from "@/lib/puck/tokens";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const DEFAULT_CONTENT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const containerPadding: ResponsiveValue<Spacing> = { phone: "sm", md: "md" };
const rowPadding: ResponsiveValue<Spacing> = {
  phone: "sm",
  md: "md",
  lg: "lg",
};
const titleSize: ResponsiveValue<AccordionTitleSize> = {
  phone: "md",
  md: "lg",
  lg: "xl",
};

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
      <Accordion
        multiple
        className={cn(
          "w-full",
          resolveResponsive(containerPadding, padding.classes),
        )}
      >
        {items.map((item, index) => (
          <AccordionItem key={index} value={String(index)}>
            <AccordionTrigger
              className={cn(
                "font-normal hover:no-underline",
                fontFamily.classes.bebasNeue,
                resolveResponsive(titleSize, accordionTitleSize.classes),
                resolveResponsive(rowPadding, paddingY.classes),
              )}
            >
              {item.title}
            </AccordionTrigger>
            <AccordionContent>
              <div
                className={cn(
                  "prose max-w-none",
                  resolveResponsive(rowPadding, paddingBottom.classes),
                )}
              >
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
