import { prisma } from "../prisma";
import { getMediaUrl } from "../supabase";

export async function getMediaFiles() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  return media.map((m) => ({
    ...m,
    url: getMediaUrl(m.storagePath),
  }));
}

export async function getMediaFilesByIds(ids: Iterable<number>) {
  const mediaIds = [...new Set(ids)];

  if (mediaIds.length === 0) {
    return [];
  }

  const media = await prisma.media.findMany({
    where: { id: { in: mediaIds } },
  });

  return media.map((item) => ({
    ...item,
    url: getMediaUrl(item.storagePath),
  }));
}
