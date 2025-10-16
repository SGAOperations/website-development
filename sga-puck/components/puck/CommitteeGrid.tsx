import React from 'react';

interface CommitteeGridProps {
    title?: string;
    committees?: Array<{ value: string }>;
}

export const CommitteeGrid: React.FC<CommitteeGridProps> = ({
    title = "COMMITTEE MEETINGS",
    committees = [
        { value: "ACADEMIC AFFAIRS" },
        { value: "CAMPUS SERVICES" },
        { value: "SUSTAINABILITY" },
        { value: "GLOBAL EXPERIENCE" },
        { value: "WELLNESS" },
        { value: "STUDENT ENGAGEMENT" },
        { value: "DIVERSITY, EQUITY, AND INCLUSION" },
        { value: "COMMUNICATIONS AND EVENTS" },
        { value: "STUDENT ORGANIZATION OPERATIONS" }
    ]
}) => {
    const handleCommitteeClick = (committee: string) => {
        console.log(`Clicked on ${committee}`);
        // TODO: Add navigation logic
    };

    return (
        <div className="py-10 px-5 w-full max-w-screen font-sans bg-white box-border overflow-hidden">
            <div className="max-w-6xl mx-auto w-full box-border">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold uppercase text-red-600 mb-8 leading-tight break-words">
                    {title}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 w-full box-border overflow-hidden">
                    {committees.map((committee, index) => (
                        <button
                            key={index}
                            onClick={() => handleCommitteeClick(committee.value)}
                            className="bg-red-600 hover:bg-red-700 text-white border-none rounded-lg px-3 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-5 text-xs sm:text-sm lg:text-sm font-bold uppercase text-center cursor-pointer transition-all duration-200 ease-in-out min-h-[50px] sm:min-h-[60px] lg:min-h-[70px] flex items-center justify-center leading-tight w-full box-border break-words overflow-hidden hover:-translate-y-0.5"
                        >
                            {committee.value}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CommitteeGrid;
