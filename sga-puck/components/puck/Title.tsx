import React, { JSX } from "react";

export interface TitleProps {
    text: string;
    size: 'main' | 'section' | 'subsection' | 'tertiary';
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