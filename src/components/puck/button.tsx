import type { ComponentConfig } from "@puckeditor/core";
import { Button } from "@/components/ui/button";
import { selectFrom } from "@/lib/puck/tokens";

const variantOptions = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const;
type Variant = (typeof variantOptions)[number];

const sizeOptions = ["sm", "default", "lg"] as const;
type Size = (typeof sizeOptions)[number];

type PuckButtonProps = {
  label: string;
  href: string;
  variant: Variant;
  size: Size;
};

export const PuckButton: ComponentConfig<PuckButtonProps> = {
  label: "Button",
  fields: {
    label: { type: "text", label: "Label" },
    href: { type: "text", label: "Link URL" },
    variant: selectFrom(variantOptions, "Variant"),
    size: {
      type: "select",
      label: "Size",
      options: [
        { label: "Small", value: "sm" },
        { label: "Default", value: "default" },
        { label: "Large", value: "lg" },
      ],
    },
  },
  defaultProps: {
    label: "Click me",
    href: "",
    variant: "default",
    size: "default",
  },
  render: ({ label, href, variant, size }) => {
    const button = (
      <Button variant={variant} size={size}>
        {label}
      </Button>
    );

    if (href) {
      return <a href={href}>{button}</a>;
    }

    return button;
  },
};
