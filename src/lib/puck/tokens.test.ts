import { describe, expect, it } from "vitest";
import { columnCount, defineToken, radius, padding, gap } from "./tokens";
import { resolveResponsive } from "./responsive-tailwind";

describe("defineToken", () => {
  it("builds plain tokens from string specs", () => {
    const token = defineToken({ sm: "Small", md: "Medium", lg: "Large" }, "md");

    expect(token).toEqual({
      options: [
        { value: "sm", label: "Small" },
        { value: "md", label: "Medium" },
        { value: "lg", label: "Large" },
      ],
      defaultValue: "md",
    });
    expect("classes" in token).toBe(false);
  });

  it("builds class tokens from object specs", () => {
    const token = defineToken({
      sm: { label: "Small", classes: "text-sm" },
      md: { label: "Medium", classes: "text-md" },
      lg: { label: "Large", classes: "text-lg" },
    });

    expect(token.options).toEqual([
      { value: "sm", label: "Small" },
      { value: "md", label: "Medium" },
      { value: "lg", label: "Large" },
    ]);
    expect(token.defaultValue).toBe("sm");
    expect(token.classes).toEqual({
      sm: "text-sm",
      md: "text-md",
      lg: "text-lg",
    });
  });
});

describe("built-in tokens", () => {
  it("expose the expected classes", () => {
    expect(radius.classes.full).toBe("rounded-full");
    expect(padding.classes.md).toBe("p-4");
    expect(gap.classes["2xl"]).toBe("gap-12");
  });

  it("work with responsive resolution through their class maps", () => {
    expect(resolveResponsive({ base: "sm", md: "lg" }, gap.classes)).toBe(
      "gap-2 md:gap-6",
    );
    expect(
      resolveResponsive({ base: "1", lg: "4" }, columnCount.classes),
    ).toBe("grid-cols-1 lg:grid-cols-4");
  });
});
