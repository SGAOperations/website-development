import React from 'react';

type NavItem = {
    label: string;
    href: string;
};

type NavigationProps = {
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
                        <div className="whitespace-nowrap inline-flex justify-center cursor-pointer mx-7 pt-5 pb-2 text-lg font-semibold text-white group-hover:text-black transition duration-300">
                            {group.label}
                        </div>
                        {Array.isArray(group.items) && group.items.length > 0 && (
                            <div className="absolute left-3 z-10 w-56 origin-top-right rounded-md bg-black ring-1 shadow-lg ring-black/5 opacity-0 group-hover:opacity-100 transition">
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
