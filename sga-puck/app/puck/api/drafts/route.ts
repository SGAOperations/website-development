import { NextResponse } from "next/server";
import { getDrafts, getDraftById } from "../../../../lib/get-page";
import { createDraft } from "../../../../lib/draft-utils";
import { Data } from "@measured/puck";
import { prisma } from "../../../../lib/prisma";

/**
 * GET /puck/api/drafts?pageId=123
 * List all drafts for a page
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get("pageId");

  if (!pageId) {
    return NextResponse.json(
      { error: "pageId query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const pageIdNum = parseInt(pageId, 10);
    if (isNaN(pageIdNum)) {
      return NextResponse.json(
        { error: "pageId must be a valid number" },
        { status: 400 }
      );
    }

    const drafts = await getDrafts(pageIdNum);
    return NextResponse.json({ drafts });
  } catch (error: any) {
    console.error("Failed to get drafts", error);
    return NextResponse.json(
      { error: error.message || "Failed to get drafts" },
      { status: 500 }
    );
  }
}

/**
 * POST /puck/api/drafts
 * Create a new draft for a page
 * Body: { pageId: number, content: Data }
 */
export async function POST(request: Request) {
  const payload = await request.json();

  if (!payload.pageId || typeof payload.pageId !== "number") {
    return NextResponse.json(
      { error: "pageId is required and must be a number" },
      { status: 400 }
    );
  }

  if (!payload.content) {
    return NextResponse.json(
      { error: "content is required" },
      { status: 400 }
    );
  }

  try {
    const draft = await createDraft(payload.pageId, payload.content as Data);
    return NextResponse.json({
      status: "ok",
      draft: {
        id: draft.id,
        pageId: draft.pageId,
        createdAt: draft.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Failed to create draft", error);
    return NextResponse.json(
      { error: error.message || "Failed to create draft" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /puck/api/drafts?draftId=123
 * Delete a draft
 */
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const draftId = searchParams.get("draftId");

  if (!draftId) {
    return NextResponse.json(
      { error: "draftId query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const draftIdNum = parseInt(draftId, 10);
    if (isNaN(draftIdNum)) {
      return NextResponse.json(
        { error: "draftId must be a valid number" },
        { status: 400 }
      );
    }

    // Get the draft to check if it's the final draft
    const draft = await getDraftById(draftIdNum);

    if (!draft) {
      return NextResponse.json(
        { error: "Draft not found" },
        { status: 404 }
      );
    }

    // Prevent deleting the final draft
    if (draft.page.finalDraftId === draftIdNum) {
      return NextResponse.json(
        { error: "Cannot delete the published draft. Please publish a different draft first." },
        { status: 400 }
      );
    }

    // Delete the draft
    await prisma.draft.delete({
      where: { id: draftIdNum },
    });

    return NextResponse.json({
      status: "ok",
      message: "Draft deleted successfully",
    });
  } catch (error: any) {
    console.error("Failed to delete draft", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete draft" },
      { status: 500 }
    );
  }
}

