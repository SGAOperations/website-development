import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getDocumentById, getDocumentName } from "../../../../lib/documents/queries";
import { getEditorSlug, getEditorUrl } from "../../../../lib/editor-url";

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

/**
 * Creates the standard `generateMetadata` and default-export `Page` for a
 * document route, eliminating the repeated param-parsing boilerplate.
 */
export function createDocumentRoute(
  Component: React.ComponentType<{
    documentId: number;
    slug: string;
    versionId?: number;
  }>,
  metadataPrefix: string,
) {
  async function generateMetadata({
    params,
  }: {
    params: Promise<{ id: string }>;
  }): Promise<Metadata> {
    const documentId = parseDocumentId((await params).id);
    if (!documentId) return {};
    const name = await getDocumentName(documentId);
    return {
      title: name ? `${metadataPrefix}: ${name}` : "Document not found",
    };
  }

  async function Page({
    params,
  }: {
    params: Promise<{ id: string; slug: string; versionId?: string }>;
  }) {
    const { id, slug, versionId: versionIdParam } = await params;

    const documentId = parseDocumentId(id);
    if (!documentId) notFound();

    const versionId = versionIdParam
      ? parseVersionId(versionIdParam) || notFound()
      : undefined;

    return <Component documentId={documentId} slug={slug} versionId={versionId} />;
  }

  return { generateMetadata, Page };
}
