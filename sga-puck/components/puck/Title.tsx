import { Field, ComponentConfig } from "@measured/puck";
import React, { JSX } from "react";
import { booleanSettingsField } from "../../lib/settings-fields";


type TitleSize = 'main' | 'section' | 'subsection' | 'tertiary';

const titleSizeField: Field<TitleSize> = {
    type: "select",
    options: [
        { label: "Main (h1)", value: "main" },
        { label: "Section (h2)", value: "section" },
        { label: "Subsection (h3)", value: "subsection" },
        { label: "Tertiary (h4)", value: "tertiary" },
    ],
} as const;

export interface TitleProps {
    text: string;
    size: TitleSize;
    center?: boolean;
    uppercase?: boolean;
}


export const Title: React.FC<TitleProps> = ({
    text,
    size = 'main',
    center = false,
    uppercase = true,
}) => {
    const sizeComponentMap = {
        main: 'h1',
        section: 'h2',
        subsection: 'h3',
        tertiary: 'h4',
    }
    const baseStyles = "font-bold leading-tight break-words"
    const sizeStylesMap = {
        main: "text-3xl text-black",
        section: "text-2xl text-sga-red",
        subsection: "text-xl text-black",
        tertiary: "text-lg text-black",
    }
    const alignmentStyles = center ? "text-center" : "";
    
    const headingStyles = `${baseStyles} ${sizeStylesMap[size]} ${alignmentStyles} ${uppercase ? 'uppercase' : ''}`;
    const HeadingComponent = sizeComponentMap[size] as keyof JSX.IntrinsicElements;

    return (
        <HeadingComponent className={headingStyles}>
            {text}
        </HeadingComponent>
    )
}


export const TitleConfig: ComponentConfig<TitleProps> = {
    fields: {
        text: { type: "text" },
        size: titleSizeField,
        center: booleanSettingsField,
        uppercase: booleanSettingsField,
    },
    defaultProps: {
        text: "Title Text",
        size: "main",
        center: false,
        uppercase: true,
    },
    render: (props) => <Title {...props} />,
}