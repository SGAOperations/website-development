"use server";

import { prisma } from "../prisma";
import { supabase, MEDIA_BUCKET, getMediaUrl } from "../supabase";
import { validateName } from "../utils";
import type { Media } from "../../generated/prisma/client";
import { wrapAction } from "../utils";
import type {
  ActionResult,
  DeleteMediaInput,
  RenameMediaInput,
} from "../types";
import { splitStoragePath, normalizeFileName, validateFileName } from "../media-path";
import { wrapAction } from "../utils";

const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB

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

    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds 1GB limit. File size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
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


/**
 * Renames a media item's display name, its stored file name, or both.
 *
 * Steps:
 *  1. Load the real record. The database is trusted, not the client.
 *  2. Display name: validated if provided, otherwise unchanged.
 *  3. File name (if provided and different): normalize, validate, rebuild the
 *     path as `folder + newBase + ext` (ext comes from the stored path), reject
 *     collisions, then move the object in Supabase Storage.
 *  4. Update the database row. If this fails after the file moved, the file is
 *     moved back so storage and database never disagree.
 *
 * Returns the updated record with a fresh `url`, so the client can refresh
 * `storagePath` and `url` without reloading.
 *
 * Errors (thrown, surfaced by `wrapAction`): invalid name, name already in use,
 * or a storage failure.
 *
 * Collisions are checked on the FULL path, so `photo.png` and `photo.webp`
 * can coexist. `storagePath` being `@unique` is the backstop for races.
 *
 * Note: old URLs stop working after a file rename (no redirect). Puck pages
 * are handled by `refreshMediaUrls`.
 */
export async function renameMediaAction(
  input: RenameMediaInput
): Promise<ActionResult<Media & { url: string }>> {
  return wrapAction(async () => {
    // 1. Load the real record. We trust the database, not the client.
    const media = await prisma.media.findUniqueOrThrow({ where: { id: input.id } });

    // 2. Display name: validate if provided, otherwise keep the current one.
    const name = input.name !== undefined ? validateName(input.name) : media.name;

    // 3. File name: figure out the new storage path, if it changed.
    let storagePath = media.storagePath;
    let moved = false;

    if (input.fileName !== undefined) {
      const { folder, base, ext } = splitStoragePath(media.storagePath);
      const newBase = normalizeFileName(input.fileName);

      const problem = validateFileName(newBase);
      if (problem) throw new Error(problem);

      if (newBase !== base) {
        // The extension comes from the stored record, never from the client.
        const newPath = `${folder ? `${folder}/` : ""}${newBase}${ext}`;

        // Friendly collision check (the unique constraint is the backstop).
        const existing = await prisma.media.findUnique({ where: { storagePath: newPath } });
        if (existing) throw new Error(`A file named "${newBase}${ext}" already exists.`);

        const { error } = await supabase.storage
          .from(MEDIA_BUCKET)
          .move(media.storagePath, newPath);
        if (error) throw new Error(error.message);

        storagePath = newPath;
        moved = true;
      }
    }

    // 4. Save to the database. If this fails after the file moved, move it back.
    try {
      const updated = await prisma.media.update({
        where: { id: input.id },
        data: { name, storagePath },
      });
      return { ...updated, url: getMediaUrl(updated.storagePath) };
    } catch (err) {
      if (moved) {
        await supabase.storage.from(MEDIA_BUCKET).move(storagePath, media.storagePath);
      }
      throw err;
    }
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
