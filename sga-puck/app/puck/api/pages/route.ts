import { NextResponse } from "next/server";
import { createPageWithDraft } from "../../../../lib/draft-utils";
import { Data } from "@measured/puck";

/**
 * POST /puck/api/pages
 * Create a new page with an initial draft
 * Body: { name: string, content: Data, publish?: boolean }
 */
export async function POST(request: Request) {
  const payload = await request.json();

  if (!payload.name || typeof payload.name !== "string") {
    return NextResponse.json(
      { error: "name is required and must be a string" },
      { status: 400 }
    );
  }

  if (!payload.content) {
    return NextResponse.json(
      { error: "content is required" },
      { status: 400 }
    );
  }

  const publish = payload.publish !== false; // Default to true

  try {
    const page = await createPageWithDraft(
      payload.name,
      payload.content as Data,
      publish
    );

    return NextResponse.json({
      status: "ok",
      page: {
        id: page.id,
        name: page.name,
        path: page.path,
        finalDraftId: page.finalDraftId,
      },
    });
  } catch (error: any) {
    console.error("Failed to create page", error);
    return NextResponse.json(
      { error: error.message || "Failed to create page" },
      { status: 500 }
    );
  }
}

