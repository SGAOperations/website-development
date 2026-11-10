const ROUTE_SEGMENT_RE = /^[a-z0-9_-]+$/;

export function assertValidRoutePath(path: string): void {
  if (path.trim() !== path) {
    throw new Error("Path cannot have leading or trailing whitespace");
  }

  if (path.length === 0) {
    throw new Error("Path cannot be empty");
  }

  if (!path.startsWith("/")) {
    throw new Error("Path must start with /");
  }

  if (path === "/") {
    return;
  }

  if (path.endsWith("/")) {
    throw new Error("Path must not end with / (except root /)");
  }

  if (path.includes("//")) {
    throw new Error("Path must not contain consecutive slashes");
  }

  if (path !== path.toLowerCase()) {
    throw new Error("Path must be lowercase");
  }

  const segments = path.split("/").slice(1);
  const isValidSegment = (segment: string) => ROUTE_SEGMENT_RE.test(segment);
  if (!segments.every(isValidSegment)) {
    throw new Error(
      "Each path segment may only contain lowercase letters, numbers, hyphens, and underscores"
    );
  }
}
