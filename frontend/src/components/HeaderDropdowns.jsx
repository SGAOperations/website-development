import React, { useState } from 'react';

export default function HeaderDropdowns() {
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleMouseEnter = (index) => setOpenDropdown(index);
  const handleMouseLeave = () => setOpenDropdown(null);

  const dropdownMenus = [
    [], // empty for the Home dropdown
    [   // About
      { label: 'What is SGA?', href: '/about' },
      { label: 'Structure', href: '/structure' },
      { label: 'Divisions', href: '/divisions' },
      { label: 'Leadership', href: '/leadership' },
      { label: 'Our Projects', href: '/projects' },
      { label: 'Meeting Minutes', href: '/meetings' },
      { label: 'Governing Documents', href: '/documents' },
      { label: 'In The Press', href: '/press' },
      { label: 'Alumni', href: '/alumni' },

    ],
    [   // Get Involved 
      { label: 'Overview', href: '/overview' },
      { label: 'Join a Committee', href: '/committees' },
      { label: 'Join a Board', href: '/boards' },
      { label: 'Join a Working Group', href: '/working-groups' },
      { label: 'Become a Senator', href: '/senators' },
      { label: 'Leadership and Board Applications', href: '/leadership-and-board' },
      { label: 'Mailing List', href: '/mailing-list' },
    ],
    [   // Senate
      { label: 'About', href: '/about' },
      { label: 'Legislation', href: '/legislation' },
      { label: 'Points of Information', href: '/points-of-information' },
      { label: 'Resources', href: '/resources' },
    ],
    [   // Executive Branch
      { label: 'Office of the President', href: '#' },
      { label: 'Academic Affairs', href: '/academic-affairs' },
      { label: 'Campus Affairs', href: '/campus-affairs' },
      { label: 'Student Success', href: '/student-success' },
      { label: 'Diversity, Equity, and Inclusion', href: '/diversity-equity-inclusion' },
      { label: 'External Affairs', href: '/external-affairs' },
      { label: 'Operational Affairs', href: '/operational-affairs' },
    ],
    [   // Judicial Branch
      { label: 'Operational Appeals Board', href: '/operational-appeals-board' },
      { label: 'Appeal Process', href: '/appeal-process' },
    ],
    [   // Elections
      { label: 'Elections Board', href: '/elections-board' },
      { label: 'Election', href: '/election' },
      { label: 'Referenda', href: '/referenda' },
      { label: 'Past Elections', href: '/past-elections' },
      { label: 'How to Run', href: '/how-to-run' },
    ],
    [   // Student Organizations
      { label: 'Overview', href: '/overview' },
      { label: 'Student Involvement', href: '/student-involvement' },
      { label: 'Finance Board', href: '/finance-board' },
      { label: 'Starting an Organization', href: '/starting-an-organization' },
      { label: 'Funding', href: '/funding' },
      { label: 'Policies', href: '/policies' },
      { label: 'Resources', href: '/resources' },
    ],
  ];

  return (
    <div className="relative inline-block text-left">
      <div className="flex flex-row justify-around w-full">
        {['Home', 'About', 'Get Involved', 'Senate', 'Executive Branch', 'Judicial Branch', 'Elections', 'Student Organizations'].map((item, index) => (
          <div
            key={index}
            className="relative"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              if (item === 'Home') {
                window.location.href = '/';
              }
            }}
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