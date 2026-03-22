"use server";

import { prisma } from "../prisma";
import { supabase, MEDIA_BUCKET, getMediaUrl } from "../supabase";
import { validateName } from "../utils";
import type { Media } from "../../generated/prisma/client";
import type {
  ActionResult,
  DeleteMediaInput,
  RenameInput,
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
