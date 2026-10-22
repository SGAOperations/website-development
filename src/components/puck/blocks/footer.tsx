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
    Layout,
    CrossAxisAlign,
    Justify,
    layout,
    justify,
    crossAxisAlign,
    gap as gapToken,
    layout as layoutToken,
} from '@/lib/puck/tokens';
import { ResponsiveValue } from '@/lib/puck/responsive';
import { resolveResponsive } from '@/lib/puck/responsive-tailwind';


type FooterProps = {
    title: string;
    textLines: string;
    buttonSpace: Slot;
    emails: string;
    align: TextAlign;
    titleColor : Color;
    textColor : Color;
    backgroundColor : Color;
    padding : ResponsiveValue<Spacing> 
    layout: Layout;
    gap: ResponsiveValue<Spacing>;
    slotAlign: CrossAxisAlign;
    justify: Justify;
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
    titleColor : field.select(textColor, {label: "Title Text Color", default: "sga-red"}),
    textColor: field.select(textColor, {label: "Body Text Color", default: "background"}),
    backgroundColor: field.select(bgColor, {label: "Background Color", default: "foreground"}),
    padding: responsive.select(padding, { label: "Padding", default: "md"}),
    layout : field.radio(layout, {label: "Layout"}),
    justify : field.radio(justify, {label: "Justify"}),
    slotAlign : field.radio(crossAxisAlign, {label: "Align items"}),
    gap: responsive.select(gapToken, { label: "Icon Gap", default: "md" }),
});

export const Footer: ComponentConfig<FooterProps> = {
    label: "Footer",
    ...props,
    render: ({title, textLines, buttonSpace: Content, emails, align, titleColor : tic, textColor : txc, backgroundColor, padding : p, layout : l, gap, slotAlign : s, justify : j}) => {
       const slotClasses = cn(
        "slot section",
        layoutToken.classes[l],
        crossAxisAlign.classes[s],
        justify.classes[j],
        resolveResponsive(gap, gapToken.classes),
       );
       
        return (
            <div style={{display: 'flex', flexDirection: 'column', margin: 0, gap: 0}}>
                <div className={cn(
                    "Title section",
                    textAlign.classes[align],
                    textColor.classes[tic],
                    bgColor.classes[backgroundColor],

                    resolveResponsive(p, padding.classes),
                )}>
                    {title}
                </div>
                <div className={cn(
                    "Text lines section",
                    textAlign.classes[align],
                    textColor.classes[txc],
                    bgColor.classes[backgroundColor],

                    resolveResponsive(p, padding.classes),
                )}>
                    {textLines}
                </div>
                <div className = {cn(
                    "Slot section outer class"
                    //more slot customizing would go here
                )}>
                    {Content && (
                      <Content className={slotClasses} minEmptyHeight="200px" />
                    )}
                </div>
            </div>
        );
    }
}


//notes for when i resume:
//final major challenge: add in that final thing with the emails spaced apart
//Confirm that the slot settings work, see about adding more in