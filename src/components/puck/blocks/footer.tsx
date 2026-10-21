import { ComponentConfig, Slot } from '@puckeditor/core';
import React from 'react';
import { defineProps, responsive, field } from "@/lib/puck/define-props";
import { cn } from '@/lib/utils';
import { 
    bgColor,
    textColor,
    type Color,
    textAlign,
    type TextAlign,
    padding,
    Spacing,
} from '@/lib/puck/tokens';
import { ResponsiveValue } from '@/lib/puck/responsive';
import { resolveResponsive } from '@/lib/puck/responsive-tailwind';


type FooterProps = {
    title: string;
    textLines: string;
    buttonSpace: Slot;
    emails: string;
    align: TextAlign;
    textColor : Color;
    backgroundColor : Color;
    padding : ResponsiveValue<Spacing> 
}

const props = defineProps({
    title: field.raw(
        { type: "text", contentEditable: true },
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    ),
    textLines: field.raw(
        { type: "text", contentEditable: true },
        "Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit.",
    ),
    buttonSpace: field.slot(),
    emails: field.raw(
        { type: "text", contentEditable: true },
        "Contact: myname@mydomain.com\nInquiries: myfunding@mydomain.com\nWebmaster: webmaster@mydomain.com"
    ),
    align: field.radio(textAlign, { label: "Text align", default: "center" }),
    textColor: field.select(textColor, {label: "Text Color", default: "background"}),
    backgroundColor: field.select(bgColor, {label: "Background Color", default: "foreground"}),
    padding: responsive.select(padding, { label: "Padding", default: "md"}),
});

export const Footer: ComponentConfig<FooterProps> = {
    label: "Footer",
    ...props,
    render: ({title, textLines, buttonSpace: Content, emails, align, textColor : tc, backgroundColor, padding : p}) => {
        return (
            <div style={{display: 'flex', flexDirection: 'column', margin: 0, gap: 0}}>
                <div className={cn(
                    "first footer attempt",
                    textAlign.classes[align],
                    textColor.classes[tc],
                    bgColor.classes[backgroundColor],

                    resolveResponsive(p, padding.classes),
                )}>
                    {title}
                </div>
                <div className={cn(
                    "first footer attempt",
                    textAlign.classes[align],
                    textColor.classes[tc],
                    bgColor.classes[backgroundColor],

                    resolveResponsive(p, padding.classes),
                )}>
                    {textLines}
                </div>
            </div>
        );
    }
}


//notes for when i resume:
//add a new textColor for the title color
//add in the slot
//final major challenge: add in that final thing with the emails spaced apart