import type { ComponentConfig } from "@puckeditor/core";
import { cn } from "@/lib/utils";
import { defineProps, field } from "@/lib/puck/define-props";
import { defineToken, type TokenValue, radius, type Radius } from "@/lib/puck/tokens";
import { ImageIcon } from "lucide-react";
import { mediaField } from "@/components/puck/fields/media-field";

const aspectRatio = defineToken({
  auto:   { label: "Auto", classes: "" },
  square: { label: "Square (1:1)", classes: "aspect-square" },
  photo:  { label: "Photo (4:3)", classes: "aspect-[4/3]" },
  video:  { label: "Video (16:9)", classes: "aspect-video" },
  wide:   { label: "Wide (21:9)", classes: "aspect-[21/9]" },
});
type AspectRatio = TokenValue<typeof aspectRatio>;

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
  aspectRatio: AspectRatio;
  radius: Radius;
};

const props = defineProps({
  image: field.raw(mediaField("Image"), null),
  alt: field.raw({ type: "text", label: "Alt text" }, ""),
  objectFit: field.select(objectFit, { label: "Object fit" }),
  aspectRatio: field.select(aspectRatio, { label: "Aspect ratio" }),
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

  const wrapperClass = cn(
    "relative h-full w-full overflow-hidden",
    aspectRatio.classes[ratio],
    radius.classes[r],
  );

  if (!url) {
    return (
      <div
        className={cn(
          wrapperClass,
          "flex min-h-32 items-center justify-center bg-muted",
        )}
      >
        <ImageIcon className="size-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
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
