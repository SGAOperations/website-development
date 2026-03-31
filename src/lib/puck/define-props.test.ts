import { describe, expect, expectTypeOf, it } from "vitest";
import { defineProps, field, responsive } from "./define-props";
import { defineToken } from "@/lib/puck/tokens";
import { responsiveFieldDescriptor } from "@/components/puck/fields/responsive";

const size = defineToken({ sm: "Small", md: "Medium", lg: "Large" });
const colorToken = defineToken({
  red: { label: "Red", classes: "text-red" },
  blue: { label: "Blue", classes: "text-blue" },
});

describe("prop builders", () => {
  it("builds typed responsive descriptors", () => {
    const selectDescriptor = responsiveFieldDescriptor.select(colorToken.options);
    const numberDescriptor = responsiveFieldDescriptor.number({
      min: 1,
      max: 6,
      step: 1,
    });

    expect(selectDescriptor).toEqual({
      kind: "select",
      options: colorToken.options,
    });
    expect(numberDescriptor).toEqual({
      kind: "number",
      min: 1,
      max: 6,
      step: 1,
    });
    expectTypeOf(selectDescriptor.options).toEqualTypeOf<typeof colorToken.options>();
  });

  it("normalizes defaults and splits fields from defaultProps", () => {
    const props = defineProps({
      content: field.slot(),
      size: field.select(size, { label: "Size", default: "md" }),
      gap: responsive.select(size, {
        label: "Gap",
        default: { base: "sm", md: "lg" },
      }),
      rows: responsive.number({
        label: "Rows",
        default: { base: 1, md: 2 },
        min: 1,
        max: 6,
        step: 1,
      }),
      color: field.radio(colorToken, { label: "Color" }),
      title: field.raw({ type: "text", label: "Title" }, "Hello"),
    });

    expect(props.fields).toEqual({
      content: { type: "slot" },
      size: { type: "select", label: "Size", options: size.options },
      gap: expect.objectContaining({ type: "custom" }),
      rows: expect.objectContaining({ type: "custom" }),
      color: { type: "radio", label: "Color", options: colorToken.options },
      title: { type: "text", label: "Title" },
    });
    expect(props.defaultProps).toEqual({
      content: [],
      size: "md",
      gap: { base: "sm", md: "lg" },
      rows: { base: 1, md: 2 },
      color: "red",
      title: "Hello",
    });
  });
});
