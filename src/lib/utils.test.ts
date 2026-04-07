import { describe, it, expect } from "vitest";
import { validateName, wrapAction } from "./utils";

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

describe("wrapAction", () => {
  it("maps Prisma unique constraint errors to user-friendly text", async () => {
    const result = await wrapAction(async () => {
      throw {
        code: "P2002",
        meta: { target: ["name"] },
      };
    });

    expect(result).toEqual({
      success: false,
      error: "A record with this name already exists.",
    });
  });

  it("maps Prisma not found errors to user-friendly text", async () => {
    const result = await wrapAction(async () => {
      throw { code: "P2025" };
    });

    expect(result).toEqual({
      success: false,
      error: "The requested record was not found.",
    });
  });

  it("maps Prisma field too long errors", async () => {
    const result = await wrapAction(async () => {
      throw { code: "P2000" };
    });

    expect(result).toEqual({
      success: false,
      error: "A field contains a value that is too long.",
    });
  });

  it("maps Prisma null constraint errors", async () => {
    const result = await wrapAction(async () => {
      throw { code: "P2011" };
    });

    expect(result).toEqual({
      success: false,
      error: "A required field is missing.",
    });
  });

  it("maps Prisma relation violation on delete errors", async () => {
    const result = await wrapAction(async () => {
      throw { code: "P2014" };
    });

    expect(result).toEqual({
      success: false,
      error: "This record is referenced by other records and cannot be deleted.",
    });
  });

  it("maps Prisma related record not found errors", async () => {
    const result = await wrapAction(async () => {
      throw { code: "P2015" };
    });

    expect(result).toEqual({
      success: false,
      error: "The related record could not be found.",
    });
  });

  it("maps Prisma connection timeout errors", async () => {
    const result = await wrapAction(async () => {
      throw { code: "P2024" };
    });

    expect(result).toEqual({
      success: false,
      error: "Database connection timeout. Please try again.",
    });
  });

  it("maps Prisma multiple errors", async () => {
    const result = await wrapAction(async () => {
      throw { code: "P2027" };
    });

    expect(result).toEqual({
      success: false,
      error: "Multiple database errors occurred. Please try again.",
    });
  });

  it("falls back to generic error for unmapped Prisma codes", async () => {
    const result = await wrapAction(async () => {
      throw { code: "P9999" };
    });

    expect(result).toEqual({
      success: false,
      error: "A database operation failed. Please try again.",
    });
  });
});
