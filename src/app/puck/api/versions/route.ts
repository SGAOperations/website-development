import { NextResponse } from "next/server";
import { getVersions } from "../../../../lib/get-document";
import { createVersion } from "../../../../lib/version-utils";
import { Data } from "@puckeditor/core";

/**
 * GET /puck/api/versions?documentId=123
 * List all versions for a document (immutable — no DELETE)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const documentId = searchParams.get("documentId");

  if (!documentId) {
    return NextResponse.json(
      { error: "documentId query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const documentIdNum = parseInt(documentId, 10);
    if (isNaN(documentIdNum)) {
      return NextResponse.json(
        { error: "documentId must be a valid number" },
        { status: 400 }
      );
    }

    const versions = await getVersions(documentIdNum);
    return NextResponse.json({ versions });
  } catch (error: any) {
    console.error("Failed to get versions", error);
    return NextResponse.json(
      { error: error.message || "Failed to get versions" },
      { status: 500 }
    );
  }
}

/**
 * POST /puck/api/versions
 * Create a new version for a document
 * Body: { documentId: number, content: Data }
 */
export async function POST(request: Request) {
  const payload = await request.json();

  if (!payload.documentId || typeof payload.documentId !== "number") {
    return NextResponse.json(
      { error: "documentId is required and must be a number" },
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
    const version = await createVersion(payload.documentId, payload.content as Data);

    return NextResponse.json({
      status: "ok",
      version: {
        id: version.id,
        documentId: version.documentId,
        createdAt: version.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Failed to create version", error);
    return NextResponse.json(
      { error: error.message || "Failed to create version" },
      { status: 500 }
    );
  }
}
