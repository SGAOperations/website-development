import { Field, ComponentConfig } from "@measured/puck";
import React, { JSX } from "react";
import { booleanSettingsField } from "../../lib/settings-fields";
import clsx from "clsx";


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


const TitleSizeTagStyles = {
    main:       { tag: 'h1', styles: "text-3xl text-black" },
    section:    { tag: 'h2', styles: "text-2xl text-sga-red" },
    subsection: { tag: 'h3', styles: "text-xl text-black" },
    tertiary:   { tag: 'h4', styles: "text-lg text-black" },
}


export const Title: React.FC<TitleProps> = ({
    text,
    size = 'main',
    center = false,
    uppercase = true,
}) => {
    const { tag, styles } = TitleSizeTagStyles[size];

    const headingStyles = clsx(
        "font-bold leading-tight break-words",
        styles,
        center && "text-center",
        uppercase && "uppercase"
    )
    const HeadingTag = tag as keyof JSX.IntrinsicElements;

    return (
        <HeadingTag className={headingStyles}>
            {text}
        </HeadingTag>
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