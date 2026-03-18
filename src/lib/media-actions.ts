"use server";

import { supabase, MEDIA_BUCKET } from "./supabase";
import { wrapAction } from "./wrap-action";
import type { ActionResult, DeleteMediaInput, MediaFile } from "./types";

export async function uploadMediaAction(
  formData: FormData
): Promise<ActionResult<MediaFile>> {
  return wrapAction(async () => {
    const file = formData.get("file");

    if (!(file instanceof File)) {
      throw new Error("No file provided");
    }

    if (file.size === 0) {
      throw new Error("File is empty");
    }

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(fileName, file, { contentType: file.type });

    if (error) {
      throw new Error(error.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(fileName);

    return {
      name: fileName,
      size: file.size,
      contentType: file.type,
      createdAt: new Date().toISOString(),
      url: publicUrl,
    };
  });
}

export async function deleteMediaAction(
  input: DeleteMediaInput
): Promise<ActionResult<void>> {
  return wrapAction(async () => {
    const { error } = await supabase.storage
      .from(MEDIA_BUCKET)
      .remove([input.name]);

    if (error) {
      throw new Error(error.message);
    }
  });
}
