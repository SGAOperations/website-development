import { describe, expect, it } from "vitest";
import { expandResponsiveValue, fillResponsiveValue, setAt } from "./responsive";

describe("responsive helpers", () => {
  it("sets a breakpoint without mutating the original value", () => {
    const value = { base: "sm", md: "lg", lg: "lg" };
    const withLg = setAt(value, "lg", "xl");

    expect(withLg).toEqual({ base: "sm", md: "lg", lg: "xl" });
    expect(withLg).not.toBe(value);
    expect(value).toEqual({ base: "sm", md: "lg", lg: "lg" });
  });

  it("updates the base value like any other breakpoint", () => {
    expect(setAt({ base: 1, md: 2, lg: 3 }, "base", 0)).toEqual({
      base: 0,
      md: 2,
      lg: 3,
    });
  });

  it("refuses to clear any breakpoint", () => {
    for (const bp of ["base", "md", "lg"] as const) {
      expect(() =>
        setAt({ base: 1, md: 2, lg: 3 }, bp, undefined as unknown as number),
      ).toThrow(`Value for breakpoint "${bp}" cannot be undefined`);
    }
  });

  it("expands a single value to every breakpoint", () => {
    expect(expandResponsiveValue("md")).toEqual({
      base: "md",
      md: "md",
      lg: "md",
    });
  });

  it("fills breakpoints missing from legacy values from the base", () => {
    expect(fillResponsiveValue({ base: "sm" })).toEqual({
      base: "sm",
      md: "sm",
      lg: "sm",
    });
    expect(fillResponsiveValue({ base: "sm", lg: "xl" })).toEqual({
      base: "sm",
      md: "sm",
      lg: "xl",
    });
    expect(fillResponsiveValue({ base: "sm", md: "lg", lg: "xl" })).toEqual({
      base: "sm",
      md: "lg",
      lg: "xl",
    });
  });
});
