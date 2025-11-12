/**
 * Converts a page name to a URL-friendly path
 * @param name - The page name (e.g., "Join a Committee")
 * @returns The path (e.g., "/join-a-committee")
 */
export function slugify(name: string): string {
  return (
    "/" +
    name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/[\s_]+/g, "-") // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
  );
}

/**
 * Converts a path back to a readable name (reverse slugify)
 * @param path - The URL path (e.g., "/join-a-committee")
 * @returns The name (e.g., "Join a Committee")
 */
export function unslugify(path: string): string {
  return path
    .replace(/^\//, "") // Remove leading slash
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

