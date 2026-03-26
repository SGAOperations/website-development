import "@puckeditor/core/puck.css";
import type { Data } from "@puckeditor/core";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { Client } from "./client";
import { getDocumentById } from "../../../../lib/documents/queries";
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

  const resolved = resolveVersion(versionId, document.versions);

  const versions = document.versions.map((v) => ({
    id: v.id,
    documentId: v.documentId,
    createdAt: v.createdAt,
  }));

  return (
    <Client
      key={`${documentId}-${resolved.versionId || "no-version"}`}
      documentId={documentId}
      documentName={document.name}
      data={resolved.data}
      versionId={resolved.versionId}
      publishedVersionId={document.publishedVersionId || undefined}
      versions={versions}
      isArchived={document.archivedAt !== null}
    />
  );
}

function resolveVersion(
  versionId: number | undefined,
  versions: { id: number; documentId: number; content: unknown }[],
): { data: Data; versionId?: number } {
  if (versionId !== undefined && !isNaN(versionId)) {
    const match = versions.find((v) => v.id === versionId);
    if (match) {
      return { data: match.content as Data, versionId: match.id };
    }
  }

  if (versions.length > 0) {
    return { data: versions[0].content as Data, versionId: versions[0].id };
  }

  return { data: createEmptyPuckData() };
}
