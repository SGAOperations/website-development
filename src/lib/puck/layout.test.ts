import { describe, expect, it } from "vitest";
import {
  getGroupSlotClassName,
  getGroupSurfaceClassName,
  getGridClassName,
  getGridOverflowClassName,
  getMaxCols,
} from "./layout";

describe("layout helpers", () => {
  it("compose group surface and slot classes from token selections", () => {
    const style = {
      layout: "row" as const,
      padding: { phone: "sm" as const, md: "lg" as const },
      gap: { phone: "sm" as const, lg: "xl" as const },
      align: "end" as const,
      justify: "center" as const,
      width: "prose" as const,
      bgColor: "background" as const,
      textColor: "foreground" as const,
      radius: "md" as const,
      shadow: "sm" as const,
    };

    expect(getGroupSurfaceClassName(style)).toBe(
      "w-full max-w-prose bg-background text-foreground rounded-md shadow-sm p-2 md:p-6",
    );
    expect(getGroupSlotClassName(style)).toBe(
      "w-full flex flex-row flex-wrap items-end justify-center gap-2 lg:gap-8",
    );
  });

  it("builds responsive grid classes for columns, rows, and gap", () => {
    expect(
      getGridClassName({
        columns: { phone: "1", md: "3" },
        rows: { phone: "auto", md: "2" },
        gap: { phone: "sm" },
        empty: true,
      }),
    ).toBe(
      "grid w-full min-h-[200px] grid-cols-1 md:grid-cols-3 grid-rows-none auto-rows-auto overflow-visible md:grid-rows-2 md:auto-rows-[0] md:overflow-hidden gap-2 md:[&>*:nth-child(-n+6)]:visible md:[&>*:nth-child(n+7)]:invisible",
    );
  });

  it("hides grid items past the fixed rows x columns at each breakpoint", () => {
    expect(getGridOverflowClassName({ phone: "3" }, { phone: "auto" })).toBe("");
    expect(getGridOverflowClassName({ phone: "2", lg: "4" }, { phone: "1" })).toBe(
      "[&>*:nth-child(-n+2)]:visible [&>*:nth-child(n+3)]:invisible lg:[&>*:nth-child(-n+4)]:visible lg:[&>*:nth-child(n+5)]:invisible",
    );
    // Going back to auto rows makes everything visible again.
    expect(getGridOverflowClassName({ phone: "6" }, { phone: "6", md: "auto" })).toBe(
      "[&>*:nth-child(-n+36)]:visible [&>*:nth-child(n+37)]:invisible md:[&>*:nth-child(n)]:visible",
    );
  });

  it("returns the largest configured breakpoint column count", () => {
    expect(getMaxCols({ phone: "1", md: "3", lg: "2" })).toBe(3);
  });
});
