"use server";

import { Data } from "@puckeditor/core";
import { prisma } from "../prisma";
import type { Prisma } from "../../generated/prisma/client";
import { createEmptyPuckData } from "../puck/utils";
import { validateName } from "../utils";
import type {
  ActionResult,
  ArchiveDocumentInput,
  CreateDocumentInput,
  DuplicateDocumentInput,
  MoveDocumentInput,
  RenameInput,
  SaveVersionInput,
  PublishVersionInput,
  Version,
} from "../types";
import { wrapAction } from "../utils";

function assertNotArchived(doc: { archivedAt: Date | null }): void {
  if (doc.archivedAt !== null) {
    throw new Error("Cannot modify an archived document");
  }
}

async function fetchAndAssertNotArchived(documentId: number): Promise<void> {
  const doc = await prisma.document.findUniqueOrThrow({
    where: { id: documentId },
    select: { archivedAt: true },
  });
  assertNotArchived(doc);
}

async function createVersion(documentId: number, content: Data) {
  return await prisma.version.create({
    data: {
      documentId,
      content: content as Prisma.InputJsonValue,
    },
  });
}

async function publishVersion(
  documentId: number,
  versionId: number
): Promise<void> {
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

async function createDocumentWithVersion(
  name: string,
  content: Data,
  publish: boolean = false,
  folderId?: number | null,
) {
  return await prisma.$transaction(async (tx) => {
    const document = await tx.document.create({
      data: { name, folderId: folderId ?? null },
    });

    const version = await tx.version.create({
      data: {
        documentId: document.id,
        content: content as Prisma.InputJsonValue,
      },
    });

    if (publish) {
      return await tx.document.update({
        where: { id: document.id },
        data: { publishedVersionId: version.id },
      });
    }

    return document;
  });
}

export async function createDocumentAction(
  input: CreateDocumentInput
): Promise<ActionResult<{ documentId: number }>> {
  return wrapAction(async () => {
    const name = validateName(input.name);
    const content = input.content ?? createEmptyPuckData();
    const document = await createDocumentWithVersion(name, content, false, input.folderId);
    return { documentId: document.id };
  });
}

export async function saveVersionAction(
  input: SaveVersionInput
): Promise<ActionResult<{ version: Version }>> {
  return wrapAction(async () => {
    await fetchAndAssertNotArchived(input.documentId);
    const result = await createVersion(input.documentId, input.content);
    return {
      version: {
        id: result.id,
        documentId: result.documentId,
        createdAt: result.createdAt,
      },
    };
  });
}

export async function publishVersionAction(
  input: PublishVersionInput
): Promise<ActionResult<void>> {
  return wrapAction(async () => {
    await fetchAndAssertNotArchived(input.documentId);
    await publishVersion(input.documentId, input.versionId);
  });
}

export async function archiveDocumentAction(
  input: ArchiveDocumentInput
): Promise<ActionResult<void>> {
  return wrapAction(async () => {
    await prisma.document.update({
      where: { id: input.id },
      data: { archivedAt: new Date() },
    });
  });
}

export async function unarchiveDocumentAction(
  input: ArchiveDocumentInput
): Promise<ActionResult<void>> {
  return wrapAction(async () => {
    await prisma.document.update({
      where: { id: input.id },
      data: { archivedAt: null },
    });
  });
}

export async function duplicateDocumentAction(
  input: DuplicateDocumentInput
): Promise<ActionResult<{ documentId: number }>> {
  return wrapAction(async () => {
    const name = validateName(input.name);
    const doc = await prisma.document.findUniqueOrThrow({
      where: { id: input.id },
      include: { publishedVersion: true },
    });
    assertNotArchived(doc);
    if (!doc.publishedVersion) {
      throw new Error("Document has no published version to duplicate");
    }
    const newDoc = await createDocumentWithVersion(
      name,
      doc.publishedVersion.content as Data,
      false
    );
    return { documentId: newDoc.id };
  });
}

export async function renameDocumentAction(
  input: RenameInput
): Promise<ActionResult<void>> {
  return wrapAction(async () => {
    await fetchAndAssertNotArchived(input.id);
    const name = validateName(input.name);
    await prisma.document.update({
      where: { id: input.id },
      data: { name },
    });
  });
}

export async function moveDocumentAction(
  input: MoveDocumentInput
): Promise<ActionResult<void>> {
  return wrapAction(async () => {
    await fetchAndAssertNotArchived(input.id);
    await prisma.document.update({
      where: { id: input.id },
      data: { folderId: input.folderId },
    });
  });
}
