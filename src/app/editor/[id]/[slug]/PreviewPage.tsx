import { notFound } from "next/navigation";
import { PuckRender } from "@/components/puck/render";
import { loadDocument } from "../../../../lib/documents/editor-route";
import { getVersionContent } from "../../../../lib/documents/queries";
import { resolvePreviewVersionId } from "../../../../lib/documents/version-selection";

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

  return <PuckRender data={data} />;
}
