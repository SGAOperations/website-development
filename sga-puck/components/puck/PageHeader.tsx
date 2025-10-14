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
        <div style={{
            padding: '20px 20px',
            width: '100%',
            maxWidth: '100vw',
            fontFamily: 'sans-serif',
            backgroundColor: '#FFFFFF',
            boxSizing: 'border-box',
            overflow: 'hidden'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <h1 style={{
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    color: '#000000',
                    margin: '0 0 24px 0',
                    lineHeight: '1.2',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word'
                }}>
                    {title}
                </h1>

                {subtitle && (
                    <h2 style={{
                        fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
                        fontWeight: '600',
                        color: '#000000',
                        margin: '0 0 16px 0',
                        lineHeight: '1.3',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word'
                    }}>
                        {subtitle}
                    </h2>
                )}

                {description && (
                    <p style={{
                        fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
                        color: '#000000',
                        margin: '0 0 16px 0',
                        lineHeight: '1.6',
                        maxWidth: '100%',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word'
                    }}>
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
                    <p style={{
                        fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
                        color: '#000000',
                        margin: '0',
                        lineHeight: '1.6',
                        maxWidth: '100%',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word'
                    }}>
                        {additionalText}
                    </p>
                )}
            </div>
        </div>
    );
};

export default PageHeader;
