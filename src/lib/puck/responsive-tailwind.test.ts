import { describe, expect, it } from "vitest";
import { resolveResponsive } from "./responsive-tailwind";

describe("resolveResponsive", () => {
  it("resolves base, ordered overrides, and numeric values", () => {
    expect(resolveResponsive({ base: "md" }, { md: "p-md" })).toBe("p-md");
    expect(
      resolveResponsive(
        { base: "sm", md: "lg" },
        { sm: "gap-sm", lg: "gap-lg" },
      ),
    ).toBe("gap-sm md:gap-lg");
    expect(
      resolveResponsive({ base: 0, md: 2 }, { 0: "order-0", 2: "order-2" }),
    ).toBe("order-0 md:order-2");
  });

  it("keeps later overrides even when intermediate breakpoints are missing", () => {
    expect(
      resolveResponsive({ base: "sm", lg: "xl" }, { sm: "gap-sm", xl: "gap-xl" }),
    ).toBe("gap-sm lg:gap-xl");
  });

  it("prefixes every utility in multi-class variants, including resets", () => {
    const rows = {
      auto: "grid-rows-none auto-rows-auto overflow-visible",
      "2": "grid-rows-2 auto-rows-[0] overflow-hidden",
    };

    expect(resolveResponsive({ base: "auto", md: "2" }, rows)).toBe(
      "grid-rows-none auto-rows-auto overflow-visible md:grid-rows-2 md:auto-rows-[0] md:overflow-hidden",
    );
    expect(
      resolveResponsive({ base: "2", md: "auto" }, rows),
    ).toBe(
      "grid-rows-2 auto-rows-[0] overflow-hidden md:grid-rows-none md:auto-rows-auto md:overflow-visible",
    );
  });
});
