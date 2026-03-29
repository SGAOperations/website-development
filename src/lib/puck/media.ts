import type { Data } from "@puckeditor/core";

export function collectMediaIds(data: Data): number[] {
  const ids = new Set<number>();
  const seen = new WeakSet<object>();

  function visit(value: unknown) {
    if (Array.isArray(value)) {
      for (const item of value) visit(item);
      return;
    }

    if (!value || typeof value !== "object") {
      return;
    }

    if (seen.has(value)) {
      return;
    }
    seen.add(value);

    for (const [key, nested] of Object.entries(value)) {
      if (key === "mediaId" && typeof nested === "number") {
        ids.add(nested);
        continue;
      }

      visit(nested);
    }
  }

  visit(data.root);
  visit(data.content);
  visit(data.zones);

  return [...ids];
}
