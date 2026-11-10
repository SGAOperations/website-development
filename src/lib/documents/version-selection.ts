interface VersionOption {
  id: number;
}

export function resolveEditorVersionId(
  versions: VersionOption[],
  requestedVersionId?: number,
) {
  if (requestedVersionId === undefined) {
    return versions[0]?.id;
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
  return publishedVersionId ?? versions[0]?.id;
}
