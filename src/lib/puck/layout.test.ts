import { describe, expect, it } from "vitest";
import {
  getContainerSlotClassName,
  getContainerSurfaceClassName,
  getGridClassName,
  getMaxCols,
} from "./layout";

describe("layout helpers", () => {
  it("compose container surface and slot classes from token selections", () => {
    const style = {
      layout: "row" as const,
      padding: { base: "sm" as const, md: "lg" as const },
      gap: { base: "sm" as const, lg: "xl" as const },
      align: "end" as const,
      justify: "center" as const,
      width: "prose" as const,
      bgColor: "background" as const,
      textColor: "foreground" as const,
      radius: "md" as const,
      shadow: "sm" as const,
    };

    expect(getContainerSurfaceClassName(style)).toBe(
      "w-full max-w-prose bg-background text-foreground rounded-md shadow-sm p-2 md:p-6",
    );
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
    expect(getMaxCols({ base: "1", md: "3", lg: "2" })).toBe(3);
  });
});
