import type { Config } from "@measured/puck";
import { PageHeader } from "./components/puck/PageHeader";
import { CommitteeGrid } from "./components/puck/CommitteeGrid";

type Props = {
  HeadingBlock: { title: string };
  PageHeader: {
    title?: string;
    subtitle?: string;
    description?: string;
    additionalText?: string;
  };
  CommitteeGrid: {
    title?: string;
    committees?: { value: string }[];
  };
};

export const config: Config<Props> = {
  components: {
    HeadingBlock: {
      fields: {
        title: { type: "text" },
      },
      defaultProps: {
        title: "Heading",
      },
      render: ({ title }) => (
        <div style={{ padding: 64 }}>
          <h1>{title}</h1>
        </div>
      ),
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
        description: "SGA Committees meet once a week to focus on a specific aspect of the student experience and work on projects related to improving an aspect of the university. They are open to all undergraduate Northeastern students on the Boston Campus, and **no experience or commitment is necessary!**",
        additionalText: "To join a committee just show up! Find more information about each committee at the links below.",
      },
      render: ({ title, subtitle, description, additionalText }) => (
        <PageHeader
          title={title}
          subtitle={subtitle}
          description={description}
          additionalText={additionalText}
        />
      ),
    },
    CommitteeGrid: {
      fields: {
        title: { type: "text" },
        committees: {
          type: "array",
          arrayFields: {
            value: { type: "text" }
          }
        },
      },
      defaultProps: {
        title: "COMMITTEE MEETINGS",
        committees: [
          "ACADEMIC AFFAIRS",
          "CAMPUS SERVICES",
          "SUSTAINABILITY",
          "GLOBAL EXPERIENCE",
          "WELLNESS",
          "STUDENT ENGAGEMENT",
          "DIVERSITY, EQUITY, AND INCLUSION",
          "COMMUNICATIONS AND EVENTS",
          "STUDENT ORGANIZATION OPERATIONS"
        ].map(name => ({ value: name })),
      },
      render: ({ title, committees }) => (
        <CommitteeGrid
          title={title}
          committees={committees?.map(c => c.value) || []}
        />
      ),
    },
  },
};

export default config;
