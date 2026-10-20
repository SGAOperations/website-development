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
  RenameInput,
  RenameVersionInput,
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

// TODO: replace with real values once users and versions exist
const STUB_VERSION_AUTHOR = "SGA Webmaster";
const STUB_VERSION_NAME = "Version Name";

async function createVersion(
  documentId: number,
  content: Data,
  name: string = STUB_VERSION_NAME
) {
  return await prisma.version.create({
    data: {
      documentId,
      name,
      author: STUB_VERSION_AUTHOR,
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
  publish: boolean = false
) {
  return await prisma.$transaction(async (tx) => {
    const document = await tx.document.create({
      data: { name },
    });

    const version = await tx.version.create({
      data: {
        documentId: document.id,
        name: STUB_VERSION_NAME,
        author: STUB_VERSION_AUTHOR,
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
    const document = await createDocumentWithVersion(name, content, false);
    return { documentId: document.id };
  });
}

export async function saveVersionAction(
  input: SaveVersionInput
): Promise<ActionResult<{ version: Version }>> {
  return wrapAction(async () => {
    await fetchAndAssertNotArchived(input.documentId);
    const result = await createVersion(
      input.documentId,
      input.content,
      input.name === undefined ? undefined : validateName(input.name)
    );
    return {
      version: {
        id: result.id,
        documentId: result.documentId,
        name: result.name,
        author: result.author,
        createdAt: result.createdAt,
      },
    };
  });
}

export async function renameVersionAction(
  input: RenameVersionInput
): Promise<ActionResult<void>> {
  return wrapAction(async () => {
    await fetchAndAssertNotArchived(input.documentId);
    const name = validateName(input.name);
    const { count } = await prisma.version.updateMany({
      where: { id: input.versionId, documentId: input.documentId },
      data: { name },
    });
    if (count === 0) {
      throw new Error(
        "Error locating version to rename"
      );
    }
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
