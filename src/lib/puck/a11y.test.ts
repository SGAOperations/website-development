import { describe, expect, it } from "vitest";
import type { Data } from "@puckeditor/core";
import { contrastRatio, getContrastWarning, hasMainLandmark } from "./a11y";

describe("contrastRatio", () => {
  it("matches the WCAG reference values", () => {
    expect(contrastRatio("#ffffff", "#000000")).toBeCloseTo(21, 1);
    expect(contrastRatio("#ffffff", "#ffffff")).toBe(1);
    expect(contrastRatio("#c8102e", "#ffffff")).toBeCloseTo(contrastRatio("#ffffff", "#c8102e"));
  });
});

describe("getContrastWarning", () => {
  it("passes readable pairs", () => {
    expect(getContrastWarning("background", "foreground")).toBeNull();
    expect(getContrastWarning("sga-red", "background")).toBeNull();
    expect(getContrastWarning("background", "muted-foreground")).toBeNull();
  });

  it("flags pairs below 4.5:1 and never rounds a failure up to a pass", () => {
    expect(getContrastWarning("background", "muted")).toMatch(/^Low text contrast 1(\.\d)?:1/);
    expect(getContrastWarning("background", "background")).toBe("Low text contrast 1:1 (needs 4.5:1)");
    expect(getContrastWarning("muted-foreground", "foreground")).toMatch(/needs 4.5:1/);
  });
});

describe("hasMainLandmark", () => {
  const page = (content: Data["content"]): Data => ({ root: { props: {} }, content });

  it("is false when no Group uses the main tag", () => {
    expect(hasMainLandmark(page([{ type: "Text", props: { id: "t" } }]))).toBe(false);
  });

  it("finds a main Group nested inside slots", () => {
    const data = page([
      {
        type: "Anchor",
        props: {
          id: "s",
          content: [{ type: "Group", props: { id: "c", tag: "main", content: [] } }],
        },
      },
    ]);
    expect(hasMainLandmark(data)).toBe(true);
  });
});
