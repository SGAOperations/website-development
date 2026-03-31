"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";
import type {
  ActionResult,
  CreateRouteInput,
  DeleteRouteInput,
  UpdateRouteInput,
} from "../types";
import { wrapAction } from "../utils";
import { assertValidRoutePath } from "./utils";

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
    revalidatePath(input.path);
    return { routeId: route.id };
  });
}

export async function updateRouteAction(
  input: UpdateRouteInput
): Promise<ActionResult<void>> {
  return wrapAction(async () => {
    const oldRoute = await prisma.route.findUniqueOrThrow({
      where: { id: input.id },
      select: { path: true },
    });
    assertValidRoutePath(input.path);
    await prisma.route.update({
      where: { id: input.id },
      data: {
        path: input.path,
        documentId: input.documentId,
      },
    });
    revalidatePath(oldRoute.path);
    revalidatePath(input.path);
  });
}

export async function deleteRouteAction(
  input: DeleteRouteInput
): Promise<ActionResult<void>> {
  return wrapAction(async () => {
    const route = await prisma.route.findUniqueOrThrow({
      where: { id: input.id },
      select: { path: true },
    });
    await prisma.route.delete({
      where: { id: input.id },
    });
    revalidatePath(route.path);
  });
}
