const COMBINING_MARKS = /[\u0300-\u036f]/g;
const INVALID_FILE_STEM_CHARS = /[<>:"/\\|?*\u0000-\u001f]/g;
const DISALLOWED_FILE_STEM_CHARS = /[^a-zA-Z0-9\s._-]/g;
const SEPARATOR_RUNS = /[\s._-]+/g;

function getBaseFileName(fileName: string): string {
  const trimmed = fileName.trim();
  if (!trimmed) {
    return "";
  }

  const lastSeparatorIndex = Math.max(
    trimmed.lastIndexOf("/"),
    trimmed.lastIndexOf("\\"),
  );

  return trimmed.slice(lastSeparatorIndex + 1);
}

export function splitFileName(fileName: string): {
  fileStem: string;
  fileExtension: string;
} {
  const baseFileName = getBaseFileName(fileName);
  const extensionIndex = baseFileName.lastIndexOf(".");

  if (extensionIndex <= 0 || extensionIndex === baseFileName.length - 1) {
    return {
      fileStem: baseFileName,
      fileExtension: "",
    };
  }

  return {
    fileStem: baseFileName.slice(0, extensionIndex),
    fileExtension: baseFileName.slice(extensionIndex + 1).toLowerCase(),
  };
}

export function getDefaultMediaDisplayName(fileName: string): string {
  const { fileStem, fileExtension } = splitFileName(fileName);
  if (fileExtension) {
    return fileStem || fileName;
  }

  return getBaseFileName(fileName);
}

// TODO: Use zod
export function sanitizeFileStem(fileStem: string): string {
  const trimmed = fileStem.trim();
  if (!trimmed) {
    throw new Error("File name cannot be empty");
  }

  const sanitized = trimmed
    .normalize("NFKD")
    .replace(COMBINING_MARKS, "")
    .replace(INVALID_FILE_STEM_CHARS, " ")
    .replace(DISALLOWED_FILE_STEM_CHARS, " ")
    .replace(SEPARATOR_RUNS, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  if (!sanitized) {
    throw new Error("File name contains no valid characters");
  }

  return sanitized;
}

export function normalizeRequestedFileStem(
  input: string,
  fileExtension: string,
): string {
  const trimmed = input.trim();
  const suffix = fileExtension ? `.${fileExtension}` : "";
  const stemOnly = suffix && trimmed.toLowerCase().endsWith(suffix.toLowerCase())
    ? trimmed.slice(0, -suffix.length)
    : trimmed;

  return sanitizeFileStem(stemOnly);
}

export function getUploadMediaDetails(fileName: string): {
  displayName: string;
  fileStem: string;
  fileExtension: string;
} {
  const { fileStem, fileExtension } = splitFileName(fileName);
  return {
    displayName: getDefaultMediaDisplayName(fileName),
    fileStem: sanitizeFileStem(fileStem || "file"),
    fileExtension,
  };
}

export function getMediaStoragePath(
  mediaId: number,
  fileStem: string,
  fileExtension: string,
): string {
  return fileExtension
    ? `media/${mediaId}/${fileStem}.${fileExtension}`
    : `media/${mediaId}/${fileStem}`;
}
