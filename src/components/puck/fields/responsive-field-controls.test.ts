import { describe, expect, it } from "vitest";
import {
  fromResponsiveSelectValue,
  toResponsiveSelectValue,
} from "./responsive-select-control";
import {
  formatResponsiveNumberValue,
  getResponsiveNumberChange,
} from "./responsive-number-control";

describe("responsive select control helpers", () => {
  it("translates inherited select values at the UI boundary", () => {
    expect(toResponsiveSelectValue(undefined)).toBe("");
    expect(fromResponsiveSelectValue("")).toBeUndefined();
    expect(fromResponsiveSelectValue("md")).toBe("md");
  });
});

describe("responsive number control helpers", () => {
  it("formats values for the number input", () => {
    expect(formatResponsiveNumberValue(undefined)).toBe("");
    expect(formatResponsiveNumberValue(3)).toBe("3");
  });

  it("clears inherited overrides, preserves base values, and validates numeric input", () => {
    expect(getResponsiveNumberChange("", { isBase: false })).toEqual({
      kind: "set",
      value: undefined,
    });
    expect(getResponsiveNumberChange("", { isBase: true })).toEqual({
      kind: "ignore",
    });
    expect(
      getResponsiveNumberChange("4", { isBase: true, min: 1, max: 6 }),
    ).toEqual({
      kind: "set",
      value: 4,
    });
    expect(
      getResponsiveNumberChange("0", { isBase: true, min: 1, max: 6 }),
    ).toEqual({
      kind: "ignore",
    });
    expect(
      getResponsiveNumberChange("9", { isBase: false, min: 1, max: 6 }),
    ).toEqual({
      kind: "ignore",
    });
  });
});
