"use server";

import {
  createDocumentWithVersion,
  createVersion,
  publishVersion as publishVersionUtil,
} from "./version-utils";
import { prisma } from "./prisma";
import { supabase, MEDIA_BUCKET, getMediaUrl } from "./supabase";
import type { Media } from "../generated/prisma/client";
import type {
  ActionResult,
  ArchiveDocumentInput,
  CreateDocumentInput,
  CreateRouteInput,
  DeleteMediaInput,
  DeleteRouteInput,
  DuplicateDocumentInput,
  RenameInput,
  SaveVersionInput,
  PublishVersionInput,
  UpdateRouteInput,
  Version,
} from "./types";
import { wrapAction } from "./wrap-action";

function validateName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("Name cannot be empty");
  }
  return trimmed;
}

const ROUTE_SEGMENT_RE = /^[a-z0-9_-]+$/;

function assertValidRoutePath(path: string): void {
  if (path.trim() !== path) {
    throw new Error("Path cannot have leading or trailing whitespace");
  }

  if (path.length === 0) {
    throw new Error("Path cannot be empty");
  }

  if (!path.startsWith("/")) {
    throw new Error("Path must start with /");
  }

  if (path === "/") {
    return;
  }

  if (path.endsWith("/")) {
    throw new Error("Path must not end with / (except root /)");
  }

  if (path.includes("//")) {
    throw new Error("Path must not contain consecutive slashes");
  }

  if (path !== path.toLowerCase()) {
    throw new Error("Path must be lowercase");
  }

  const segments = path.split("/").slice(1);
  const isValidSegement = (segment: string) => ROUTE_SEGMENT_RE.test(segment);
  if (!segments.every(isValidSegement)) {
    throw new Error(
      "Each path segment may only contain lowercase letters, numbers, hyphens, and underscores"
    );
  }
}

export async function createDocumentAction(
  input: CreateDocumentInput
): Promise<ActionResult<{ documentId: number }>> {
  return wrapAction(async () => {
    const name = validateName(input.name);
    const content = input.content || { content: [], root: {} };
    const document = await createDocumentWithVersion(name, content, false);
    return { documentId: document.id };
  });
}

async function assertNotArchived(documentId: number): Promise<void> {
  const doc = await prisma.document.findUniqueOrThrow({
    where: { id: documentId },
    select: { archivedAt: true },
  });
  if (doc.archivedAt !== null) {
    throw new Error("Cannot modify an archived document");
  }
}

export async function saveVersionAction(
  input: SaveVersionInput
): Promise<ActionResult<{ version: Version }>> {
  return wrapAction(async () => {
    await assertNotArchived(input.documentId);
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
    await assertNotArchived(input.documentId);
    await publishVersionUtil(input.documentId, input.versionId);
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
    await assertNotArchived(input.id);
    const name = validateName(input.name);
    const doc = await prisma.document.findUniqueOrThrow({
      where: { id: input.id },
      include: { publishedVersion: true },
    });
    if (!doc.publishedVersion) {
      throw new Error("Document has no published version to duplicate");
    }
    const newDoc = await createDocumentWithVersion(
      name,
      doc.publishedVersion.content as any,
      false
    );
    return { documentId: newDoc.id };
  });
}

export async function renameDocumentAction(
  input: RenameInput
): Promise<ActionResult<void>> {
  return wrapAction(async () => {
    await assertNotArchived(input.id);
    const name = validateName(input.name);
    await prisma.document.update({
      where: { id: input.id },
      data: { name },
    });
  });
}

export async function createRouteAction(
  input: CreateRouteInput
): Promise<ActionResult<{ routeId: number }>> {
  return wrapAction(async () => {
    assertValidRoutePath(input.path);
    const route = await prisma.route.create({
      data: {
        path: input.path,
        documentId: input.documentId,
      },
    });
    return { routeId: route.id };
  });
}

export async function updateRouteAction(
  input: UpdateRouteInput
): Promise<ActionResult<void>> {
  return wrapAction(async () => {
    assertValidRoutePath(input.path);
    await prisma.route.update({
      where: { id: input.id },
      data: {
        path: input.path,
        documentId: input.documentId,
      },
    });
  });
}

export async function deleteRouteAction(
  input: DeleteRouteInput
): Promise<ActionResult<void>> {
  return wrapAction(async () => {
    await prisma.route.delete({
      where: { id: input.id },
    });
  });
}

export async function uploadMediaAction(
  formData: FormData
): Promise<ActionResult<Media & { url: string }>> {
  return wrapAction(async () => {
    const file = formData.get("file");

    if (!(file instanceof File)) {
      throw new Error("No file provided");
    }

    if (file.size === 0) {
      throw new Error("File is empty");
    }

    const ext = file.name.includes(".") ? `.${file.name.split(".").pop()}` : "";
    const storagePath = `${crypto.randomUUID()}${ext}`;

    const { error } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(storagePath, file, { contentType: file.type });

    if (error) {
      throw new Error(error.message);
    }

    const media = await prisma.media.create({
      data: {
        name: file.name,
        storagePath,
        size: file.size,
        contentType: file.type || null,
      },
    });

    return { ...media, url: getMediaUrl(media.storagePath) };
  });
}

export async function renameMediaAction(
  input: RenameInput
): Promise<ActionResult<void>> {
  return wrapAction(async () => {
    const name = validateName(input.name);
    await prisma.media.update({
      where: { id: input.id },
      data: { name },
    });
  });
}

export async function deleteMediaAction(
  input: DeleteMediaInput
): Promise<ActionResult<void>> {
  return wrapAction(async () => {
    const media = await prisma.media.findUniqueOrThrow({
      where: { id: input.id },
    });

    const { error } = await supabase.storage
      .from(MEDIA_BUCKET)
      .remove([media.storagePath]);

    if (error) {
      throw new Error(error.message);
    }

    await prisma.media.delete({ where: { id: input.id } });
  });
}
