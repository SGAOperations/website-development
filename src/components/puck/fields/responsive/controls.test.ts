import { describe, expect, it } from "vitest";
import {
  formatResponsiveNumberValue,
  getResponsiveNumberChange,
} from "./number-control";

describe("responsive number control helpers", () => {
  it("formats values for the number input", () => {
    expect(formatResponsiveNumberValue(3)).toBe("3");
    expect(formatResponsiveNumberValue(0)).toBe("0");
  });

  it("never commits an empty value at any breakpoint", () => {
    expect(getResponsiveNumberChange("")).toEqual({ kind: "ignore" });
    expect(getResponsiveNumberChange("abc")).toEqual({ kind: "ignore" });
  });

  it("validates numeric input against min and max", () => {
    expect(getResponsiveNumberChange("4", { min: 1, max: 6 })).toEqual({
      kind: "set",
      value: 4,
    });
    expect(getResponsiveNumberChange("0", { min: 1, max: 6 })).toEqual({
      kind: "ignore",
    });
    expect(getResponsiveNumberChange("9", { min: 1, max: 6 })).toEqual({
      kind: "ignore",
    });
  });
});
