import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { createDraft, updateDraft, publishDraft, createPageWithDraft } from "../../../lib/draft-utils";
import { slugify } from "../../../lib/path-utils";
import { Data } from "@measured/puck";
import { getDraftById, getPageById } from "../../../lib/get-page";

export async function POST(request: Request) {
  const payload = await request.json();

  // Backward compatibility: if no action specified, treat as publish
  const action = payload.action || "publish";

  // console.log("API received payload:", {
  //   action,
  //   hasPageId: !!payload.pageId,
  //   hasPath: !!payload.path,
  //   hasPageName: !!payload.pageName,
  //   hasDraftId: payload.draftId !== undefined,
  //   draftId: payload.draftId,
  //   hasData: !!payload.data,
  // });

  try {
    let pageId: number;
    let path: string;

    // Determine page and path
    if (payload.pageId) {
      // Existing page
      const page = await getPageById(payload.pageId);
      if (!page) {
        return NextResponse.json({ error: "Page not found" }, { status: 404 });
      }
      pageId = page.id;
      path = page.path;
    } else if (payload.pageName) {
      // New page
      path = slugify(payload.pageName);
      const newPage = await createPageWithDraft(
        payload.pageName,
        payload.data,
        action === "publish"
      );
      pageId = newPage.id;

      if (action === "publish") {
        revalidatePath(path);
      }

      return NextResponse.json({
        status: "ok",
        pageId: newPage.id,
        draftId: newPage.finalDraftId,
        path,
      });
    } else if (payload.path) {
      // Backward compatibility: find page by path
      const page = await prisma.page.findUnique({
        where: { path: payload.path },
      });
      if (!page) {
        return NextResponse.json(
          { error: "Page not found. Use pageName to create a new page." },
          { status: 404 }
        );
      }
      pageId = page.id;
      path = page.path;
    } else {
      return NextResponse.json(
        { error: "Either pageId, pageName, or path is required" },
        { status: 400 }
      );
    }

    // Handle draft operations
    if (action === "save-draft") {
      // If draftId is provided, update existing draft; otherwise create new one
      if (payload.draftId !== undefined && payload.draftId !== null && typeof payload.draftId === "number") {
        // Verify the draft belongs to the page
        const existingDraft = await getDraftById(payload.draftId);

        if (!existingDraft) {
          return NextResponse.json(
            { error: "Draft not found or does not belong to this page" },
            { status: 404 }
          );
        }

        // Update existing draft
        const draft = await updateDraft(payload.draftId, payload.data);
        return NextResponse.json({
          status: "ok",
          draftId: draft.id,
          pageId,
          path,
          updated: true,
        });
      } else {
        // Create a new draft
        const draft = await createDraft(pageId, payload.data);
        return NextResponse.json({
          status: "ok",
          draftId: draft.id,
          pageId,
          path,
          updated: false,
        });
      }
    } else if (action === "publish") {
      // If draftId is provided, update and publish existing draft; otherwise create new one
      if (payload.draftId !== undefined && payload.draftId !== null && typeof payload.draftId === "number") {
        // Verify the draft belongs to the page
        const existingDraft = await getDraftById(payload.draftId);

        if (!existingDraft) {
          return NextResponse.json(
            { error: "Draft not found or does not belong to this page" },
            { status: 404 }
          );
        }

        // Update existing draft and publish it
        const draft = await updateDraft(payload.draftId, payload.data);
        await publishDraft(pageId, draft.id);
        revalidatePath(path);
        return NextResponse.json({
          status: "ok",
          draftId: draft.id,
          pageId,
          path,
          updated: true,
        });
      } else {
        // Create draft and publish it
        const draft = await createDraft(pageId, payload.data);
        await publishDraft(pageId, draft.id);
        revalidatePath(path);
        return NextResponse.json({
          status: "ok",
          draftId: draft.id,
          pageId,
          path,
          updated: false,
        });
      }
    } else {
      return NextResponse.json(
        { error: "Invalid action. Use 'save-draft' or 'publish'" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Failed to persist page", error);
    return NextResponse.json(
      { error: error.message || "Failed to persist page" },
      { status: 500 }
    );
  }
}
