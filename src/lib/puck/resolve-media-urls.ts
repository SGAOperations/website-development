import "server-only";

import type { Data } from "@puckeditor/core";
import { transformProps } from "@puckeditor/core/rsc";
import { prisma } from "../prisma";
import { getMediaUrl } from "../supabase";
import config from "@/puck.config";

type ImageProp = { mediaId: number; url: string } | null;

export async function resolveMediaUrls(data: Data): Promise<Data> {
  const mediaIds = new Set<number>();

  // Collect media IDs
  transformProps(
    data,
    {
      Image: (props: { image?: ImageProp }) => {
        if (props.image?.mediaId) {
          mediaIds.add(props.image.mediaId);
        }
        return props;
      },
    },
    config
  );

  if (mediaIds.size === 0) {
    return data;
  }

  // Fetch media records in a single query
  const mediaRecords = await prisma.media.findMany({
    where: { id: { in: [...mediaIds] } },
    select: { id: true, storagePath: true },
  });

  const urlMap = new Map<number, string>();
  for (const record of mediaRecords) {
    urlMap.set(record.id, getMediaUrl(record.storagePath));
  }

  // Update media URLs
  return transformProps(
    data,
    {
      Image: (props: { image?: ImageProp }) => {
        if (!props.image?.mediaId) {
          return props;
        }
        const url = urlMap.get(props.image.mediaId);
        if (!url) {
          return { ...props, image: null };
        }
        return { ...props, image: { ...props.image, url } };
      },
    },
    config
  );
}
