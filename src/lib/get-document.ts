import { Data } from "@puckeditor/core";
import { prisma } from "./prisma";

/**
 * Get document by ID with published version and all versions
 */
export const getDocumentById = async (id: number) => {
  return await prisma.document.findUnique({
    where: { id },
    include: {
      publishedVersion: true,
      versions: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
};

/**
 * Get document content by route path (used by public renderer)
 */
export const getDocumentByPath = async (path: string): Promise<Data | null> => {
  const route = await prisma.route.findUnique({
    where: { path },
    include: {
      document: {
        include: { publishedVersion: true },
      },
    },
  });

  if (!route || !route.document.publishedVersion) {
    return null;
  }

  return (route.document.publishedVersion.content as Data) ?? null;
};

/**
 * Get all routes with published content, keyed by path
 */
export const getAllRoutes = async (): Promise<Record<string, Data> | null> => {
  const routes = await prisma.route.findMany({
    include: {
      document: {
        include: { publishedVersion: true },
      },
    },
  });

  if (routes.length === 0) {
    return null;
  }

  return routes.reduce((acc, route) => {
    if (route.document.publishedVersion) {
      acc[route.path] = route.document.publishedVersion.content as Data;
    }
    return acc;
  }, {} as Record<string, Data>);
};

/**
 * Get all versions for a document
 */
export const getVersions = async (documentId: number) => {
  return await prisma.version.findMany({
    where: { documentId },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Get a specific version by ID
 */
export const getVersionById = async (versionId: number) => {
  return await prisma.version.findUnique({
    where: { id: versionId },
    include: { document: true },
  });
};
