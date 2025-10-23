import type { Config } from "@measured/puck";
import { PageHeader } from "./components/puck/PageHeader";
import { CommitteeGrid } from "./components/puck/CommitteeGrid";
import { HeaderContent } from "./components/puck/HeaderContent";
import { Navigation } from "./components/puck/Navigation";
import { Content } from "./components/puck/Content";
import { Footer } from "./components/puck/Footer";
import { Title, TitleProps } from "./components/puck/Title";
import { Container, ContainerProps } from "./components/puck/Container";
import { Paragraph, ParagraphProps } from "./components/puck/Paragraph";
import { MasonryGrid, MasonryGridProps } from "./components/puck/MasonryGrid";
import { BulletList, BulletListProps } from "./components/puck/BulletList";
import { LinkButton, LinkButtonProps } from "./components/puck/Button";
import { MinimumColumnWidthGrid, MinimumColumnWidthGridProps } from "./components/puck/MinimumColumnWidthGrid";

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
  CommitteeGrid: {
    title?: string;
    committees?: Array<{ value: string }>;
  };
  PageHeader: {
    title?: string;
    subtitle?: string;
    description?: string;
    additionalText?: string;
  };

  Title: TitleProps;
  Container: ContainerProps;
  Paragraph: ParagraphProps;
  MasonryGrid: MasonryGridProps;
  BulletList: BulletListProps;
  LinkButton: LinkButtonProps;
  MinimumColumnWidthGrid: MinimumColumnWidthGridProps;
};

const booleanSettingsField = {
  type: "radio",
  options: [
    { label: "True", value: true },
    { label: "False", value: false },
  ]
} as const

const gapSettingsField = {
  type: "select",
  options: [
    { label: "None", value: "gap-0" },
    { label: "Small (gap-2)", value: "gap-2" },
    { label: "Medium (gap-4)", value: "gap-4" },
    { label: "Large (gap-6)", value: "gap-6" },
    { label: "Extra Large (gap-8)", value: "gap-8" },
    // { label: "Page container (gap-1"}
  ],
} as const;

const heightSettingsField = {
  type: "select",
  options: [
    { label: "Auto", value: "h-auto" },
    { label: "Full", value: "h-full" },
  ],
} as const;

const widthSettingsField = {
  type: "select",
  options: [
    { label: "Auto", value: "w-auto" },
    { label: "Full", value: "w-full" },
  ],
} as const;

const paddingSettingsField = {
  type: "select",
  options: [
    { label: "None", value: "p-0" },
    { label: "Small (p-2)", value: "p-2" },
    { label: "Medium (p-4)", value: "p-4" },
    { label: "Large (p-6)", value: "p-6" },
    { label: "Extra Large (p-8)", value: "p-8" },
    { label: "2XL (p-10)", value: "p-10" },
    { label: "3XL (p-12)", value: "p-12" },
    // { label: "Page content (dynamic)", value: "p-6 md:p-8 lg:p-14" },
    { label: "Page content (dynamic)", value: "p-[clamp(1rem,4vw,4rem)]" }, // This very closely matches the old site's page padding
  ]
} as const;

const outlineSettingsField = {
  type: "select",
  options: [
    { label: "None", value: "" },
    { label: "Thin", value: "border border-1" },
    { label: "Normal", value: "border border-2" },
    { label: "Thick", value: "border border-4" },
  ]
} as const;

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
      render: (props) => <HeaderContent {...props} />,
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
      render: (props) => <Navigation {...props} />,
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
      render: (props) => <Content {...props} />,
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
      render: (props) => <Footer {...props} />,
    },
    CommitteeGrid: {
      fields: {
        title: { type: "text" },
        committees: {
          type: "array",
          arrayFields: {
            value: { type: "text" },
          },
        },
      },
      defaultProps: {
        title: "COMMITTEE MEETINGS",
        committees: [
          { value: "ACADEMIC AFFAIRS" },
          { value: "CAMPUS SERVICES" },
          { value: "SUSTAINABILITY" },
          { value: "GLOBAL EXPERIENCE" },
          { value: "WELLNESS" },
          { value: "STUDENT ENGAGEMENT" },
          { value: "DIVERSITY, EQUITY, AND INCLUSION" },
          { value: "COMMUNICATIONS AND EVENTS" },
          { value: "STUDENT ORGANIZATION OPERATIONS" }
        ],
      },
      render: (props) => <CommitteeGrid {...props} />,
    },
    PageHeader: {
      fields: {
        title: { type: "text" },
        subtitle: { type: "text" },
        description: { type: "textarea" },
        additionalText: { type: "textarea" },
      },
      defaultProps: {
        title: "JOIN A COMMITTEE",
        subtitle: "",
        description: "SGA Committees meet once a week to focus on a specific aspect of the student experience and work on projects related to improving an aspect of the university. They are open to all undergraduate Northeastern students on the Boston Campus, and no experience or commitment is necessary!",
        additionalText: "To join a committee just show up! Find more information about each committee at the links below.",
      },
      render: (props) => <PageHeader {...props} />,
    },


    Title: {
      fields: {
        text: { type: "text" },
        size: {
          type: "select",
          options: [
            { label: "Main (h1)", value: "main" },
            { label: "Section (h2)", value: "section" },
            { label: "Subsection (h3)", value: "subsection" },
            { label: "Tertiary (h4)", value: "tertiary" },
          ],
        },
        center: booleanSettingsField,
        uppercase: booleanSettingsField,
      },
      defaultProps: {
        text: "Title Text",
        size: "main",
        center: false,
        uppercase: true,
      },
      render: (props) => <Title {...props} />,
    },
    
    Container: {
      fields: {
        content: { type: "slot" },
        // TODO: Factor out these common options, like padding
        padding: paddingSettingsField,
        gap: gapSettingsField,
        outline: outlineSettingsField
      },
      defaultProps: {
        content: null,
        padding: "p-10",
        gap: "gap-6",
      },
      render: (props) => <Container {...props} />,
    },

    Paragraph: {
      fields: {
        text: { type: "textarea" },
      },
      defaultProps: {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
      render: (props) => <Paragraph {...props} />,
    },

    MasonryGrid: {
      fields: {
        content: { type: "slot" },
        gap: gapSettingsField,
        childrenBottomMargin: {
          type: "select",
          options: [ // TODO: make numerical or style based (i.e. small, medium, large)
            { label: "None", value: "[&>*]:mb-0" },
            { label: "Small (mb-2)", value: "[&>*]:mb-2" },
            { label: "Medium (mb-4)", value: "[&>*]:mb-4" },
          ]
        }
      },
      defaultProps: {
        content: null,
        gap: "gap-4",
        childrenBottomMargin: "mb-4",
      },
      render: (props) => <MasonryGrid {...props} />,
    },

    BulletList: {
      fields: {
        bullet: {
          type: "select",
          options: [
            { label: "Disc", value: "disc" },
            { label: "Decimal", value: "decimal" },
            { label: "None", value: "none" },
          ]
        },
        items: {
          type: "array",
          arrayFields: {
            text: { type: "text" },
          },
        },
      },
      defaultProps: {
        bullet: "disc",
        items: [
          { text: "First item" },
          { text: "Second item" },
          { text: "Third item" },
        ],
      },
      render: (props) => <BulletList {...props} />,
    },

    LinkButton: {
      fields: {
        label: { type: "text" },
        style: {
          type: "select",
          options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
          ]
        },
        href: { type: "text" },
        padding: paddingSettingsField,
        height: heightSettingsField,
        width: widthSettingsField,
      },
      defaultProps: {
        label: "Button",
        style: "primary",
        href: "#",
        padding: "p-4",
        height: "h-full",
        width: "w-full",
      },
      render: (props) => <LinkButton {...props} />,
    },

    MinimumColumnWidthGrid: {
      fields: {
        content: { type: "slot" },
        minimumColumnWidthPixels: {
          type: "number",
          label: "Minimum Column Width (in pixels)",
        },
        gap: gapSettingsField,
      },
      defaultProps: {
        content: null,
        minimumColumnWidthPixels: 250,
        gap: "gap-4",
      },
      render: (props) => <MinimumColumnWidthGrid {...props} />,
    },


  },
};

export default config;
