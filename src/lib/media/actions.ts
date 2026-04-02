"use server";

import { prisma } from "../prisma";
import { supabase, MEDIA_BUCKET, getMediaUrl } from "../supabase";
import { validateName } from "../utils";
import {
  getMediaStoragePath,
  getUploadMediaDetails,
  normalizeRequestedFileStem,
} from "./utils";
import type { Media } from "../../generated/prisma/client";
import type {
  ActionResult,
  DeleteMediaInput,
  RenameMediaInput,
} from "../types";
import { wrapAction } from "../utils";

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

    const { displayName, fileStem, fileExtension } = getUploadMediaDetails(file.name);
    const media = await prisma.media.create({
      data: {
        name: displayName,
        fileStem,
        fileExtension,
        storagePath: `pending/${crypto.randomUUID()}`,
        size: file.size,
        contentType: file.type || null,
      },
    });
    const storagePath = getMediaStoragePath(media.id, media.fileStem, media.fileExtension);

    const { error } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(storagePath, file, { contentType: file.type });

    if (error) {
      await prisma.media.delete({ where: { id: media.id } });
      throw new Error(error.message);
    }

    const updatedMedia = await prisma.media.update({
      where: { id: media.id },
      data: {
        storagePath,
      },
    });

    return { ...updatedMedia, url: getMediaUrl(updatedMedia.storagePath) };
  });
}

export async function renameMediaAction(
  input: RenameMediaInput
): Promise<ActionResult<Media & { url: string }>> {
  return wrapAction(async () => {
    const name = validateName(input.name);
    const media = await prisma.media.findUniqueOrThrow({
      where: { id: input.id },
    });

    let nextFileStem = media.fileStem;
    let nextStoragePath = media.storagePath;

    if (input.fileName.trim() !== media.fileStem) {
      nextFileStem = normalizeRequestedFileStem(input.fileName, media.fileExtension);
      nextStoragePath = getMediaStoragePath(media.id, nextFileStem, media.fileExtension);

      if (nextStoragePath !== media.storagePath) {
        const { error } = await supabase.storage
          .from(MEDIA_BUCKET)
          .move(media.storagePath, nextStoragePath);

        if (error) {
          throw new Error(error.message);
        }
      }
    }

    const updatedMedia = await prisma.media.update({
      where: { id: input.id },
      data: {
        name,
        fileStem: nextFileStem,
        storagePath: nextStoragePath,
      },
    });

    return { ...updatedMedia, url: getMediaUrl(updatedMedia.storagePath) };
  });
}

export async function deleteMediaAction(
  input: DeleteMediaInput
): Promise<ActionResult<void>> {
  return wrapAction(async () => {
    const media = await prisma.media.findUniqueOrThrow({
      where: { id: input.id },
      select: { storagePath: true },
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
