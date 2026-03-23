import type { ComponentConfig } from "@puckeditor/core";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { fields, radiusVariants, selectFrom, type Radius } from "@/lib/puck/tokens";
import { ImageIcon } from "lucide-react";

const aspectRatioOptions = ["auto", "square", "photo", "video", "wide"] as const;
type AspectRatio = (typeof aspectRatioOptions)[number];

const objectFitOptions = ["cover", "contain", "fill"] as const;
type ObjectFit = (typeof objectFitOptions)[number];

const mediaWrapperVariants = cva("relative h-full w-full overflow-hidden", {
  variants: {
    aspectRatio: {
      auto: "",
      square: "aspect-square",
      photo: "aspect-[4/3]",
      video: "aspect-video",
      wide: "aspect-[21/9]",
    },
    radius: radiusVariants,
  },
  defaultVariants: {
    aspectRatio: "auto",
    radius: "none",
  },
});

const mediaImgVariants = cva("h-full w-full", {
  variants: {
    objectFit: {
      cover: "object-cover",
      contain: "object-contain",
      fill: "object-fill",
    },
  },
  defaultVariants: {
    objectFit: "cover",
  },
});

type MediaProps = {
  url: string;
  alt: string;
  objectFit: ObjectFit;
  aspectRatio: AspectRatio;
  radius: Radius;
};

export const Media: ComponentConfig<MediaProps> = {
  label: "Image",
  fields: {
    url: { type: "text", label: "URL" },
    alt: { type: "text", label: "Alt text" },
    objectFit: selectFrom(objectFitOptions, "Object fit"),
    aspectRatio: {
      type: "select",
      label: "Aspect ratio",
      options: [
        { label: "Auto", value: "auto" },
        { label: "Square (1:1)", value: "square" },
        { label: "Photo (4:3)", value: "photo" },
        { label: "Video (16:9)", value: "video" },
        { label: "Wide (21:9)", value: "wide" },
      ],
    },
    radius: fields.radius(),
  },
  defaultProps: {
    url: "",
    alt: "",
    objectFit: "cover",
    aspectRatio: "auto",
    radius: "none",
  },
  render: ({ url, alt, objectFit, aspectRatio, radius }) => {
    if (!url) {
      return (
        <div
          className={cn(
            mediaWrapperVariants({ aspectRatio, radius }),
            "flex min-h-32 items-center justify-center bg-muted",
          )}
        >
          <ImageIcon className="size-8 text-muted-foreground" />
        </div>
      );
    }

    return (
      <div className={cn(mediaWrapperVariants({ aspectRatio, radius }))}>
        <img
          src={url}
          alt={alt}
          className={cn(mediaImgVariants({ objectFit }))}
        />
      </div>
    );
  },
};
