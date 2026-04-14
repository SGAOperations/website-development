import { ComponentConfig } from "@puckeditor/core";
import React from "react";
import { cn } from "@/lib/utils";
import { IconName, DynamicIcon, dynamicIconImports } from 'lucide-react/dynamic';
import { defineProps, responsive, field } from "@/lib/puck/define-props";
import type { ResponsiveValue } from "@/lib/puck/responsive";
import { resolveResponsive} from "@/lib/puck/responsive-tailwind";
import { padding as paddingToken, hexCodeColor, type Spacing, type Color } from "@/lib/puck/tokens";


type IconProps = {
    size: number;
    padding: ResponsiveValue<Spacing>;
    color: Color;
    icon?: IconName;
};

const props = defineProps({
  size: field.raw( { type: "number" }, 55 ),
  padding: responsive.select(paddingToken, { label: "Padding", default: "md" }),
  color: field.select(hexCodeColor, { label: "Color", default: "sga-red" }),
  icon: field.raw( { type: "text" }, undefined), 
});

export const Icon: ComponentConfig<IconProps> = {
    label: "Icon",
  inline: true,
  ...props,
  render: ({ size, padding, color, icon, puck }) => {
        const resolvedIcon = (icon && (icon in dynamicIconImports)) ? icon : "landmark";

        return (<div ref={puck.dragRef} className={`flex align-items-center justify-items-center`}>
            <DynamicIcon 
            className={cn(
                    resolveResponsive(padding, paddingToken.classes),
                  )} name={resolvedIcon} size={size} color={hexCodeColor.classes[color]}/>
        </div>);
    }
};