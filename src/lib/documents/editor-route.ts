import { notFound, redirect } from "next/navigation";
import { getEditorSlug, getEditorUrl } from "../editor-url";
import { getDocumentById } from "./queries";

export function parseDocumentId(id: string): number | null {
  const parsed = parseInt(id, 10);
  return isNaN(parsed) ? null : parsed;
}

export function parseVersionId(versionId: string): number | null {
  const parsed = parseInt(versionId, 10);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Fetches a document by ID and validates the URL slug, redirecting if it
 * doesn't match. Calls `notFound()` when the document doesn't exist.
 */
export async function loadDocument(
  documentId: number,
  slug: string,
  options?: { versionId?: number; redirectSuffix?: string },
) {
  const document = await getDocumentById(documentId);
  if (!document) notFound();

  const expectedSlug = getEditorSlug(document.name);
  if (slug !== expectedSlug) {
    const base = getEditorUrl(documentId, document.name, options?.versionId);
    redirect(`${base}${options?.redirectSuffix ?? ""}`);
  }

  return document;
}
