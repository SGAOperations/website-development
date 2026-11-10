import { describe, it, expect } from "vitest";
import { getEditorSlug, getEditorUrl, getPreviewUrl } from "./editor-url";

describe("getEditorSlug", () => {
  it.each<[string | null, string]>([
    ["Hello World", "hello-world"],
    [null, "untitled"],
    ["", "untitled"],
    ["   ", "untitled"],
    ["!!!", "untitled"],
    ["Café Résumé", "cafe-resume"],
    ["my_page_name", "my-page-name"],
    ["a---b", "a-b"],
    ["-hello-", "hello"],
    ["Price: $100 (sale!)", "price-100-sale"],
    ["  foo _ bar - baz  ", "foo-bar-baz"],
  ])("getEditorSlug(%j) → %j", (input, expected) => {
    expect(getEditorSlug(input)).toBe(expected);
  });
});

describe("getEditorUrl", () => {
  it.each<[number, string | null, number | undefined, string]>([
    [4, "Hello World", undefined, "/editor/4/hello-world"],
    [4, "Hello World", 23, "/editor/4/hello-world/23"],
    [4, null, undefined, "/editor/4/untitled"],
    [4, null, 10, "/editor/4/untitled/10"],
  ])("getEditorUrl(%j, %j, %j) → %j", (id, name, versionId, expected) => {
    expect(getEditorUrl(id, name, versionId)).toBe(expected);
  });
});

describe("getPreviewUrl", () => {
  it.each<[number, string | null, number | undefined, string]>([
    [4, "Hello World", undefined, "/editor/4/hello-world/preview"],
    [4, "Hello World", 23, "/editor/4/hello-world/23/preview"],
    [4, null, undefined, "/editor/4/untitled/preview"],
    [4, null, 10, "/editor/4/untitled/10/preview"],
  ])("getPreviewUrl(%j, %j, %j) → %j", (id, name, versionId, expected) => {
    expect(getPreviewUrl(id, name, versionId)).toBe(expected);
  });
});
