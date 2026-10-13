interface VersionOption {
  id: number;
  archivedAt?: Date | null;
}

export function resolveEditorVersionId(
  versions: VersionOption[],
  requestedVersionId?: number,
) {
  if (requestedVersionId === undefined) {
    return versions.find((version) => version.archivedAt === null || version.archivedAt === undefined)?.id;
  }

  // Editor URLs with an explicit version must stay scoped to the current document;
  // an unknown id should 404 upstream rather than opening a different version.
  return versions.some((version) => version.id === requestedVersionId)
    ? requestedVersionId
    : undefined;
}

export function resolvePreviewVersionId({
  versions,
  publishedVersionId,
  requestedVersionId,
}: {
  versions: VersionOption[];
  publishedVersionId: number | null;
  requestedVersionId?: number;
}) {
  if (requestedVersionId !== undefined) {
    // Preview URLs must stay scoped to the current document; an unknown id should 404 upstream.
    return versions.some((version) => version.id === requestedVersionId)
      ? requestedVersionId
      : undefined;
  }

  // Without an explicit version, preview the published version and fall back to the latest draft.
  return publishedVersionId ?? versions.find((version) => version.archivedAt === null || version.archivedAt === undefined)?.id;
}
