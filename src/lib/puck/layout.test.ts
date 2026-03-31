import { describe, expect, it } from "vitest";
import {
  getColumnTemplateStyles,
  getContainerSlotClassName,
  getContainerSurface,
  getGridClassName,
  getMaxCols,
} from "./layout";

describe("layout helpers", () => {
  it("compose container surface classes and responsive sizing styles", () => {
    const style = {
      layout: "row" as const,
      padding: { base: "sm" as const, md: "lg" as const },
      gap: { base: "sm" as const, lg: "xl" as const },
      align: "end" as const,
      justify: "center" as const,
      boxWidth: { base: { mode: "full" as const } },
      width: "prose" as const,
      minWidth: { base: { mode: "none" as const } },
      height: { base: { mode: "custom" as const, value: 320, unit: "px" as const } },
      minHeight: { base: { mode: "none" as const } },
      maxHeight: { base: { mode: "none" as const } },
      aspectRatio: { base: { mode: "preset" as const, preset: "video" as const } },
      overflowX: "hidden" as const,
      overflowY: "visible" as const,
      bgColor: "background" as const,
      textColor: "foreground" as const,
      radius: "md" as const,
      shadow: "sm" as const,
    };

    expect(getContainerSurface(style)).toEqual({
      className:
        "w-full bg-background text-foreground rounded-md shadow-sm overflow-x-hidden overflow-y-visible p-2 md:p-6 puck-width puck-max-width puck-height puck-aspect-ratio",
      style: {
        "--puck-width-base": "100%",
        "--puck-max-width-base": "65ch",
        "--puck-height-base": "320px",
        "--puck-aspect-ratio-base": "16 / 9",
      },
    });
    expect(getContainerSlotClassName(style)).toBe(
      "w-full flex flex-row flex-wrap items-end justify-center gap-2 lg:gap-8",
    );
  });

  it("builds responsive grid classes for columns, rows, and gap", () => {
    expect(
      getGridClassName({
        columns: { base: "1", md: "3" },
        rows: { base: "auto", md: "2" },
        gap: { base: "sm" },
        empty: true,
      }),
    ).toBe(
      "grid w-full min-h-[200px] grid-cols-1 md:grid-cols-3 grid-rows-none auto-rows-auto overflow-visible md:grid-rows-2 md:auto-rows-[0] md:overflow-hidden gap-2",
    );
  });

  it("returns the largest configured breakpoint column count", () => {
    expect(getMaxCols({ base: "1", md: "1-2-1", lg: "2" })).toBe(3);
  });

  it("builds responsive template column styles for asymmetrical columns", () => {
    expect(getColumnTemplateStyles({ base: "1", md: "1-2" })).toEqual({
      className: "puck-grid-template-columns",
      style: {
        "--puck-grid-template-columns-base": "minmax(0, 1fr)",
        "--puck-grid-template-columns-md": "minmax(0, 1fr) minmax(0, 2fr)",
      },
    });
  });
});
