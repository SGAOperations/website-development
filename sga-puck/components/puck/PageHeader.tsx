import React from 'react';

interface PageHeaderProps {
    title?: string;
    subtitle?: string;
    description?: string;
    additionalText?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    title = "JOIN A COMMITTEE",
    subtitle,
    description = "SGA Committees meet once a week to focus on a specific aspect of the student experience and work on projects related to improving an aspect of the university. They are open to all undergraduate Northeastern students on the Boston Campus, and no experience or commitment is necessary!",
    additionalText = "To join a committee just show up! Find more information about each committee at the links below."
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
