import type { Metadata } from "next";
import { getDocumentName } from "../../../../lib/documents/queries";

export function parseDocumentId(id: string): number | null {
  const parsed = parseInt(id, 10);
  return isNaN(parsed) ? null : parsed;
}

export function parseVersionId(versionId: string): number | null {
  const parsed = parseInt(versionId, 10);
  return isNaN(parsed) ? null : parsed;
}

export async function generateDocumentMetadata(
  id: string,
  prefix: string,
): Promise<Metadata> {
  const name = await getDocumentName(parseInt(id, 10));
  return {
    title: name ? `${prefix}: ${name}` : "Document not found",
  };
}
