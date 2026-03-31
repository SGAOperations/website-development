import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  parseDocumentId,
  parseVersionId,
} from "../../../../lib/documents/editor-route";
import { getDocumentName } from "../../../../lib/documents/queries";

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
