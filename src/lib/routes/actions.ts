"use server";

import { prisma } from "../prisma";
import type {
  ActionResult,
  CreateRouteInput,
  DeleteRouteInput,
  UpdateRouteInput,
} from "../types";
import { wrapAction } from "../wrap-action";

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
  const isValidSegment = (segment: string) => ROUTE_SEGMENT_RE.test(segment);
  if (!segments.every(isValidSegment)) {
    throw new Error(
      "Each path segment may only contain lowercase letters, numbers, hyphens, and underscores"
    );
  }
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
