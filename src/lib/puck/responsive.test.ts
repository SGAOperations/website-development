import { describe, expect, it } from "vitest";
import { setAt } from "./responsive";

describe("responsive helpers", () => {
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
