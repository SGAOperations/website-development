import { describe, expect, it } from "vitest";
import {
  createResponsiveStyle,
  mapResponsiveValue,
  normalizeLegacyMaxWidthSizeValue,
  normalizeLegacyRatioValue,
  normalizeResponsiveRatioValue,
  normalizeResponsiveSizeValue,
  ratioValueToCss,
  sizeValueToCss,
} from "./style-values";

describe("style values", () => {
  it("serializes preset and custom size values", () => {
    expect(sizeValueToCss({ mode: "full" })).toBe("100%");
    expect(
      sizeValueToCss(
        { mode: "preset", preset: "screen-lg" },
        { "screen-lg": "1024px" },
      ),
    ).toBe("1024px");
    expect(sizeValueToCss({ mode: "custom", value: 50, unit: "%" })).toBe("50%");
  });

  it("serializes ratio values", () => {
    expect(ratioValueToCss({ mode: "preset", preset: "photo" })).toBe("4 / 3");
    expect(ratioValueToCss({ mode: "custom", width: 3, height: 1 })).toBe("3 / 1");
  });

  it("normalizes legacy width and ratio values", () => {
    expect(normalizeLegacyMaxWidthSizeValue("full")).toEqual({
      base: { mode: "none" },
    });
    expect(normalizeLegacyMaxWidthSizeValue("prose")).toEqual({
      base: { mode: "preset", preset: "prose" },
    });
    expect(normalizeLegacyRatioValue("auto")).toEqual({
      base: { mode: "none" },
    });
    expect(normalizeLegacyRatioValue("wide")).toEqual({
      base: { mode: "preset", preset: "wide" },
    });
  });

  it("handles missing responsive values safely", () => {
    expect(normalizeResponsiveSizeValue(undefined)).toEqual({
      base: { mode: "none" },
    });
    expect(normalizeResponsiveRatioValue(undefined)).toEqual({
      base: { mode: "none" },
    });
    expect(sizeValueToCss(undefined)).toBeUndefined();
    expect(ratioValueToCss(undefined)).toBeUndefined();
    expect(mapResponsiveValue(undefined, String)).toBeUndefined();
    expect(createResponsiveStyle("puck-width", "puck-width", undefined)).toEqual({});
  });
});
