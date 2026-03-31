import { prisma } from "../prisma";
import { getMediaUrl } from "../supabase";

export async function getMediaFiles() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  return media.map((m) => ({
    ...m,
    url: getMediaUrl(m.storagePath),
  }));
}

