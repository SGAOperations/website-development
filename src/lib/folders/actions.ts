"use server";

import { prisma } from "../prisma";
import { validateName } from "../utils";
import { wrapAction } from "../utils";
import type {
  ActionResult,
  CreateFolderInput,
  RenameFolderInput,
  MoveFolderInput,
  DeleteFolderInput,
} from "../types";

export async function createFolderAction(
  input: CreateFolderInput
): Promise<ActionResult<{ folderId: number }>> {
  return wrapAction(async () => {
    const name = validateName(input.name);
    const folder = await prisma.folder.create({
      data: {
        name,
        parentId: input.parentId ?? null,
      },
    });
    return { folderId: folder.id };
  });
}

export async function renameFolderAction(
  input: RenameFolderInput
): Promise<ActionResult<void>> {
  return wrapAction(async () => {
    const name = validateName(input.name);
    await prisma.folder.update({
      where: { id: input.id },
      data: { name },
    });
  });
}

export async function moveFolderAction(
  input: MoveFolderInput
): Promise<ActionResult<void>> {
  return wrapAction(async () => {
    if (input.parentId === input.id) {
      throw new Error("A folder cannot be moved into itself");
    }

    if (input.parentId !== null) {
      const isDescendant = await checkIsDescendant(input.parentId, input.id);
      if (isDescendant) {
        throw new Error("A folder cannot be moved into one of its descendants");
      }
    }

    await prisma.folder.update({
      where: { id: input.id },
      data: { parentId: input.parentId },
    });
  });
}

export async function deleteFolderAction(
  input: DeleteFolderInput
): Promise<ActionResult<void>> {
  return wrapAction(async () => {
    const folder = await prisma.folder.findUniqueOrThrow({
      where: { id: input.id },
      select: { parentId: true },
    });

    // Move all contents to the parent folder (or root)
    await prisma.$transaction([
      prisma.document.updateMany({
        where: { folderId: input.id },
        data: { folderId: folder.parentId },
      }),
      prisma.media.updateMany({
        where: { folderId: input.id },
        data: { folderId: folder.parentId },
      }),
      prisma.folder.updateMany({
        where: { parentId: input.id },
        data: { parentId: folder.parentId },
      }),
      prisma.folder.delete({
        where: { id: input.id },
      }),
    ]);
  });
}

async function checkIsDescendant(
  candidateId: number,
  ancestorId: number
): Promise<boolean> {
  let currentId: number | null = candidateId;
  while (currentId !== null) {
    if (currentId === ancestorId) return true;
    const result: { parentId: number | null } | null =
      await prisma.folder.findUnique({
        where: { id: currentId },
        select: { parentId: true },
      });
    currentId = result?.parentId ?? null;
  }
  return false;
}
