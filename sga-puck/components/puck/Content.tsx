import React from 'react';

type ContentProps = {
    backgroundColor?: string;
    padding?: string;
    minHeight?: string;
    text?: string;
};

export const Content: React.FC<ContentProps> = ({
    backgroundColor = "#ffffff",
    padding = "p-8",
    minHeight = "min-h-64",
    text = "Content Block - Add your content here"
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
