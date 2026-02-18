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

import "@puckeditor/core/puck.css";
import { Client } from "./client";
import { Metadata } from "next";
import { getPage, getPageById, getDraftById } from "../../../lib/get-page";
import { prisma } from "../../../lib/prisma";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ puckPath: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const { puckPath = [] } = await params;
  const path = `/${puckPath.join("/")}`;

  return {
    title: "Puck: " + path,
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ puckPath: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { puckPath = [] } = await params;
  const path = `/${puckPath.join("/")}`;
  const searchParamsResolved = await searchParams;
  const draftIdParam = searchParamsResolved.draftId;

  // console.log("Page component - searchParams:", {
  //   path,
  //   puckPath,
  //   draftIdParam,
  //   type: typeof draftIdParam,
  //   isArray: Array.isArray(draftIdParam),
  //   allParams: Object.keys(searchParamsResolved),
  //   resolved: JSON.stringify(searchParamsResolved)
  // });

  let data: any = null;
  let pageId: number | undefined;
  let draftId: number | undefined;
  let finalDraftId: number | undefined;

  // If draftId is provided, load that specific draft
  // Handle both string and array cases (Next.js can return arrays for query params)
  let draftIdValue: string | undefined;
  if (Array.isArray(draftIdParam)) {
    draftIdValue = draftIdParam[0];
  } else if (typeof draftIdParam === "string") {
    draftIdValue = draftIdParam;
  }

  if (draftIdValue) {
    const draftIdNum = parseInt(draftIdValue, 10);
    if (!isNaN(draftIdNum)) {
      // console.log("Attempting to load draft:", draftIdNum);
      const draft = await getDraftById(draftIdNum);
      if (draft) {
        data = draft.content;
        pageId = draft.pageId;
        draftId = draft.id;
        // Get the page to find finalDraftId
        const page = await getPageById(draft.pageId);
        if (page) {
          finalDraftId = page.finalDraftId || undefined;
        }
        // console.log("Loaded draft:", { draftId: draft.id, pageId: draft.pageId, hasContent: !!data });
      } else {
        // console.log("Draft not found:", draftIdNum);
      }
    } else {
      // console.log("Invalid draftId value:", draftIdValue);
    }
  }

  // Only load final draft if we didn't load a specific draft
  if (!data) {
    // First get the page by path to find its ID
    const pageByPath = await prisma.page.findUnique({
      where: { path },
      select: { id: true },
    });

    if (pageByPath) {
      // Then use the helper function to get the full page with relations
      const page = await getPageById(pageByPath.id);
      if (page) {
        pageId = page.id;
        finalDraftId = page.finalDraftId || undefined;
        if (page.finalDraft) {
          data = page.finalDraft.content;
          draftId = page.finalDraft.id;
        }
        // console.log("Loaded page final draft:", { pageId: page.id, draftId, finalDraftId, hasContent: !!data });
      }
    }
  }

  // If no data found and it's the root path, provide default
  if (!data && (path === "/" || path === "")) {
    data = {
      content: [
        { type: "Header", props: { nav: [] } },
      ],
      root: {},
    } as any;
  }

  return (
    <Client
      key={`${path}-${draftId || 'no-draft'}`} // Force re-render when draftId changes
      path={path}
      data={data || {}}
      pageId={pageId}
      draftId={draftId}
      finalDraftId={finalDraftId}
    />
  );
}

export const dynamic = "force-dynamic";
