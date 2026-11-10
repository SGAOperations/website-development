import { describe, it, expect } from "vitest";
import { validateName } from "./utils";

describe("validateName", () => {
  it.each<[string, string]>([
    ["hello", "hello"],
    ["  hello  ", "hello"],
    ["  spaced  out  ", "spaced  out"],
  ])("validateName(%j) → %j", (input, expected) => {
    expect(validateName(input)).toBe(expected);
  });

  it.each(["", "   "])("throws for %j", (input) => {
    expect(() => validateName(input)).toThrow("Name cannot be empty");
  });
});
