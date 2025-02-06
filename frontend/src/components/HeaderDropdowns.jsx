import React, { useState } from 'react';

export default function HeaderDropdowns() {
  const [openDropdown, setOpenDropdown] = useState(null); // Track which dropdown is open

  const handleMouseEnter = (index) => setOpenDropdown(index);
  const handleMouseLeave = () => setOpenDropdown(null);

  // Define unique menu items for each main item
  const dropdownMenus = [
    [],
    [
      { label: 'What is SGA?', href: '#' },
      { label: 'Structure', href: '#' },
      { label: 'Divisions', href: '#' },
      { label: 'Leadership', href: '#' },
      { label: 'Our Projects', href: '#' },
      { label: 'Meeting Minutes', href: '#' },
      { label: 'Governing Documents', href: '#' },
      { label: 'In The Press', href: '#' },
      { label: 'Alumni', href: '#' },

    ],
    [
      { label: 'Overview', href: '#' },
      { label: 'Join a Committee', href: '#' },
      { label: 'Join a Board', href: '#' },
      { label: 'Join a Working Group', href: '#' },
      { label: 'Become a Senator', href: '#' },
      { label: 'Leadership and Board Applications', href: '#' },
      { label: 'Mailing List', href: '#' },
    ],
    [
      { label: 'About', href: '#' },
      { label: 'Legislation', href: '#' },
      { label: 'Points of Information', href: '#' },
      { label: 'Resources', href: '#' },
    ],
    [
      { label: 'Office of the President', href: '#' },
      { label: 'Academic Affairs', href: '#' },
      { label: 'Campus Affairs', href: '#' },
      { label: 'Student Success', href: '#' },
      { label: 'Diversity, Equity, and Inclusion', href: '#' },
      { label: 'External Affairs', href: '#' },
      { label: 'Operational Affairs', href: '#' },
    ],
    [
      { label: 'Operational Appeals Board', href: '#' },
      { label: 'Appeal Process', href: '#' },
    ],
    [
      { label: 'Elections Board', href: '#' },
      { label: 'Election', href: '#' },
      { label: 'Referenda', href: '#' },
      { label: 'Past Elections', href: '#' },
      { label: 'How to Run', href: '#' },
    ],
    [
      { label: 'Overview', href: '#' },
      { label: 'Student Involvement', href: '#' },
      { label: 'Finance Board', href: '#' },
      { label: 'Starting an Organization', href: '#' },
      { label: 'Funding', href: '#' },
      { label: 'Policies', href: '#' },
      { label: 'Resources', href: '#' },
    ],
  ];

  return (
    <div className="relative inline-block text-left">
      <div className="flex flex-row justify-around w-full">
        {['Home', 'About', 'Get Involved', 'Senate', 'Executive Branch', 'Judicial Branch', 'Elections', 'Student Organizations'].map((item, index) => (
          <div
            key={index}
            className="relative" // Make this div relative for absolute positioning of dropdown
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="whitespace-nowrap inline-flex justify-center cursor-pointer mx-7 pt-5 pb-2 text-lg font-semibold text-white hover:text-black transition duration-300">
              {item}
            </div>
            {openDropdown === index && dropdownMenus[index].length > 0 && (
              <div
                className="absolute left-3 z-10 w-56 origin-top-right rounded-md bg-black ring-1 shadow-lg ring-black/5 transition focus:outline-hidden"
              >
                <div className="py-1">
                  {dropdownMenus[index].map((menuItem, menuIndex) => (
                    <a
                      key={menuIndex}
                      href={menuItem.href}
                      className="block px-4 py-2 text-m text-white hover:bg-gray-800 hover:rounded-md focus:outline-none focus:bg-gray-700 transition duration-200"
                    >
                      {menuItem.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}