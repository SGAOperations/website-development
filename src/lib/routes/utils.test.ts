import { describe, it, expect } from "vitest";
import { assertValidRoutePath } from "./utils";

describe("assertValidRoutePath", () => {
  describe("valid paths", () => {
    it.each([
      "/",
      "/about",
      "/blog/my-post",
      "/a/b/c",
      "/page-1",
      "/under_score",
      "/123",
    ])("accepts %j", (path) => {
      expect(() => assertValidRoutePath(path)).not.toThrow();
    });
  });

  describe("invalid paths", () => {
    it.each<[string, string]>([
      ["", "cannot be empty"],
      ["about", "must start with /"],
      [" /about", "leading or trailing whitespace"],
      ["/about ", "leading or trailing whitespace"],
      ["/about/", "must not end with /"],
      ["/a//b", "consecutive slashes"],
      ["/About", "must be lowercase"],
      ["/hello world", "lowercase letters, numbers, hyphens, and underscores"],
      ["/hello!", "lowercase letters, numbers, hyphens, and underscores"],
    ])("rejects %j (%s)", (path, expectedMessage) => {
      expect(() => assertValidRoutePath(path)).toThrow(expectedMessage);
    });
  });
});
