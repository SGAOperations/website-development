import { describe, expect, it } from "vitest";
import { resolveEditorVersionId, resolvePreviewVersionId } from "./version-selection";

describe("resolveEditorVersionId", () => {
  const versions = [{ id: 30 }, { id: 20 }, { id: 10 }];

  it("uses the latest version when no version is requested", () => {
    expect(resolveEditorVersionId(versions)).toBe(30);
  });

  it("uses the requested version when it belongs to the document", () => {
    expect(resolveEditorVersionId(versions, 20)).toBe(20);
  });

  it("rejects an unknown version id", () => {
    expect(resolveEditorVersionId(versions, 999)).toBeUndefined();
  });

  it("returns undefined when the document has no versions", () => {
    expect(resolveEditorVersionId([], 999)).toBeUndefined();
  });
});

describe("resolvePreviewVersionId", () => {
  const versions = [{ id: 30 }, { id: 20 }, { id: 10 }];

  it("prefers the requested version when it belongs to the document", () => {
    expect(
      resolvePreviewVersionId({
        versions,
        publishedVersionId: 20,
        requestedVersionId: 10,
      }),
    ).toBe(10);
  });

  it("rejects a requested version that does not belong to the document", () => {
    expect(
      resolvePreviewVersionId({
        versions,
        publishedVersionId: 20,
        requestedVersionId: 999,
      }),
    ).toBeUndefined();
  });

  it("falls back to the published version when no version is requested", () => {
    expect(
      resolvePreviewVersionId({
        versions,
        publishedVersionId: 20,
      }),
    ).toBe(20);
  });

  it("falls back to the latest version when there is no published version", () => {
    expect(
      resolvePreviewVersionId({
        versions,
        publishedVersionId: null,
      }),
    ).toBe(30);
  });
});
