import { Data } from "@puckeditor/core";
import { prisma } from "../prisma";
import { getMediaUrl } from "../supabase";
import { collectMediaIds, resolveMediaUrls } from "../puck/resolve-media-urls";

async function getDocumentMediaUrlMap(
  data: Data
): Promise<ReadonlyMap<number, string>> {
  const mediaIds = collectMediaIds(data);

  if (mediaIds.length === 0) {
    return new Map();
  }

  const mediaRecords = await prisma.media.findMany({
    where: { id: { in: mediaIds } },
    select: { id: true, storagePath: true },
  });

  const urlMap = new Map<number, string>();
  for (const record of mediaRecords) {
    urlMap.set(record.id, getMediaUrl(record.storagePath));
  }

  return urlMap;
}

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

  const data = route.document.publishedVersion.content as Data;
  return resolveMediaUrls(data, await getDocumentMediaUrlMap(data));
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
  const data = version.content as Data;
  return resolveMediaUrls(data, await getDocumentMediaUrlMap(data));
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
