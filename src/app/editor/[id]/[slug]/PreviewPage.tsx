import { notFound } from "next/navigation";
import { getVersionContent } from "../../../../lib/documents/queries";
import { resolvePreviewVersionId } from "./version-selection";
import { loadDocument } from "./params";
import { Render } from "@puckeditor/core";
import { config } from "@/puck.config";

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

  return <Render config={config} data={data} />;
}
