/**
 * Shared helpers for media file names. Used by both the rename dialog
 * (browser) and the rename server action, so the rules never drift apart.
 * Keep this file free of "use client" / "use server" and of any imports
 * that only work on one side.
 */

/**
 * Splits a storage path into its folder, editable base name, and extension.
 *
 * The file name isn't stored in its own database column. It's derived from
 * `Media.storagePath`, so this is how we get it out.
 */
export function splitStoragePath(storagePath: string) {
  const slash = storagePath.lastIndexOf("/");
  const folder = slash === -1 ? "" : storagePath.slice(0, slash);
  const file = storagePath.slice(slash + 1);

  const dot = file.lastIndexOf(".");
  const base = dot > 0 ? file.slice(0, dot) : file;
  const ext = dot > 0 ? file.slice(dot) : "";

  return { folder, base, ext };
}

export const MAX_FILE_NAME_LENGTH = 100;

/** Harmless cleanup: trim, lowercase, spaces become hyphens. */
export function normalizeFileName(input: string) {
  return input.trim().toLowerCase().replace(/\s+/g, "-");
}

/**
 * Checks an already-normalized file name (no extension).
 * Returns an error message, or null if the name is fine.
 */
export function validateFileName(name: string): string | null {
  if (name === "") return "File name can't be empty.";
  if (name.length > MAX_FILE_NAME_LENGTH)
    return `File name must be ${MAX_FILE_NAME_LENGTH} characters or fewer.`;
  if (name.startsWith(".")) return "File name can't start with a dot.";
  if (name.endsWith(".")) return "File name can't end with a dot.";
  if (name.includes("..")) return "File name can't contain two dots in a row.";
  if (!/^[a-z0-9._-]+$/.test(name))
    return "Use only letters, numbers, hyphens, underscores, and dots.";
  return null;
}
