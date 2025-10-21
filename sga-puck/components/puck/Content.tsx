import React from 'react';

type ContentProps = {
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
