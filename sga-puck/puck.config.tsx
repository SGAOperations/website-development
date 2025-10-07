import type { Config } from "@measured/puck";

type NavItem = {
  label: string;
  href: string;
};

type Props = {
  Header: {
    nav: Array<{
      label: string;
      items: Array<NavItem>;
    }>;
    logoSrc?: string;
  };
};

export const config: Config<Props> = {
  components: {
    Header: {
      fields: {
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
        logoSrc: { type: "text" },
      },
      defaultProps: {
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
      render: ({ nav = [], logoSrc }) => (
        <div className="relative w-screen">
          <header
            className="flex flex-col justify-center items-center h-auto w-screen relative top-0 p-5"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="flex items-center">
              <h1 className="text-9xl font-bold text-sga-red text-center">SGA</h1>
              <div className="inline-block h-[180px] min-h-[1em] w-1 self-stretch bg-black mx-8"></div>
              {logoSrc ? (
                <img src={logoSrc} alt="SGA Logo" className="w-52 h-auto" />
              ) : (
                <div className="text-white font-semibold">Header</div>
              )}
            </div>
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
      ),
    },
  },
};

export default config;
