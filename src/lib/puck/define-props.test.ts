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
      padding: responsive.select(size, { label: "Padding", default: "sm" }),
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
      padding: expect.objectContaining({ type: "custom" }),
      gap: expect.objectContaining({ type: "custom" }),
      rows: expect.objectContaining({ type: "custom" }),
      color: { type: "radio", label: "Color", options: colorToken.options },
      title: { type: "text", label: "Title" },
    });
    expect(props.defaultProps).toEqual({
      content: [],
      size: "md",
      // Responsive defaults always populate every breakpoint: a scalar default
      // applies everywhere, and a partial one is completed from its base.
      padding: { base: "sm", md: "sm", lg: "sm" },
      gap: { base: "sm", md: "lg", lg: "sm" },
      rows: { base: 1, md: 2, lg: 1 },
      color: "red",
      title: "Hello",
    });
  });
});
