import type { ComponentConfig } from "@puckeditor/core";
import { cn } from "@/lib/utils";
import { defineProps, field, responsive } from "@/lib/puck/define-props";
import {
  createResponsiveStyle,
  mapResponsiveValue,
  mergeResponsiveStyles,
  normalizeLegacyRatioValue,
  ratioValueToCss,
  type RatioValue,
} from "@/lib/puck/style-values";
import { type ResponsiveValue } from "@/lib/puck/responsive";
import { defineToken, type TokenValue, radius, type Radius } from "@/lib/puck/tokens";
import { ImageIcon } from "lucide-react";
import { mediaField } from "@/components/puck/fields/media-field";

const objectFit = defineToken({
  cover:   { label: "Cover", classes: "object-cover" },
  contain: { label: "Contain", classes: "object-contain" },
  fill:    { label: "Fill", classes: "object-fill" },
});
type ObjectFit = TokenValue<typeof objectFit>;

type MediaProps = {
  image: { mediaId: number; url: string } | null;
  alt: string;
  objectFit: ObjectFit;
  aspectRatio: ResponsiveValue<RatioValue>;
  radius: Radius;
};

const props = defineProps({
  image: field.raw(mediaField("Image"), null),
  alt: field.raw({ type: "text", label: "Alt text" }, ""),
  objectFit: field.select(objectFit, { label: "Object fit" }),
  aspectRatio: responsive.ratio({ label: "Aspect ratio", default: { mode: "none" } }),
  radius: field.select(radius, { label: "Corners" }),
});

function MediaRenderer({
  image,
  alt,
  objectFit: fit,
  aspectRatio: ratio,
  radius: r,
}: MediaProps) {
  const { url, mediaId } = image ?? {};
  const aspectRatioStyles = mergeResponsiveStyles(
    createResponsiveStyle(
      "puck-aspect-ratio",
      "puck-aspect-ratio",
      mapResponsiveValue(normalizeLegacyRatioValue(ratio), ratioValueToCss),
    ),
  );

  const wrapperClass = cn(
    "relative h-full w-full overflow-hidden",
    aspectRatioStyles.className,
    radius.classes[r],
  );

  if (!url) {
    return (
      <div
        className={cn(
          wrapperClass,
          "flex min-h-32 items-center justify-center bg-muted",
        )}
        style={aspectRatioStyles.style}
      >
        <ImageIcon className="size-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={wrapperClass} style={aspectRatioStyles.style}>
      <img
        src={url}
        alt={alt}
        className={cn("h-full w-full", objectFit.classes[fit])}
      />
    </div>
  );
}

export const Media: ComponentConfig<MediaProps> = {
  label: "Image",
  ...props,
  render: (props) => <MediaRenderer {...props} />,
};
