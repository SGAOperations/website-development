import { Data } from "@puckeditor/core";
import { prisma } from "../prisma";

export const getDocumentById = async (id: number) => {
  return await prisma.document.findUnique({
    where: { id },
    include: {
      versions: {
        orderBy: { createdAt: "desc" },
        select: { id: true, documentId: true, createdAt: true },
      },
    },
  });
};

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

  return route.document.publishedVersion.content as Data;
};

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

export const getDocumentName = async (id: number) => {
  const doc = await prisma.document.findUnique({
    where: { id },
    select: { name: true },
  });
  return doc?.name;
};

export const getVersionContent = async (versionId: number) => {
  const version = await prisma.version.findUnique({
    where: { id: versionId },
    select: { content: true },
  });
  return version?.content as Data | null;
};

export async function getDocumentSummaries() {
  return await prisma.document.findMany({
    include: {
      versions: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { createdAt: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
