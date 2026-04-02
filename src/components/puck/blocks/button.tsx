import type { ComponentConfig } from "@puckeditor/core";
import { defineProps, responsive, field } from "@/lib/puck/define-props";
import type { ResponsiveValue } from "@/lib/puck/responsive";
import { resolveResponsive } from "@/lib/puck/responsive-tailwind";
import { defineToken, type TokenValue } from "@/lib/puck/tokens";
import { cn } from "@/lib/utils";

const size = defineToken({
  sm: {
    label: "Small",
    classes: "w-fit min-h-12 px-6",
  },
  default: {
    label: "Default",
    classes: "w-fit min-h-16 px-8",
  },
  lg: {
    label: "Large",
    classes: "w-fit min-h-20 px-12",
  },
  fill: {
    label: "Fill",
    classes: "w-full min-h-16 px-8",
  },
}, "default");
type Size = TokenValue<typeof size>;

type PuckButtonProps = {
  label: string;
  href: string;
  size: ResponsiveValue<Size>;
};

const props = defineProps({
  label: field.raw({ type: "text", label: "Label" }, "Click me"),
  href: field.raw({ type: "text", label: "Link URL" }, ""),
  size: responsive.select(size, { label: "Size", default: "default" }),
});

export const PuckButton: ComponentConfig<PuckButtonProps> = {
  label: "Button",
  ...props,
  render: ({ label, href, size: s, puck }) => {
    const className = cn(
      "box-border flex h-fit max-w-full items-center justify-center rounded-[6.8px] border-0 bg-sga-red py-0 text-center text-[17px] font-normal leading-normal tracking-[0.12em] text-white uppercase no-underline antialiased [backface-visibility:hidden] transition-opacity duration-100 ease-linear break-words",
      resolveResponsive(s, size.classes),
      href ? "cursor-pointer hover:opacity-90 focus-visible:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sga-red" : undefined,
    );

    if (href) {
      return (
        <a
          ref={puck.dragRef}
          href={href}
          className={className}
        >
          {label}
        </a>
      );
    }

    return (
      <div
        ref={puck.dragRef}
        className={className}
      >
        {label}
      </div>
    );
  },
};
