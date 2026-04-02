import { Data } from "@puckeditor/core";
import { prisma } from "../prisma";
import { resolveMediaUrls } from "../puck/resolve-media-urls";

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

  return resolveMediaUrls(route.document.publishedVersion.content as Data);
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
  if (!version) return null;
  return resolveMediaUrls(version.content as Data);
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
