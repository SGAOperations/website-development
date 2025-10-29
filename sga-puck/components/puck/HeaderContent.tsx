import { ComponentConfig } from '@measured/puck';
import React from 'react';

export type HeaderContentProps = {
    backgroundColor?: string;
    padding?: string;
    titleText?: string;
    titleSize?: string;
    titleColor?: string;
    logoSrc?: string;
    logoAltText?: string;
    logoWidth?: string;
    logoHeight?: string;
    dividerColor?: string;
    dividerWidth?: string;
    dividerHeight?: string;
    dividerMargin?: string;
};

export const HeaderContent: React.FC<HeaderContentProps> = ({
    backgroundColor,
    padding,
    titleText,
    titleSize,
    titleColor,
    logoSrc,
    logoAltText,
    logoWidth,
    logoHeight,
    dividerColor,
    dividerWidth,
    dividerHeight,
    dividerMargin
}) => (
    <div className="relative w-screen">
        <header
            className={`flex flex-col justify-center items-center h-auto w-screen relative top-0 ${padding}`}
            style={{ backgroundColor }}
        >
            <div className="flex items-center">
                <h1 className={`${titleSize} font-bold ${titleColor} text-center`}>
                    {titleText}
                </h1>
                <div className={`inline-block ${dividerHeight} min-h-[1em] ${dividerWidth} self-stretch ${dividerColor} ${dividerMargin}`}></div>
                {logoSrc ? (
                    <img src={logoSrc} alt={logoAltText} className={`${logoWidth} ${logoHeight}`} />
                ) : (
                    <div className="text-white font-semibold">Header</div>
                )}
            </div>
        </header>
    </div>
);

export const HeaderContentConfig: ComponentConfig<HeaderContentProps> = {
    fields: {
        backgroundColor: {
            type: "select",
            options: [
                { label: "Semi-transparent Black", value: "rgba(0, 0, 0, 0.5)" },
                { label: "Solid Black", value: "#000000" },
                { label: "Semi-transparent White", value: "rgba(255, 255, 255, 0.9)" },
                { label: "SGA Red", value: "#dc2626" },
                { label: "Transparent", value: "transparent" },
            ]
        },
        padding: {
            type: "select",
            options: [
                { label: "Small (p-2)", value: "p-2" },
                { label: "Medium (p-3)", value: "p-3" },
                { label: "Large (p-4)", value: "p-4" },
                { label: "Extra Large (p-5)", value: "p-5" },
                { label: "Extra Large (p-6)", value: "p-6" },
            ]
        },
        titleText: { type: "text" },
        titleSize: {
            type: "select",
            options: [
                { label: "Extra Large (9xl)", value: "text-9xl" },
                { label: "Large (8xl)", value: "text-8xl" },
                { label: "Extra Large (7xl)", value: "text-7xl" },
                { label: "Extra Large (6xl)", value: "text-6xl" },
                { label: "Extra Large (5xl)", value: "text-5xl" },
            ]
        },
        titleColor: {
            type: "select",
            options: [
                { label: "SGA Red", value: "text-sga-red" },
                { label: "White", value: "text-white" },
                { label: "Black", value: "text-black" },
                { label: "Blue", value: "text-blue-600" },
            ]
        },
        logoSrc: { type: "text" },
        logoAltText: { type: "text" },
        logoWidth: {
            type: "select",
            options: [
                { label: "Small (w-32)", value: "w-32" },
                { label: "Medium (w-40)", value: "w-40" },
                { label: "Large (w-48)", value: "w-48" },
                { label: "Extra Large (w-52)", value: "w-52" },
                { label: "Extra Large (w-64)", value: "w-64" },
            ]
        },
        logoHeight: {
            type: "select",
            options: [
                { label: "Auto", value: "h-auto" },
                { label: "Small (h-16)", value: "h-16" },
                { label: "Medium (h-20)", value: "h-20" },
                { label: "Large (h-24)", value: "h-24" },
                { label: "Extra Large (h-32)", value: "h-32" },
            ]
        },
        dividerColor: {
            type: "select",
            options: [
                { label: "Black", value: "bg-black" },
                { label: "White", value: "bg-white" },
                { label: "SGA Red", value: "bg-sga-red" },
                { label: "Gray", value: "bg-gray-500" },
            ]
        },
        dividerWidth: {
            type: "select",
            options: [
                { label: "Thin (w-px)", value: "w-px" },
                { label: "Normal (w-1)", value: "w-1" },
                { label: "Thick (w-2)", value: "w-2" },
                { label: "Extra Thick (w-4)", value: "w-4" },
            ]
        },
        dividerHeight: {
            type: "select",
            options: [
                { label: "Small (h-20)", value: "h-20" },
                { label: "Medium (h-32)", value: "h-32" },
                { label: "Large (h-40)", value: "h-40" },
                { label: "Extra Large (h-48)", value: "h-48" },
                { label: "Full (h-[180px])", value: "h-[180px]" },
            ]
        },
        dividerMargin: {
            type: "select",
            options: [
                { label: "Small (mx-2)", value: "mx-2" },
                { label: "Medium (mx-4)", value: "mx-4" },
                { label: "Large (mx-6)", value: "mx-6" },
                { label: "Extra Large (mx-8)", value: "mx-8" },
            ]
        },
    },
    defaultProps: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: "p-5",
        titleText: "SGA",
        titleSize: "text-9xl",
        titleColor: "text-sga-red",
        logoSrc: "",
        logoAltText: "SGA Logo",
        logoWidth: "w-52",
        logoHeight: "h-auto",
        dividerColor: "bg-black",
        dividerWidth: "w-1",
        dividerHeight: "h-[180px]",
        dividerMargin: "mx-8",
    },
    render: (props) => <HeaderContent {...props} />,
}