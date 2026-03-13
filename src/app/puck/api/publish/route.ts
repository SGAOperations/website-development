import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { publishDraft } from "../../../../lib/draft-utils";
import { getPageById } from "../../../../lib/get-page";

/**
 * POST /puck/api/publish
 * Publish a draft (set it as the final draft for a page)
 * Body: { pageId: number, draftId: number }
 */
export async function POST(request: Request) {
    const payload = await request.json();

    if (!payload.pageId || typeof payload.pageId !== "number") {
        return NextResponse.json(
            { error: "pageId is required and must be a number" },
            { status: 400 }
        );
    }

    if (!payload.draftId || typeof payload.draftId !== "number") {
        return NextResponse.json(
            { error: "draftId is required and must be a number" },
            { status: 400 }
        );
    }

    try {
        await publishDraft(payload.pageId, payload.draftId);

        // Get page to revalidate the path
        const page = await getPageById(payload.pageId);
        if (page) {
            revalidatePath(page.path);
        }

        return NextResponse.json({
            status: "ok",
            message: "Draft published successfully",
        });
    } catch (error: any) {
        console.error("Failed to publish draft", error);
        return NextResponse.json(
            { error: error.message || "Failed to publish draft" },
            { status: 500 }
        );
    }
}

