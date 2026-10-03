import { describe, expect, it } from "vitest";
import { setAt } from "./responsive";

describe("responsive helpers", () => {
  it("adds and removes overrides without mutating the original value", () => {
    const value = { phone: "sm", md: "lg" };
    const withLg = setAt(value, "lg", "xl");
    const clearedMd = setAt(value, "md", undefined);

    expect(withLg).toEqual({ phone: "sm", md: "lg", lg: "xl" });
    expect(withLg).not.toBe(value);
    expect(clearedMd).toEqual({ phone: "sm" });
    expect(clearedMd).not.toBe(value);
    expect(value).toEqual({ phone: "sm", md: "lg" });
  });

  it("updates the 'phone' value but refuses to clear it", () => {
    expect(setAt({ phone: 1, md: 2 }, "phone", 0)).toEqual({ phone: 0, md: 2 });
    expect(() => setAt({ phone: 1 }, "phone", undefined)).toThrow(
      "Phonw value cannot be undefined",
    );
  });
});
