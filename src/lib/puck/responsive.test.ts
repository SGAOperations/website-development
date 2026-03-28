import { describe, expect, it } from "vitest";
import { hasOverride, map, resolveAt, setAt } from "./responsive";

describe("responsive helpers", () => {
  it("resolves breakpoints by cascading from the nearest smaller value", () => {
    expect(resolveAt({ base: "sm" }, "lg")).toBe("sm");
    expect(resolveAt({ base: "sm", lg: "xl" }, "md")).toBe("sm");
    expect(resolveAt({ base: "sm", md: "lg" }, "lg")).toBe("lg");
    expect(resolveAt({ base: "sm", md: "lg", lg: "xl" }, "lg")).toBe("xl");
  });

  it("treats non-base and falsy values as defined overrides", () => {
    expect(hasOverride({ base: "md" })).toBe(false);
    expect(hasOverride({ base: false, md: false })).toBe(true);
    expect(map({ base: 0, lg: 3 }, (value, bp) => `${bp}:${value}`)).toEqual({
      base: "base:0",
      lg: "lg:3",
    });
  });

  it("adds and removes overrides without mutating the original value", () => {
    const value = { base: "sm", md: "lg" };
    const withLg = setAt(value, "lg", "xl");
    const clearedMd = setAt(value, "md", undefined);

    expect(withLg).toEqual({ base: "sm", md: "lg", lg: "xl" });
    expect(withLg).not.toBe(value);
    expect(clearedMd).toEqual({ base: "sm" });
    expect(clearedMd).not.toBe(value);
    expect(value).toEqual({ base: "sm", md: "lg" });
  });

  it("updates the base value but refuses to clear it", () => {
    expect(setAt({ base: 1, md: 2 }, "base", 0)).toEqual({ base: 0, md: 2 });
    expect(() => setAt({ base: 1 }, "base", undefined)).toThrow(
      "Base value cannot be undefined",
    );
  });
});
