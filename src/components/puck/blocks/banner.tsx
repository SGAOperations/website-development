import {Config, ComponentConfig } from '@puckeditor/core';
import React from 'react';
import { defineProps, responsive, field } from "@/lib/puck/define-props";
import { cn } from '@/lib/utils';
import { ResponsiveValue } from '@/lib/puck/responsive'
import { resolveResponsive } from '@/lib/puck/responsive-tailwind';
import {
type Color,
type Spacing,
type TextAlign,
type TextSize,
bgColor,
bannerTextSize,
textColor,
textAlign,
padding,
} from '@/lib/puck/tokens';
import { mediaField } from "@/components/puck/fields/media-field";

type BannerProps={
    padding: ResponsiveValue<Spacing>;
    backgroundColor : Color;
    image: { mediaId: number; url: string } | null;
    text : string;
    textColor : Color;
    align : TextAlign;
    textSize : ResponsiveValue<TextSize>
}

const props = defineProps({
    text: field.raw({type: "text", label: "Text", contentEditable: true}, "Your text here"),
    image: field.raw(mediaField("Image"), null),
    backgroundColor: field.select(bgColor, {label: "Background Color", default: "background"}),
    textSize: responsive.select(bannerTextSize, {label: "Text size", default: "md"}),
    textColor: field.select(textColor, {label: "Text Color", default: "foreground"}),
    align: field.radio(textAlign, {label:"Text align", default: "center"}),
    padding: responsive.select(padding, { label: "Padding", default: "md"}),
})

export const Banner: ComponentConfig<BannerProps> = {
    label: "Banner",
    ...props,

    render: ({text, image, backgroundColor: bc, textColor : tc, textSize : ts, align, padding : p}) => {
        return (
            <div style={{margin: 0, gap: 0, backgroundImage: image?.url}}>
                <div className={cn(
                    "text class",
                    textAlign.classes[align],
                    textColor.classes[tc],
                    resolveResponsive(ts, bannerTextSize.classes),
                    bgColor.classes[bc],
                    resolveResponsive(p, padding.classes),
                )}>
                    {text}
                </div>
            </div>
        )
    }
}