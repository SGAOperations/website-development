import { NextResponse } from "next/server";
import { createDocumentWithVersion } from "../../../../lib/version-utils";
import { Data } from "@puckeditor/core";

/**
 * POST /puck/api/documents
 * Create a new document with an initial version
 * Body: { name: string, content?: Data, publish?: boolean }
 */
export async function POST(request: Request) {
  const payload = await request.json();

  if (!payload.name || typeof payload.name !== "string") {
    return NextResponse.json(
      { error: "name is required and must be a string" },
      { status: 400 }
    );
  }

  const content = payload.content || { content: [], root: {} };
  const publish = payload.publish !== false;

  try {
    const document = await createDocumentWithVersion(
      payload.name,
      content as Data,
      publish
    );

    return NextResponse.json({
      status: "ok",
      document: {
        id: document.id,
        name: document.name,
        publishedVersionId: document.publishedVersionId,
      },
    });
  } catch (error: any) {
    console.error("Failed to create document", error);
    return NextResponse.json(
      { error: error.message || "Failed to create document" },
      { status: 500 }
    );
  }
}
