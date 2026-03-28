import "@puckeditor/core/puck.css";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { Client } from "./client";
import { getDocumentById, getVersionContent } from "../../../../lib/documents/queries";
import { getEditorSlug, getEditorUrl } from "../../../../lib/editor-url";
import { createEmptyPuckData } from "../../../../lib/puck/utils";

export default async function EditorPage({
  documentId,
  slug,
  versionId,
}: {
  documentId: number;
  slug: string;
  versionId?: number;
}) {
  const document = await getDocumentById(documentId);

  if (!document) {
    notFound();
  }

  const expectedSlug = getEditorSlug(document.name);
  if (slug !== expectedSlug) {
    redirect(getEditorUrl(documentId, document.name, versionId));
  }

  const targetVersionId =
    versionId !== undefined && !isNaN(versionId)
      ? document.versions.find((v) => v.id === versionId)?.id
      : document.versions[0]?.id;

  const data = targetVersionId
    ? (await getVersionContent(targetVersionId)) ?? createEmptyPuckData()
    : createEmptyPuckData();

  const versions = document.versions.map((v) => ({
    id: v.id,
    documentId: v.documentId,
    createdAt: v.createdAt,
  }));

  return (
    <Client
      key={`${documentId}-${targetVersionId || "no-version"}`}
      documentId={documentId}
      documentName={document.name}
      data={data}
      versionId={targetVersionId}
      publishedVersionId={document.publishedVersionId || undefined}
      versions={versions}
      isArchived={document.archivedAt !== null}
    />
  );
}
