import { NextResponse } from "next/server";
import { getDocumentById } from "../../../../../lib/get-document";

/**
 * GET /puck/api/documents/[documentId]
 * Get document information including publishedVersionId
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ documentId: string }> }
) {
  const { documentId } = await params;
  const documentIdNum = parseInt(documentId, 10);

  if (isNaN(documentIdNum)) {
    return NextResponse.json(
      { error: "Invalid documentId" },
      { status: 400 }
    );
  }

  try {
    const document = await getDocumentById(documentIdNum);

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      document: {
        id: document.id,
        name: document.name,
        publishedVersionId: document.publishedVersionId,
      },
    });
  } catch (error: any) {
    console.error("Failed to get document", error);
    return NextResponse.json(
      { error: error.message || "Failed to get document" },
      { status: 500 }
    );
  }
}
