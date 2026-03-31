import type { ComponentConfig } from "@puckeditor/core";
import { Button } from "@/components/ui/button";
import { defineProps, field } from "@/lib/puck/define-props";
import { defineToken, type TokenValue } from "@/lib/puck/tokens";

const variant = defineToken({
  default:     "Default",
  secondary:   "Secondary",
  outline:     "Outline",
  ghost:       "Ghost",
  destructive: "Destructive",
  link:        "Link",
});
type Variant = TokenValue<typeof variant>;

const size = defineToken({
  sm:      "Small",
  default: "Default",
  lg:      "Large",
}, "default");
type Size = TokenValue<typeof size>;

type PuckButtonProps = {
  label: string;
  href: string;
  variant: Variant;
  size: Size;
};

const props = defineProps({
  label: field.raw({ type: "text", label: "Label" }, "Click me"),
  href: field.raw({ type: "text", label: "Link URL" }, ""),
  variant: field.select(variant, { label: "Variant" }),
  size: field.select(size, { label: "Size" }),
});

export const PuckButton: ComponentConfig<PuckButtonProps> = {
  label: "Button",
  ...props,
  render: ({ label, href, variant: v, size: s }) => {
    const button = (
      <Button variant={v} size={s}>
        {label}
      </Button>
    );

    if (href) {
      return <a href={href}>{button}</a>;
    }

    return button;
  },
};
