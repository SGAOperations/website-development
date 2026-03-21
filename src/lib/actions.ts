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
  RenameInput,
  SaveVersionInput,
  PublishVersionInput,
  UpdateRouteInput,
  Version,
} from "./types";
import { wrapAction } from "./wrap-action";

function assertValidRoutePath(path: string): void {
  if (!path.startsWith("/")) {
    throw new Error("Path must start with /");
  }
}

export async function createDocumentAction(
  input: CreateDocumentInput
): Promise<ActionResult<{ documentId: number }>> {
  return wrapAction(async () => {
    const content = input.content || { content: [], root: {} };
    const document = await createDocumentWithVersion(input.name, content, false);
    return { documentId: document.id };
  });
}

export async function saveVersionAction(
  input: SaveVersionInput
): Promise<ActionResult<{ version: Version }>> {
  return wrapAction(async () => {
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
    await publishVersionUtil(input.documentId, input.versionId);
  });
}

async function renameRecord(
  model: "document" | "media",
  input: RenameInput
): Promise<ActionResult<void>> {
  return wrapAction(async () => {
    const name = input.name.trim();
    if (!name) {
      throw new Error("Name cannot be empty");
    }
    await (prisma[model] as typeof prisma.document).update({
      where: { id: input.id },
      data: { name },
    });
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

export async function renameDocumentAction(
  input: RenameInput
): Promise<ActionResult<void>> {
  return renameRecord("document", input);
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
  return renameRecord("media", input);
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
