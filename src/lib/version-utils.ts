import { Data } from "@puckeditor/core";
import { prisma } from "./prisma";

/**
 * Create a new version for an existing document (always inserts, never updates)
 */
export async function createVersion(
  documentId: number,
  content: Data
): Promise<{ id: number; documentId: number; content: Data; createdAt: Date }> {
  const version = await prisma.version.create({
    data: {
      documentId,
      content: content as any,
    },
  });

  return {
    id: version.id,
    documentId: version.documentId,
    content: version.content as Data,
    createdAt: version.createdAt,
  };
}

/**
 * Publish a version (set it as the published version for a document)
 */
export async function publishVersion(
  documentId: number,
  versionId: number
): Promise<void> {
  // Verify the version belongs to the document
  const version = await prisma.version.findFirst({
    where: {
      id: versionId,
      documentId: documentId,
    },
  });

  if (!version) {
    throw new Error("Version not found or does not belong to the specified document");
  }

  await prisma.document.update({
    where: { id: documentId },
    data: { publishedVersionId: versionId },
  });
}

/**
 * Create a new document with an initial version
 * @param name - The document name
 * @param content - The Puck data
 * @param publish - Whether to publish the version immediately
 */
export async function createDocumentWithVersion(
  name: string,
  content: Data,
  publish: boolean = false
) {
  // Create document and version in a transaction
  const result = await prisma.$transaction(async (tx) => {
    const document = await tx.document.create({
      data: {
        name,
      },
    });

    const version = await tx.version.create({
      data: {
        documentId: document.id,
        content: content as any,
      },
    });

    // If publish is true, set as published version
    if (publish) {
      await tx.document.update({
        where: { id: document.id },
        data: { publishedVersionId: version.id },
      });
    }

    return {
      document: {
        ...document,
        publishedVersionId: publish ? version.id : null,
      },
      version,
    };
  });

  return result.document;
}
