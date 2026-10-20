import type { ComponentConfig, Slot } from "@puckeditor/core";
import { defineProps, field } from "@/lib/puck/define-props";
import {
  marqueeDirection,
  marqueeGap,
  marqueeRowPadding,
  marqueeSpeed,
  type MarqueeDirection,
  type MarqueeGap,
  type MarqueeRowPadding,
  type MarqueeSpeed,
} from "@/lib/puck/tokens";
import {
  getMarqueeItemClassName,
  marqueeClassName,
} from "@/lib/puck/layout";
import { cn } from "@/lib/utils";

//Did my best to set up the most basic framework of the file, details still to be worked out for most stuff here

//Presumably other props go here; this is my best guess so far
type MarqueeProps = {
  content: Slot;
  speed: MarqueeSpeed;
  direction: MarqueeDirection;
  gap: MarqueeGap;
  rowPadding: MarqueeRowPadding;
};

const props = defineProps({
  content: field.slot(),
  speed: field.select(marqueeSpeed, { label: "Scrolling speed" }),
  direction: field.radio(marqueeDirection, { label: "Direction" }),
  gap: field.select(marqueeGap, { label: "Item gap" }),
  rowPadding: field.select(marqueeRowPadding, { label: "Row padding" }),
});

export const Marquee: ComponentConfig<MarqueeProps> = {
  label: "Marquee",
  inline: true,
  ...props,
  render: ({ content: Content, speed, direction, gap, rowPadding, puck }) => {
    const itemClassName = getMarqueeItemClassName({ speed, direction, gap, rowPadding });

    // marquee content is static in editor, but animated in preview and production
    if (puck.isEditing) {
      return (
        <div ref={puck.dragRef} className={cn(marqueeClassName, "min-h-20")}>
          {Content && (
            <Content
              className={cn(itemClassName, "min-h-20")}
              minEmptyHeight="80px"
            />
          )}
        </div>
      );
    }
    const animatedClassName = getMarqueeItemClassName({
      speed,
      direction,
      gap,
      rowPadding,
      animated: true,
    });

    return (
      <div ref={puck.dragRef} className={marqueeClassName}>
        {Content && <Content className={animatedClassName} />}
        {Content && (
          <div aria-hidden="true" className="contents motion-reduce:hidden">
            <Content className={animatedClassName} />
          </div>
        )}
      </div>
    );
  },
};
