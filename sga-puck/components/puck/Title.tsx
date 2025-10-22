import React, { JSX } from "react";

export interface TitleProps {
    text: string;
    size: 'main' | 'section' | 'subsection';
}

export const Title: React.FC<TitleProps> = ({
    text,
    size = 'main',
}) => {
    const sizeComponentMap = {
        main: 'h1',
        section: 'h2',
        subsection: 'h3',
    }
    const baseStyles = "font-bold uppercase leading-tight break-words"
    const sizeStylesMap = {
        main: "text-3xl text-black",
        section: "text-2xl text-sga-red",
        subsection: "text-xl text-sga-red-alt",
    }
    
    const headingStyles = `${baseStyles} ${sizeStylesMap[size]}`;
    const HeadingComponent = sizeComponentMap[size] as keyof JSX.IntrinsicElements;

    return (
        <HeadingComponent className={headingStyles}>
            {text}
        </HeadingComponent>
    )
}