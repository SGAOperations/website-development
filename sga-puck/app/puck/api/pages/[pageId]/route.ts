import { NextResponse } from "next/server";
import { getPageById } from "../../../../../lib/get-page";

/**
 * GET /puck/api/pages/[pageId]
 * Get page information including finalDraftId
 */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ pageId: string }> }
) {
    const { pageId } = await params;
    const pageIdNum = parseInt(pageId, 10);

    if (isNaN(pageIdNum)) {
        return NextResponse.json(
            { error: "Invalid pageId" },
            { status: 400 }
        );
    }

    try {
        const page = await getPageById(pageIdNum);

        if (!page) {
            return NextResponse.json(
                { error: "Page not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            page: {
                id: page.id,
                name: page.name,
                path: page.path,
                finalDraftId: page.finalDraftId,
            },
        });
    } catch (error: any) {
        console.error("Failed to get page", error);
        return NextResponse.json(
            { error: error.message || "Failed to get page" },
            { status: 500 }
        );
    }
}

