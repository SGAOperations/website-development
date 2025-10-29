import { ComponentConfig } from '@measured/puck';
import React from 'react';

type NavItem = {
    label: string;
    href: string;
};

export type NavigationProps = {
    backgroundColor?: string;
    padding?: string;
    nav: Array<{
        label: string;
        items: Array<NavItem>;
    }>;
};

export const Navigation: React.FC<NavigationProps> = ({
    backgroundColor,
    padding,
    nav,
}) => (
    <div className="relative w-screen">
        <header
            className={`flex flex-col justify-center items-center h-auto w-screen relative top-0 ${padding}`}
            style={{ backgroundColor }}
        >
            <div className="mt-4 w-full flex flex-row justify-around">
                {nav.map((group, index) => (
                    <div key={index} className="relative group">
                        <div className="peer whitespace-nowrap inline-flex justify-center cursor-pointer mx-7 pt-5 pb-2 text-lg font-semibold text-white group-hover:text-black transition duration-300">
                            {group.label}
                        </div>
                        {Array.isArray(group.items) && group.items.length > 0 && (
                            <div className="opacity-0 pointer-events-none 
                                            peer-hover:opacity-100 group-hover:opacity-100
                                            peer-hover:pointer-events-auto group-hover:pointer-events-auto 
                                            transition-opacity duration-300 
                                            absolute left-3 z-10 w-56 origin-top-right rounded-md bg-black ring-1 shadow-lg ring-black/5
                            ">
                                <div className="py-1">
                                    {group.items.map((item, itemIdx) => (
                                        <a
                                            key={itemIdx}
                                            href={item.href || "#"}
                                            className="block px-4 py-2 text-m text-white hover:bg-gray-800 hover:rounded-md focus:outline-none focus:bg-gray-700 transition duration-200"
                                        >
                                            {item.label || "Item"}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </header>
    </div>
);


export const NavigationConfig: ComponentConfig<NavigationProps> = {
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
        nav: {
            type: "array",
            arrayFields: {
                label: { type: "text" },
                items: {
                    type: "array",
                    arrayFields: {
                        label: { type: "text" },
                        href: { type: "text" },
                    },
                },
            },
        },
    },
    defaultProps: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: "p-5",
        nav: [
            { label: "Home", items: [] },
            {
                label: "About",
                items: [
                    { label: "What is SGA?", href: "/about" },
                    { label: "Structure", href: "/structure" },
                    { label: "Divisions", href: "/divisions" },
                    { label: "Leadership", href: "/leadership" },
                    { label: "Our Projects", href: "/projects" },
                    { label: "Meeting Minutes", href: "/meetings" },
                    { label: "Governing Documents", href: "/documents" },
                    { label: "In The Press", href: "/press" },
                    { label: "Alumni", href: "/alumni" },
                ],
            },
            {
                label: "Get Involved",
                items: [
                    { label: "Overview", href: "/overview" },
                    { label: "Join a Committee", href: "/committees" },
                    { label: "Join a Board", href: "/boards" },
                    { label: "Join a Working Group", href: "/working-groups" },
                    { label: "Become a Senator", href: "/senators" },
                    { label: "Leadership and Board Applications", href: "/leadership-and-board" },
                    { label: "Mailing List", href: "/mailing-list" },
                ],
            },
            {
                label: "Senate",
                items: [
                    { label: "About", href: "/about" },
                    { label: "Legislation", href: "/legislation" },
                    { label: "Points of Information", href: "/points-of-information" },
                    { label: "Resources", href: "/resources" },
                ],
            },
            {
                label: "Executive Branch",
                items: [
                    { label: "Office of the President", href: "/office-of-the-president" },
                    { label: "Academic Affairs", href: "/academic-affairs" },
                    { label: "Campus Affairs", href: "/campus-affairs" },
                    { label: "Diversity, Equity, and Inclusion", href: "/diversity-equity-inclusion" },
                    { label: "External Affairs", href: "/external-affairs" },
                    { label: "Student Involvement", href: "/student-involvement" },
                    { label: "Student Success", href: "/student-success" },
                    { label: "Operational Affairs", href: "/operational-affairs" },
                ],
            },
            {
                label: "Judicial Branch",
                items: [
                    { label: "Operational Appeals Board", href: "/operational-appeals-board" },
                    { label: "Appeal Process", href: "/appeal-process" },
                ],
            },
            {
                label: "Elections",
                items: [
                    { label: "Elections Board", href: "/elections-board" },
                    { label: "Election", href: "/election" },
                    { label: "Referenda", href: "/referenda" },
                    { label: "Past Elections", href: "/past-elections" },
                    { label: "How to Run", href: "/how-to-run" },
                ],
            },
            {
                label: "Student Organizations",
                items: [
                    { label: "Overview", href: "/overview" },
                    { label: "Student Involvement", href: "/student-involvement" },
                    { label: "Finance Board", href: "/finance-board" },
                    { label: "Starting an Organization", href: "/starting-an-organization" },
                    { label: "Funding", href: "/funding" },
                    { label: "Policies", href: "/policies" },
                    { label: "Resources", href: "/resources" },
                ],
            },
        ],
    },
    render: (props) => <Navigation {...props} />,
}
