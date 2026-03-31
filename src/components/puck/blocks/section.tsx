import type { ComponentConfig, Slot } from "@puckeditor/core";
import type { ResponsiveValue } from "@/lib/puck/responsive";
import { resolveResponsive } from "@/lib/puck/responsive-tailwind";
import { cn } from "@/lib/utils";
import { getSectionContent, getSectionOuter } from "@/lib/puck/layout";
import { defineProps, responsive, field } from "@/lib/puck/define-props";
import { widthPresetOptions, type SizeValue } from "@/lib/puck/style-values";
import {
  paddingX,
  paddingY,
  gap as gapToken,
  bgColor,
  textColor,
  verticalAlign,
  type Color,
  type Spacing,
  type VerticalAlign,
  type WidthPreset,
} from "@/lib/puck/tokens";

type SectionProps = {
  content: Slot;
  anchorId: string;
  paddingX: ResponsiveValue<Spacing>;
  paddingY: ResponsiveValue<Spacing>;
  gap: ResponsiveValue<Spacing>;
  width: ResponsiveValue<SizeValue<WidthPreset>>;
  minHeight: ResponsiveValue<SizeValue>;
  verticalContentAlign: VerticalAlign;
  bgColor: Color;
  textColor: Color;
};

const props = defineProps({
  content: field.slot(),
  anchorId: field.raw({ type: "text", label: "Anchor ID" }, ""),
  paddingX: responsive.select(paddingX, { label: "Horizontal padding", default: "md" }),
  paddingY: responsive.select(paddingY, { label: "Vertical padding", default: "lg" }),
  gap: responsive.select(gapToken, { label: "Gap", default: "md" }),
  width: responsive.size({
    label: "Content max width",
    presets: widthPresetOptions,
    default: { mode: "preset", preset: "screen-lg" },
  }),
  minHeight: responsive.size({
    label: "Min height",
    default: { mode: "none" },
  }),
  verticalContentAlign: field.radio(verticalAlign, { label: "Vertical align", default: "start" }),
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
    minHeight,
    verticalContentAlign,
    bgColor: bg,
    textColor: text,
  }) => {
    const outer = getSectionOuter({
      paddingX: px,
      paddingY: py,
      bgColor: bg,
      textColor: text,
      minHeight,
      verticalContentAlign,
    });
    const inner = getSectionContent({ width: w });

    const slotClasses = cn(
      "flex flex-col w-full",
      resolveResponsive(g, gapToken.classes),
    );

    return (
      <section id={anchorId || undefined} className={outer.className} style={outer.style}>
        <div className={inner.className} style={inner.style}>
          {Content && (
            <Content className={slotClasses} minEmptyHeight="200px" />
          )}
        </div>
      </section>
    );
  },
};
