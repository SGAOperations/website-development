import type { Config } from "@measured/puck";

type Props = {
  HeaderComponent: {};
  DivisionHero: {
    backgroundImage: string;
    title: string;
  };
  DivisionAbout: {
    heading: string;
    description: string;
    emails: Array<{ email: string }>;
  };
  TeamSection: {
    divisionName: string;
  };
  PrioritiesList: {
    heading: string;
    priorities: Array<{
      title: string;
      description: string;
    }>;
  };
  FooterComponent: {};
};

export const config: Config<Props> = {
  components: {
    HeaderComponent: {
      fields: {},
      render: () => (
        <div className="absolute top-0 left-0 w-full z-20">
          {/* Add your Header component here when ready */}
          <div className="bg-black text-white p-4">Header Placeholder</div>
        </div>
      ),
    },

    DivisionHero: {
      fields: {
        backgroundImage: { type: "text" },
        title: { type: "text" },
      },
      defaultProps: {
        backgroundImage:
          "https://images.squarespace-cdn.com/content/v1/5939fcd1db29d6ec60929205/1604528719911-HAR17AA5QU2UNF4772WB/campus_update_09.jpg?format=2500w",
        title: "Office of the President",
      },
      render: ({ backgroundImage, title }) => (
        <>
          <div className="relative w-full h-screen overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[75%] overflow-hidden">
              <img
                className="w-full scale-100 transform origin-center"
                src={backgroundImage}
                alt={title}
              />
            </div>
          </div>
          <div
            style={{ marginTop: "-120px" }}
            className="text-7xl mb-4 font-bold text-black text-center my-8"
          >
            {title}
          </div>
        </>
      ),
    },

    DivisionAbout: {
      fields: {
        heading: { type: "text" },
        description: { type: "textarea" },
        emails: {
          type: "array",
          arrayFields: {
            email: { type: "text" },
          },
        },
      },
      defaultProps: {
        heading: "About the Division",
        description: "",
        emails: [],
      },
      render: ({ heading, description, emails }) => (
        <div>
          <h3 className="text-5xl font-bold text-red-600 text-center mt-16 mb-4">
            {heading}
          </h3>
          <p className="text-center text-black mx-30 mt-6 mb-2">
            {description}
          </p>
          {emails.map((item, idx) => (
            <p key={idx} className="text-center text-red-600">
              ✉️:{" "}
              <a
                className="hover:underline transition-all duration-300"
                href={`mailto:${item.email}`}
              >
                {item.email}
              </a>
            </p>
          ))}
        </div>
      ),
    },

    TeamSection: {
      fields: {
        divisionName: {
          type: "select",
          options: [
            {
              label: "Office of the President",
              value: "Office of the President",
            },
            { label: "Academic Affairs", value: "Academic Affairs" },
            { label: "Campus Affairs", value: "Campus Affairs" },
          ],
        },
      },
      defaultProps: {
        divisionName: "Office of the President",
      },
      render: ({ divisionName }) => (
        <div className="flex justify-center my-8">
          <div className="text-center">
            <p className="text-xl">Team for {divisionName}</p>
            {/* Connect your Pictures component here */}
          </div>
        </div>
      ),
    },

    PrioritiesList: {
      fields: {
        heading: { type: "text" },
        priorities: {
          type: "array",
          arrayFields: {
            title: { type: "text" },
            description: { type: "textarea" },
          },
        },
      },
      defaultProps: {
        heading: "Presidential Priorities",
        priorities: [],
      },
      render: ({ heading, priorities }) => (
        <div className="mb-20">
          <h3 className="text-5xl font-bold text-red-600 text-center mt-16">
            {heading}
          </h3>
          <ul>
            {priorities.map((priority, idx) => (
              <li key={idx} className="text-left text-black mx-30 mb-3">
                <span className="font-bold">• {priority.title}: </span>
                {priority.description}
              </li>
            ))}
          </ul>
        </div>
      ),
    },

    FooterComponent: {
      fields: {},
      render: () => (
        <footer className="bg-black text-white p-8 text-center">
          Footer Placeholder
        </footer>
      ),
    },
  },
};

export default config;
