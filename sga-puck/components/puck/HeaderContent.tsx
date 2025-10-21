import React from 'react';

type HeaderContentProps = {
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
    backgroundColor = "rgba(0, 0, 0, 0.5)",
    padding = "p-5",
    titleText = "SGA",
    titleSize = "text-9xl",
    titleColor = "text-sga-red",
    logoSrc,
    logoAltText = "SGA Logo",
    logoWidth = "w-52",
    logoHeight = "h-auto",
    dividerColor = "bg-black",
    dividerWidth = "w-1",
    dividerHeight = "h-[180px]",
    dividerMargin = "mx-8"
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
