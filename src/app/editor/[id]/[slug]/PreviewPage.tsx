import { notFound } from "next/navigation";
import { Client } from "../../../[...puckPath]/client";
import { loadDocument } from "../../../../lib/documents/editor-route";
import { getVersionContent } from "../../../../lib/documents/queries";
import { resolvePreviewVersionId } from "../../../../lib/documents/version-selection";
import { getMediaFilesByIds } from "../../../../lib/media/queries";
import { collectMediaIds } from "../../../../lib/puck/media";

export default async function PreviewPage({
  documentId,
  slug,
  versionId,
}: {
  documentId: number;
  slug: string;
  versionId?: number;
}) {
  const document = await loadDocument(documentId, slug, {
    versionId,
    redirectSuffix: "/preview",
  });

  const targetVersionId = resolvePreviewVersionId({
    versions: document.versions,
    publishedVersionId: document.publishedVersionId,
    requestedVersionId: versionId,
  });

  if (!targetVersionId) notFound();

  const data = await getVersionContent(targetVersionId);
  if (!data) notFound();

  const media = await getMediaFilesByIds(collectMediaIds(data));

  return <Client data={data} media={media} />;
}
