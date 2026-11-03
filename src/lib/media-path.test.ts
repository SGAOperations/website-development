import { describe, it, expect } from "vitest";
import { splitStoragePath, normalizeFileName, validateFileName } from "./media-path";

describe("splitStoragePath", () => {
  it("splits folder, base and extension", () => {
    expect(splitStoragePath("blog/hero.png")).toEqual({ folder: "blog", base: "hero", ext: ".png" });
  });
  it("handles files at the root", () => {
    expect(splitStoragePath("a1b2.webp")).toEqual({ folder: "", base: "a1b2", ext: ".webp" });
  });
  it("handles no extension", () => {
    expect(splitStoragePath("uploads/README")).toEqual({ folder: "uploads", base: "README", ext: "" });
  });
  it("splits on the last dot", () => {
    expect(splitStoragePath("my.photo.jpg")).toEqual({ folder: "", base: "my.photo", ext: ".jpg" });
  });
});

describe("normalizeFileName", () => {
  it("lowercases and turns spaces into hyphens", () => {
    expect(normalizeFileName("  My Photo ")).toBe("my-photo");
  });
});

describe("validateFileName", () => {
  it("accepts normal names", () => {
    expect(validateFileName("horse-photo")).toBeNull();
    expect(validateFileName("hero.final")).toBeNull();
  });
  it("rejects empty names", () => {
    expect(validateFileName("")).not.toBeNull();
  });
  it("rejects slashes and other bad characters", () => {
    for (const bad of ["my/photo", "a\\b", "what?", "a#b", "50%", "a:b"]) {
      expect(validateFileName(bad)).not.toBeNull();
    }
  });
  it("rejects leading dots, trailing dots and '..'", () => {
    for (const bad of [".hidden", "photo.", "a..b"]) {
      expect(validateFileName(bad)).not.toBeNull();
    }
  });
  it("rejects names that are too long", () => {
    expect(validateFileName("a".repeat(101))).not.toBeNull();
  });
});