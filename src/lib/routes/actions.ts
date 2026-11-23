"use server";

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
