import { describe, expect, it } from "vitest";
import { defineProps, field, responsive } from "./define-props";
import { defineToken } from "@/lib/puck/tokens";

const size = defineToken({ sm: "Small", md: "Medium", lg: "Large" });
const colorToken = defineToken({
  red: { label: "Red", classes: "text-red" },
  blue: { label: "Blue", classes: "text-blue" },
});

describe("prop builders", () => {
  it("wrap token defaults unless a full responsive value is provided", () => {
    expect(responsive.token(size, { label: "Size" })).toMatchObject({
      field: { type: "custom" },
      defaultValue: { base: "sm" },
    });
    expect(
      responsive.token(size, { label: "Size", default: "md" }).defaultValue,
    ).toEqual({ base: "md" });
    expect(
      responsive.token(size, {
        label: "Size",
        default: { base: "sm", md: "lg" },
      }).defaultValue,
    ).toEqual({ base: "sm", md: "lg" });
  });

  it("build static field descriptors and respect explicit defaults", () => {
    expect(field.select(size, { label: "Size" })).toEqual({
      field: { type: "select", label: "Size", options: size.options },
      defaultValue: "sm",
    });
    expect(field.radio(colorToken, { label: "Color", default: "blue" })).toEqual({
      field: { type: "radio", label: "Color", options: colorToken.options },
      defaultValue: "blue",
    });
    expect(field.raw({ type: "text" }, "hello")).toEqual({
      field: { type: "text" },
      defaultValue: "hello",
    });
  });
});

describe("defineProps", () => {
  it("splits mixed prop specs into fields and defaultProps", () => {
    const props = defineProps({
      content: field.slot(),
      size: field.select(size, { label: "Size", default: "md" }),
      gap: responsive.token(size, {
        label: "Gap",
        default: { base: "sm", md: "lg" },
      }),
      color: field.radio(colorToken, { label: "Color" }),
    });

    expect(props.fields).toEqual({
      content: { type: "slot" },
      size: { type: "select", label: "Size", options: size.options },
      gap: expect.objectContaining({ type: "custom" }),
      color: { type: "radio", label: "Color", options: colorToken.options },
    });
    expect(props.defaultProps).toEqual({
      content: [],
      size: "md",
      gap: { base: "sm", md: "lg" },
      color: "red",
    });
  });
});
