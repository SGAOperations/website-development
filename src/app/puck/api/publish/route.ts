import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { publishVersion } from "../../../../lib/version-utils";
import { prisma } from "../../../../lib/prisma";

/**
 * POST /puck/api/publish
 * Publish a version (set it as the published version for a document)
 * Body: { documentId: number, versionId: number }
 */
export async function POST(request: Request) {
  const payload = await request.json();

  if (!payload.documentId || typeof payload.documentId !== "number") {
    return NextResponse.json(
      { error: "documentId is required and must be a number" },
      { status: 400 }
    );
  }

  if (!payload.versionId || typeof payload.versionId !== "number") {
    return NextResponse.json(
      { error: "versionId is required and must be a number" },
      { status: 400 }
    );
  }

  try {
    await publishVersion(payload.documentId, payload.versionId);

    // Revalidate all route paths for this document
    const routes = await prisma.route.findMany({
      where: { documentId: payload.documentId },
    });
    for (const route of routes) {
      revalidatePath(route.path);
    }

    return NextResponse.json({
      status: "ok",
      message: "Version published successfully",
    });
  } catch (error: any) {
    console.error("Failed to publish version", error);
    return NextResponse.json(
      { error: error.message || "Failed to publish version" },
      { status: 500 }
    );
  }
}
