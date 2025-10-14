import type { Config } from "@measured/puck";

type NavItem = {
  label: string;
  href: string;
};

type Props = {
  HeaderContent: {
    backgroundColor?: string;
    padding?: string;
    titleText?: string;
    titleSize?: string;
    titleColor?: string;
    logoSrc?: string;
    logoAltText?: string;
    logoWidth?: string;
    logoHeight?: string;
    dividerColor?: string;
    dividerWidth?: string;
    dividerHeight?: string;
    dividerMargin?: string;
  };
  Navigation: {
    backgroundColor?: string;
    padding?: string;
    nav: Array<{
      label: string;
      items: Array<NavItem>;
    }>;
  };
  Content: {
    backgroundColor?: string;
    padding?: string;
    minHeight?: string;
    text?: string;
  };
  Footer: {
    showActionButtons?: boolean;
    actionButton1Text?: string;
    actionButton1Href?: string;
    actionButton2Text?: string;
    actionButton2Href?: string;
    actionButton3Text?: string;
    actionButton3Href?: string;
    showSocialMedia?: boolean;
    socialMedia1Label?: string;
    socialMedia1LogoSrc?: string;
    socialMedia1LogoAlt?: string;
    socialMedia2Label?: string;
    socialMedia2LogoSrc?: string;
    socialMedia2LogoAlt?: string;
    socialMedia3Label?: string;
    socialMedia3LogoSrc?: string;
    socialMedia3LogoAlt?: string;
    organizationName?: string;
    organizationAddress?: string;
    webmasterEmail?: string;
    webmasterLabel?: string;
    mediaInquiriesEmail?: string;
    mediaInquiriesLabel?: string;
  };
};

export const config: Config<Props> = {
  components: {
    HeaderContent: {
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
        titleText: { type: "text" },
        titleSize: { 
          type: "select",
          options: [
            { label: "Extra Large (9xl)", value: "text-9xl" },
            { label: "Large (8xl)", value: "text-8xl" },
            { label: "Extra Large (7xl)", value: "text-7xl" },
            { label: "Extra Large (6xl)", value: "text-6xl" },
            { label: "Extra Large (5xl)", value: "text-5xl" },
          ]
        },
        titleColor: { 
          type: "select",
          options: [
            { label: "SGA Red", value: "text-sga-red" },
            { label: "White", value: "text-white" },
            { label: "Black", value: "text-black" },
            { label: "Blue", value: "text-blue-600" },
          ]
        },
        logoSrc: { type: "text" },
        logoAltText: { type: "text" },
        logoWidth: { 
          type: "select",
          options: [
            { label: "Small (w-32)", value: "w-32" },
            { label: "Medium (w-40)", value: "w-40" },
            { label: "Large (w-48)", value: "w-48" },
            { label: "Extra Large (w-52)", value: "w-52" },
            { label: "Extra Large (w-64)", value: "w-64" },
          ]
        },
        logoHeight: { 
          type: "select",
          options: [
            { label: "Auto", value: "h-auto" },
            { label: "Small (h-16)", value: "h-16" },
            { label: "Medium (h-20)", value: "h-20" },
            { label: "Large (h-24)", value: "h-24" },
            { label: "Extra Large (h-32)", value: "h-32" },
          ]
        },
        dividerColor: { 
          type: "select",
          options: [
            { label: "Black", value: "bg-black" },
            { label: "White", value: "bg-white" },
            { label: "SGA Red", value: "bg-sga-red" },
            { label: "Gray", value: "bg-gray-500" },
          ]
        },
        dividerWidth: { 
          type: "select",
          options: [
            { label: "Thin (w-px)", value: "w-px" },
            { label: "Normal (w-1)", value: "w-1" },
            { label: "Thick (w-2)", value: "w-2" },
            { label: "Extra Thick (w-4)", value: "w-4" },
          ]
        },
        dividerHeight: { 
          type: "select",
          options: [
            { label: "Small (h-20)", value: "h-20" },
            { label: "Medium (h-32)", value: "h-32" },
            { label: "Large (h-40)", value: "h-40" },
            { label: "Extra Large (h-48)", value: "h-48" },
            { label: "Full (h-[180px])", value: "h-[180px]" },
          ]
        },
        dividerMargin: { 
          type: "select",
          options: [
            { label: "Small (mx-2)", value: "mx-2" },
            { label: "Medium (mx-4)", value: "mx-4" },
            { label: "Large (mx-6)", value: "mx-6" },
            { label: "Extra Large (mx-8)", value: "mx-8" },
          ]
        },
      },
      defaultProps: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: "p-5",
        titleText: "SGA",
        titleSize: "text-9xl",
        titleColor: "text-sga-red",
        logoSrc: "",
        logoAltText: "SGA Logo",
        logoWidth: "w-52",
        logoHeight: "h-auto",
        dividerColor: "bg-black",
        dividerWidth: "w-1",
        dividerHeight: "h-[180px]",
        dividerMargin: "mx-8",
      },
      render: ({ 
        backgroundColor = "rgba(0, 0, 0, 0.5)",
        padding = "p-5",
        titleText = "SGA", 
        titleSize = "text-9xl", 
        titleColor = "text-sga-red",
        logoSrc,
        logoAltText = "SGA Logo",
        logoWidth = "w-52",
        logoHeight = "h-auto",
        dividerColor = "bg-black",
        dividerWidth = "w-1",
        dividerHeight = "h-[180px]",
        dividerMargin = "mx-8"
      }) => (
        <div className="relative w-screen">
          <header
            className={`flex flex-col justify-center items-center h-auto w-screen relative top-0 ${padding}`}
            style={{ backgroundColor }}
          >
            <div className="flex items-center">
              <h1 className={`${titleSize} font-bold ${titleColor} text-center`}>
                {titleText}
              </h1>
              <div className={`inline-block ${dividerHeight} min-h-[1em] ${dividerWidth} self-stretch ${dividerColor} ${dividerMargin}`}></div>
              {logoSrc ? (
                <img src={logoSrc} alt={logoAltText} className={`${logoWidth} ${logoHeight}`} />
              ) : (
                <div className="text-white font-semibold">Header</div>
              )}
            </div>
          </header>
        </div>
      ),
    },
    Navigation: {
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
      render: ({ backgroundColor = "rgba(0, 0, 0, 0.5)", padding = "p-5", nav = [] }) => (
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
      ),
    },
    Content: {
      fields: {
        backgroundColor: { 
          type: "select",
          options: [
            { label: "White", value: "#ffffff" },
            { label: "Light Gray", value: "#f5f5f5" },
            { label: "SGA Red", value: "#dc2626" },
            { label: "Black", value: "#000000" },
            { label: "Transparent", value: "transparent" },
          ]
        },
        padding: { 
          type: "select",
          options: [
            { label: "None", value: "p-0" },
            { label: "Small (p-4)", value: "p-4" },
            { label: "Medium (p-6)", value: "p-6" },
            { label: "Large (p-8)", value: "p-8" },
            { label: "Extra Large (p-12)", value: "p-12" },
          ]
        },
        minHeight: { 
          type: "select",
          options: [
            { label: "Auto", value: "min-h-0" },
            { label: "Small (h-32)", value: "min-h-32" },
            { label: "Medium (h-48)", value: "min-h-48" },
            { label: "Large (h-64)", value: "min-h-64" },
            { label: "Extra Large (h-96)", value: "min-h-96" },
          ]
        },
        text: { type: "text" },
      },
      defaultProps: {
        backgroundColor: "#ffffff",
        padding: "p-8",
        minHeight: "min-h-64",
        text: "Content Block - Add your content here",
      },
      render: ({ 
        backgroundColor = "#ffffff", 
        padding = "p-8", 
        minHeight = "min-h-64",
        text = "Content Block - Add your content here"
      }) => (
        <div 
          className={`w-full ${padding} ${minHeight} flex items-center justify-center`}
          style={{ backgroundColor }}
        >
          <div className="text-center text-gray-600">
            <p className="text-lg">{text}</p>
            <p className="text-sm mt-2">This is an empty content block. You can add other components here.</p>
          </div>
        </div>
      ),
    },
    Footer: {
      fields: {
        showActionButtons: { 
          type: "radio",
          options: [
            { label: "Show", value: true },
            { label: "Hide", value: false },
          ]
        },
        actionButton1Text: { type: "text" },
        actionButton1Href: { type: "text" },
        actionButton2Text: { type: "text" },
        actionButton2Href: { type: "text" },
        actionButton3Text: { type: "text" },
        actionButton3Href: { type: "text" },
        showSocialMedia: { 
          type: "radio",
          options: [
            { label: "Show", value: true },
            { label: "Hide", value: false },
          ]
        },
        socialMedia1Label: { type: "text" },
        socialMedia1LogoSrc: { type: "text" },
        socialMedia1LogoAlt: { type: "text" },
        socialMedia2Label: { type: "text" },
        socialMedia2LogoSrc: { type: "text" },
        socialMedia2LogoAlt: { type: "text" },
        socialMedia3Label: { type: "text" },
        socialMedia3LogoSrc: { type: "text" },
        socialMedia3LogoAlt: { type: "text" },
        organizationName: { type: "text" },
        organizationAddress: { type: "text" },
        webmasterEmail: { type: "text" },
        webmasterLabel: { type: "text" },
        mediaInquiriesEmail: { type: "text" },
        mediaInquiriesLabel: { type: "text" },
      },
      defaultProps: {
        showActionButtons: true,
        actionButton1Text: "GIVE FEEDBACK",
        actionButton1Href: "#",
        actionButton2Text: "MAILING LIST",
        actionButton2Href: "#",
        actionButton3Text: "GET INVOLVED",
        actionButton3Href: "#",
        showSocialMedia: true,
        socialMedia1Label: "SGA",
        socialMedia1LogoSrc: "",
        socialMedia1LogoAlt: "SGA Instagram",
        socialMedia2Label: "Campus Affairs",
        socialMedia2LogoSrc: "",
        socialMedia2LogoAlt: "Campus Affairs Instagram",
        socialMedia3Label: "SGA",
        socialMedia3LogoSrc: "",
        socialMedia3LogoAlt: "SGA TikTok",
        organizationName: "Northeastern University Student Government Association",
        organizationAddress: "332 Curry Student Center, 360 Huntington Avenue, Boston, MA 02115",
        webmasterEmail: "sgaOperations@northeastern.edu",
        webmasterLabel: "Webmaster:",
        mediaInquiriesEmail: "sgaExternalAffairs@northeastern.edu",
        mediaInquiriesLabel: "Media Inquiries:",
      },
      render: ({
        showActionButtons = true,
        actionButton1Text = "GIVE FEEDBACK",
        actionButton1Href = "#",
        actionButton2Text = "MAILING LIST",
        actionButton2Href = "#",
        actionButton3Text = "GET INVOLVED",
        actionButton3Href = "#",
        showSocialMedia = true,
        socialMedia1Label = "SGA",
        socialMedia1LogoSrc = "",
        socialMedia1LogoAlt = "SGA Instagram",
        socialMedia2Label = "Campus Affairs",
        socialMedia2LogoSrc = "",
        socialMedia2LogoAlt = "Campus Affairs Instagram",
        socialMedia3Label = "SGA",
        socialMedia3LogoSrc = "",
        socialMedia3LogoAlt = "SGA TikTok",
        organizationName = "Northeastern University Student Government Association",
        organizationAddress = "332 Curry Student Center, 360 Huntington Avenue, Boston, MA 02115",
        webmasterEmail = "sgaOperations@northeastern.edu",
        webmasterLabel = "Webmaster:",
        mediaInquiriesEmail = "sgaExternalAffairs@northeastern.edu",
        mediaInquiriesLabel = "Media Inquiries:",
      }) => (
        <footer className="bg-black relative bottom-0 left-0 w-screen text-center overflow-hidden mx-0 px-0">
          {showActionButtons && (
            <div className="button-container flex justify-center items-center pt-10">
              <button className="button bg-black text-white border-2 border-white transition-all duration-350 ease-in-out hover:bg-white hover:text-black">{actionButton1Text}</button>
              <button className="button bg-black text-white border-2 border-white transition-all duration-350 ease-in-out hover:bg-white hover:text-black">{actionButton2Text}</button>
              <button className="button bg-black text-white border-2 border-white transition-all duration-350 ease-in-out hover:bg-white hover:text-black">{actionButton3Text}</button>
            </div>
          )}
          
          {showSocialMedia && (
            <div className="flex justify-center items-center gap-5 py-6">
              <div className="flex flex-col items-center px-5">
                <p className="text-white font-light pb-3">{socialMedia1Label}</p>
                {socialMedia1LogoSrc ? (
                  <img src={socialMedia1LogoSrc} alt={socialMedia1LogoAlt} className="w-16 h-auto" />
                ) : (
                  <div className="w-16 h-16 bg-gray-600 flex items-center justify-center text-white text-xs">Logo</div>
                )}
              </div>
              <div className="flex flex-col items-center px-5">
                <p className="text-white font-light pb-3">{socialMedia2Label}</p>
                {socialMedia2LogoSrc ? (
                  <img src={socialMedia2LogoSrc} alt={socialMedia2LogoAlt} className="w-16 h-auto" />
                ) : (
                  <div className="w-16 h-16 bg-gray-600 flex items-center justify-center text-white text-xs">Logo</div>
                )}
              </div>
              <div className="flex flex-col items-center px-5">
                <p className="text-white font-light pb-3">{socialMedia3Label}</p>
                {socialMedia3LogoSrc ? (
                  <img src={socialMedia3LogoSrc} alt={socialMedia3LogoAlt} className="w-16 h-auto" />
                ) : (
                  <div className="w-16 h-16 bg-gray-600 flex items-center justify-center text-white text-xs">Logo</div>
                )}
              </div>
            </div>
          )}
          
          <div className="pb-10">
            <p className="text-white font-light pb-4">{organizationName}</p>
            <p className="text-white font-light pb-4">{organizationAddress}</p>
            <p className="text-white font-light pb-4">{webmasterLabel}&nbsp;  
              <a 
                href={`mailto:${webmasterEmail}`}
                className="underline text-white font-light hover:text-gray-300"
              >
                {webmasterEmail}
              </a>
            </p>
            <p className="text-white font-light pb-4">{mediaInquiriesLabel}&nbsp; 
              <a 
                href={`mailto:${mediaInquiriesEmail}`}
                className="underline text-white font-light hover:text-gray-300 transition duration-300"
              >
                {mediaInquiriesEmail}
              </a>
            </p>
          </div>
        </footer>
      ),
    },
  },
};

export default config;
