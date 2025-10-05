/**
 * This file implements a *magic* catch-all route that renders the Puck editor.
 *
 * This route exposes /puck/[...puckPath], but is disabled by middleware.ts. The middleware
 * then rewrites all URL requests ending in `/edit` to this route, allowing you to visit any
 * page in your application and add /edit to the end to spin up a Puck editor.
 *
 * This approach enables public pages to be statically rendered whilst the /puck route can
 * remain dynamic.
 *
 * NB this route is public, and you will need to add authentication
 */

import "@measured/puck/puck.css";
import { Client } from "./client";
import { Metadata } from "next";
import { getPage } from "../../../lib/get-page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ puckPath: string[] }>;
}): Promise<Metadata> {
  const { puckPath = [] } = await params;
  const path = `/${puckPath.join("/")}`;

  return {
    title: "Puck: " + path,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ puckPath: string[] }>;
}) {
  const { puckPath = [] } = await params;
  const path = `/${puckPath.join("/")}`;
  const data = getPage(path);

  // If no data exists, create default Office of the President template
  if (!data && path === "/office-of-the-president") {
    data = {
      content: [
        { type: "HeaderComponent", props: {} },
        {
          type: "DivisionHero",
          props: {
            backgroundImage: "https://images.squarespace-cdn.com/content/v1/5939fcd1db29d6ec60929205/1604528719911-HAR17AA5QU2UNF4772WB/campus_update_09.jpg?format=2500w",
            title: "Office of the President",
          },
        },
        {
          type: "DivisionAbout",
          props: {
            heading: "About the Division",
            description: "The Office of the President consists of the Student Body President and the Executive Vice President, both of which are elected by the undergraduate student body. The Office of the President is responsible for organizing the entire Student Government Association. This includes executing all policies and objectives of the Association and overseeing external communications with the community bodies and Boston-area student governance bodies. Additionally, the EVP serves to assist the President in long-term planning, special projects, and initiatives and oversees the Association's internal communications, all Senate communications, events, archives, fundraising, and alumni connections.",
            emails: [
              { email: "sgaPresident@northeastern.edu" },
              { email: "sgaEVP@northeastern.edu" },
            ],
          },
        },
        {
          type: "TeamSection",
          props: { divisionName: "Office of the President" },
        },
        {
          type: "PrioritiesList",
          props: {
            heading: "Presidential Priorities",
            priorities: [
              {
                title: "Boost Campus Spirit",
                description: "Organize fun and engaging events to enhance school spirit and foster a vibrant campus community.",
              },
              {
                title: "Enhance the Student Organization Experience",
                description: "Improve support and resources for student organizations to enrich involvement and ensure a positive experience for all members.",
              },
              {
                title: "Strengthen Connections",
                description: "Build stronger relationships between students and administrators to ensure student voices are heard and considered in university decisions.",
              },
              {
                title: "Expand SGA Accessibility",
                description: "Make the Student Government Association more accessible to all students and broaden our reach to ensure representation across the entire student body.",
              },
            ],
          },
        },
        { type: "FooterComponent", props: {} },
      ],
      root: {},
    };
  }

  return <Client path={path} data={data || {}} />;
}

export const dynamic = "force-dynamic";
