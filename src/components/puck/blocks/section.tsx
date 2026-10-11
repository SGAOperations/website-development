import type { ComponentConfig, Slot } from "@puckeditor/core";
import type { ResponsiveValue } from "@/lib/puck/responsive";
import { resolveResponsive } from "@/lib/puck/responsive-tailwind";
import { cn } from "@/lib/utils";
import { defineProps, responsive, field } from "@/lib/puck/define-props";
import {
  paddingX,
  paddingY,
  gap as gapToken,
  bgColor,
  textColor,
  width,
  type Color,
  type PaddingX,
  type PaddingY,
  type Gap,
  type Width,
} from "@/lib/puck/tokens";

type SectionProps = {
  content: Slot;
  anchorId: string;
  paddingX: ResponsiveValue<PaddingX>;
  paddingY: ResponsiveValue<PaddingY>;
  gap: ResponsiveValue<Gap>;
  width: Width;
  bgColor: Color;
  textColor: Color;
};

const props = defineProps({
  content: field.slot(),
  anchorId: field.raw({ type: "text", label: "Anchor ID" }, ""),
  paddingX: responsive.select(paddingX, { label: "Horizontal padding", default: "12" }),
  paddingY: responsive.select(paddingY, { label: "Vertical padding", default: "16" }),
  gap: responsive.select(gapToken, { label: "Gap", default: "12" }),
  width: field.select(width, { label: "Max width", default: "screen-lg" }),
  bgColor: field.select(bgColor, { label: "Background" }),
  textColor: field.select(textColor, { label: "Text color", default: "foreground" }),
});

export const Section: ComponentConfig<SectionProps> = {
  label: "Section",
  ...props,
  render: ({
    content: Content,
    anchorId,
    paddingX: px,
    paddingY: py,
    gap: g,
    width: w,
    bgColor: bg,
    textColor: text,
  }) => {
    const outerClasses = cn(
      "w-full",
      bgColor.classes[bg],
      textColor.classes[text],
      resolveResponsive(py, paddingY.classes),
      resolveResponsive(px, paddingX.classes),
    );

    const innerClasses = cn(
      "mx-auto",
      width.classes[w],
    );

    const slotClasses = cn(
      "flex flex-col w-full",
      resolveResponsive(g, gapToken.classes),
    );

    return (
      <section id={anchorId || undefined} className={outerClasses}>
        <div className={innerClasses}>
          {Content && (
            <Content className={slotClasses} minEmptyHeight="200px" />
          )}
        </div>
      </section>
    );
  },
};
