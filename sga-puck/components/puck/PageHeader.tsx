import React from 'react';

interface PageHeaderProps {
    title?: string;
    subtitle?: string;
    description?: string;
    additionalText?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    subtitle,
    description,
    additionalText,
}) => {
    return (
        <div className="pb-5 pt-15 w-full max-w-screen font-sans bg-white box-border overflow-hidden">
            <div className="max-w-6xl mx-auto w-full box-border">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase text-black mb-6 leading-tight break-words">
                    {title}
                </h1>

                {subtitle && (
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-black mb-4 leading-snug break-words">
                        {subtitle}
                    </h2>
                )}

                {description && (
                    <p className="text-sm sm:text-base lg:text-lg text-black mb-4 leading-relaxed max-w-full break-words">
                        {description.split('**').map((part, index) =>
                            index % 2 === 1 ? (
                                <strong key={index}>{part}</strong>
                            ) : (
                                part
                            )
                        )}
                    </p>
                )}

                {additionalText && (
                    <p className="text-sm sm:text-base lg:text-lg text-black m-0 leading-relaxed max-w-full break-words">
                        {additionalText}
                    </p>
                )}
            </div>
        </div>
    );
};

export default PageHeader;
