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
BannerImgHeight,
bannerImgHeight,
} from '@/lib/puck/tokens';
import { mediaField } from "@/components/puck/fields/media-field";

type BannerProps={
    padding: ResponsiveValue<Spacing>;
    backgroundColor : Color;
    image: { mediaId: number; url: string } | null;
    text : string;
    textColor : Color;
    align : TextAlign;
    textSize : TextSize;
    height: BannerImgHeight;
}

const props = defineProps({
    text: field.raw({type: "text", label: "Text", contentEditable: true}, "Your text here"),
    image: field.raw(mediaField("Image"), null),
    backgroundColor: field.select(bgColor, {label: "Background Color", default: "background"}),
    textSize: field.select(bannerTextSize, {label: "Text size", default: "md"}),
    textColor: field.select(textColor, {label: "Text Color", default: "foreground"}),
    align: field.radio(textAlign, {label:"Text align", default: "center"}),
    padding: responsive.select(padding, { label: "Padding", default: "md"}),
    height: field.select(bannerImgHeight, {label: "Height", default: "10"}),
})

export const Banner: ComponentConfig<BannerProps> = {
    label: "Banner",
    ...props,

    render: ({text, image, backgroundColor: bc, textColor : tc, textSize : ts, align, padding : p, height : h}) => {
        return (
            <div className = {cn(

                "relative flex w-full items-center justify-center overflow-hidden",
                bgColor.classes[bc],
            )}
            style={{height: bannerImgHeight.classes[h], fontSize: bannerTextSize.classes[ts]}}
            >
                {image && (
                    <img
                    src={image.url}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    />
                )}

                <div className={cn(
                    "relative z-10 w-full",
                    textAlign.classes[align],
                    textColor.classes[tc],
                )}
                >
                    {text}
                </div>
            </div>
        )
    }
}

//to-do for the future:
//edit the text sizing to be actually large and attention-grabbing even with no padding
//pick a good default height