import { ComponentConfig } from '@measured/puck';
import React from 'react';

export type ContentProps = {
    backgroundColor?: string;
    padding?: string;
    minHeight?: string;
    text?: string;
};

export const Content: React.FC<ContentProps> = ({
    backgroundColor,
    padding,
    minHeight,
    text,
}) => (
    <div
        className={`w-full ${padding} ${minHeight} flex items-center justify-center`}
        style={{ backgroundColor }}
    >
        <div className="text-center text-gray-600">
            <p className="text-lg">{text}</p>
            <p className="text-sm mt-2">This is an empty content block. You can add other components here.</p>
        </div>
    </div>
);


export const ContentConfig: ComponentConfig<ContentProps> = {
    fields: {
        backgroundColor: {
            type: "select",
            options: [
                { label: "White", value: "#ffffff" },
                { label: "Light Gray", value: "#f5f5f5" },
                { label: "SGA Red", value: "#dc2626" },
                { label: "Black", value: "#000000" },
                { label: "Transparent", value: "transparent" },
            ]
        },
        padding: {
            type: "select",
            options: [
                { label: "None", value: "p-0" },
                { label: "Small (p-4)", value: "p-4" },
                { label: "Medium (p-6)", value: "p-6" },
                { label: "Large (p-8)", value: "p-8" },
                { label: "Extra Large (p-12)", value: "p-12" },
            ]
        },
        minHeight: {
            type: "select",
            options: [
                { label: "Auto", value: "min-h-0" },
                { label: "Small (h-32)", value: "min-h-32" },
                { label: "Medium (h-48)", value: "min-h-48" },
                { label: "Large (h-64)", value: "min-h-64" },
                { label: "Extra Large (h-96)", value: "min-h-96" },
            ]
        },
        text: { type: "text" },
    },
    defaultProps: {
        backgroundColor: "#ffffff",
        padding: "p-8",
        minHeight: "min-h-64",
        text: "Content Block - Add your content here",
    },
    render: (props) => <Content {...props} />,
}
