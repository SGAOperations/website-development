import type { ComponentConfig, Slot } from "@puckeditor/core";
import type { ResponsiveValue } from "@/lib/puck/responsive";
import { Speed } from "@/lib/puck/tokens";
import { defineProps, responsive, field } from "@/lib/puck/define-props"
import { speed } from "@/lib/puck/tokens"; 
import { resolveResponsive } from "@/lib/puck/responsive-tailwind";
import { cn } from "@/lib/utils";


//Did my best to set up the most basic framework of the file, details still to be worked out for most stuff here

//Presumably other props go here; this is my best guess so far
type MarqueeProps = {
    content: Slot;
    speed: ResponsiveValue<Speed>;
}

const props = defineProps({
    content: field.slot(),
    speed: responsive.select(speed, { label: "Scrolling speed", default: "medium"})
});

export const Marquee: ComponentConfig<MarqueeProps> = {
    label: "Marquee",
    inline: true,
    ...props,
    render: ({
        content: Content,
        speed : s
    }) => {
        
        //Presumably something here, I'm guessing this is where some scrolling functionality would be
        //Could be wrong tho
    },
};