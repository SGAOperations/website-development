export function getEditorSlug(name: string | null): string {
  if (!name) return "untitled";

  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Strip diacritics
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/-+/g, "-") // Collapse multiple hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

  return slug.length > 0 ? slug : "untitled";
}

/**
 * Builds an editor URL path.
 *
 * @example
 * getEditorUrl(4, "Hello World")       // "/editor/4/hello-world"
 * getEditorUrl(4, "Hello World", 23)   // "/editor/4/hello-world/23"
 * getEditorUrl(4, null)                // "/editor/4/untitled"
 */
export function getEditorUrl(
  documentId: number,
  documentName: string | null,
  versionId?: number,
): string {
  const slug = getEditorSlug(documentName);
  const base = `/editor/${documentId}/${slug}`;
  return versionId !== undefined ? `${base}/${versionId}` : base;
}

export function getPreviewUrl(
  documentId: number,
  documentName: string | null,
  versionId?: number,
): string {
  return `${getEditorUrl(documentId, documentName, versionId)}/preview`;
}
