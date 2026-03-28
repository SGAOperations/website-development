import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { Client } from "../../../[...puckPath]/client";
import {
  getDocumentPreviewMeta,
  getVersionContent,
} from "../../../../lib/documents/queries";
import { getEditorSlug, getEditorUrl } from "../../../../lib/editor-url";

export default async function PreviewPage({
  documentId,
  slug,
  versionId,
}: {
  documentId: number;
  slug: string;
  versionId?: number;
}) {
  const document = await getDocumentPreviewMeta(documentId);

  if (!document) {
    notFound();
  }

  const expectedSlug = getEditorSlug(document.name);
  if (slug !== expectedSlug) {
    redirect(`${getEditorUrl(documentId, document.name, versionId)}/preview`);
  }

  const targetVersionId =
    versionId ?? document.publishedVersionId ?? document.versions[0]?.id;

  if (!targetVersionId) {
    notFound();
  }

  const data = await getVersionContent(targetVersionId);

  if (!data) {
    notFound();
  }

  return <Client data={data} />;
}
