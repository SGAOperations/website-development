import { describe, expect, it } from "vitest";
import {
  getDefaultMediaDisplayName,
  getMediaStoragePath,
  getUploadMediaDetails,
  normalizeRequestedFileStem,
  sanitizeFileStem,
  splitFileName,
} from "./utils";

describe("splitFileName", () => {
  it.each([
    ["hero-image.png", { fileStem: "hero-image", fileExtension: "png" }],
    ["photo.backup.JPG", { fileStem: "photo.backup", fileExtension: "jpg" }],
    [".env", { fileStem: ".env", fileExtension: "" }],
    ["no-extension", { fileStem: "no-extension", fileExtension: "" }],
  ])("splits %j", (input, expected) => {
    expect(splitFileName(input)).toEqual(expected);
  });
});

describe("sanitizeFileStem", () => {
  it.each([
    ["Hero Banner", "hero-banner"],
    ["Café résumé", "cafe-resume"],
    ["  spaced___out.file  ", "spaced-out-file"],
    ["Team & Culture", "team-culture"],
  ])("sanitizes %j", (input, expected) => {
    expect(sanitizeFileStem(input)).toBe(expected);
  });

  it.each(["", "   ", "???", "***"])("rejects %j", (input) => {
    expect(() => sanitizeFileStem(input)).toThrow();
  });
});

describe("getDefaultMediaDisplayName", () => {
  it.each([
    ["My Hero Image.PNG", "My Hero Image"],
    ["no-extension", "no-extension"],
    [".env", ".env"],
  ])("derives %j -> %j", (input, expected) => {
    expect(getDefaultMediaDisplayName(input)).toBe(expected);
  });
});

describe("normalizeRequestedFileStem", () => {
  it("strips the preserved extension before sanitizing", () => {
    expect(normalizeRequestedFileStem("Hero Banner.PNG", "png")).toBe("hero-banner");
  });
});

describe("getUploadMediaDetails", () => {
  it("derives a sanitized stem and preserves the extension", () => {
    expect(getUploadMediaDetails("My Hero Image.PNG")).toEqual({
      displayName: "My Hero Image",
      fileStem: "my-hero-image",
      fileExtension: "png",
    });
  });
});

describe("getMediaStoragePath", () => {
  it("builds a media path from the media id and file name", () => {
    expect(getMediaStoragePath(42, "hero-banner", "png")).toBe("media/42/hero-banner.png");
  });
});
