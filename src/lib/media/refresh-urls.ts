import "server-only";

import { prisma } from "../prisma";
import { getMediaUrl } from "../supabase";

type MediaRef = { mediaId: number; url: string };

function isMediaRef(value: unknown): value is MediaRef {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as MediaRef).mediaId === "number" &&
    "url" in value
  );
}

/** Walks any JSON and collects every mediaId it finds. */
function collectMediaIds(value: unknown, ids: Set<number>) {
  if (Array.isArray(value)) {
    value.forEach((v) => collectMediaIds(v, ids));
  } else if (typeof value === "object" && value !== null) {
    if (isMediaRef(value)) ids.add(value.mediaId);
    Object.values(value).forEach((v) => collectMediaIds(v, ids));
  }
}

/** Returns a copy of the JSON with each media url replaced by the fresh one. */
function replaceUrls(value: unknown, urls: Map<number, string>): unknown {
  if (Array.isArray(value)) return value.map((v) => replaceUrls(v, urls));
  if (typeof value === "object" && value !== null) {
    const copy = Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, replaceUrls(v, urls)])
    );
    if (isMediaRef(copy)) {
      const fresh = urls.get(copy.mediaId);
      if (fresh) copy.url = fresh;
    }
    return copy;
  }
  return value;
}

/**
 * Saved Puck pages store `{ mediaId, url }` for images, but the url goes
 * stale when a file is renamed. The mediaId never changes, so we look up
 * each media row and rebuild the url from its current storagePath.
 *
 * If a media row no longer exists (deleted), the saved url is left as is.
 * 
 *  * Applied before rendering in `PuckRender` (public pages and preview) and in
 * the editor page, so renamed files don't break saved pages. The saved JSON
 * keeps the old url until the page is next saved. That is harmless because the
 * url is rebuilt on every load.
 */
export async function refreshMediaUrls<T>(data: T): Promise<T> {
  const ids = new Set<number>();
  collectMediaIds(data, ids);
  if (ids.size === 0) return data;

  const rows = await prisma.media.findMany({
    where: { id: { in: [...ids] } },
    select: { id: true, storagePath: true },
  });
  const urls = new Map(rows.map((r) => [r.id, getMediaUrl(r.storagePath)]));

  return replaceUrls(data, urls) as T;
}