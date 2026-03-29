import "@puckeditor/core/puck.css";
import { notFound } from "next/navigation";
import { Client } from "./client";
import { getVersionContent } from "../../../../lib/documents/queries";
import { createEmptyPuckData } from "../../../../lib/puck/utils";
import { resolveEditorVersionId } from "./version-selection";
import { loadDocument } from "./params";

export default async function EditorPage({
  documentId,
  slug,
  versionId,
}: {
  documentId: number;
  slug: string;
  versionId?: number;
}) {
  const document = await loadDocument(documentId, slug, { versionId });

  const targetVersionId = resolveEditorVersionId(document.versions, versionId);

  if (versionId !== undefined && targetVersionId === undefined) {
    notFound();
  }

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
