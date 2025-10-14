import React from 'react';
import './CommitteeGrid.css';

interface CommitteeGridProps {
    title?: string;
    committees?: string[];
}

export const CommitteeGrid: React.FC<CommitteeGridProps> = ({
    title = "COMMITTEE MEETINGS",
    committees = [
        "ACADEMIC AFFAIRS",
        "CAMPUS SERVICES",
        "SUSTAINABILITY",
        "GLOBAL EXPERIENCE",
        "WELLNESS",
        "STUDENT ENGAGEMENT",
        "DIVERSITY, EQUITY, AND INCLUSION",
        "COMMUNICATIONS AND EVENTS",
        "STUDENT ORGANIZATION OPERATIONS"
    ]
}) => {
    const handleCommitteeClick = (committee: string) => {
        console.log(`Clicked on ${committee}`);
        // TODO: Add navigation logic
    };

    return (
        <div style={{
            padding: '40px 20px',
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
                <h2 style={{
                    fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    color: '#DC2626', // Red color
                    margin: '0 0 32px 0',
                    lineHeight: '1.2',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word'
                }}>
                    {title}
                </h2>

                <div className="committee-grid">
                    {committees.map((committee, index) => (
                        <button
                            key={index}
                            onClick={() => handleCommitteeClick(committee)}
                            style={{
                                backgroundColor: '#DC2626', // Red background
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '8px',
                                padding: 'clamp(12px, 2vw, 20px)',
                                fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s ease, transform 0.1s ease',
                                minHeight: 'clamp(50px, 8vw, 70px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                lineHeight: '1.2',
                                width: '100%',
                                boxSizing: 'border-box',
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word',
                                overflow: 'hidden'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#B91C1C'; // Darker red on hover
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#DC2626'; // Original red
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            {committee}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CommitteeGrid;
