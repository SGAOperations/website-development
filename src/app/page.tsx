import { Client } from "./[...puckPath]/client";
import { notFound } from "next/navigation";
import { getDocumentByPath } from "../lib/documents/queries";
import { getMediaFilesByIds } from "../lib/media/queries";
import { collectMediaIds } from "../lib/puck/media";

export default async function Page() {
  const path = "/";
  const data = await getDocumentByPath(path);

  if (!data) {
    return notFound();
  }

  const media = await getMediaFilesByIds(collectMediaIds(data));

  return <Client data={data} media={media} />;
}

export const dynamic = "force-static";
