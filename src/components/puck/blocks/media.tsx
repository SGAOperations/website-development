import type { ComponentConfig } from "@puckeditor/core";
import { cn } from "@/lib/utils";
import { defineProps, field } from "@/lib/puck/define-props";
import { defineToken, type TokenValue, radius, type Radius } from "@/lib/puck/tokens";
import { ImageIcon } from "lucide-react";
import { mediaField } from "@/components/puck/fields/media-field";
import { EditorWarning } from "@/components/puck/editor-warning";
import type { ImageValue } from "@/components/puck/fields/media-field";
import { getImageAlt } from "@/lib/puck/a11y-check";

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
  image: ImageValue;
  // Decorative images get alt="" so screen readers skip them (WCAG 1.1.1).
  decorative: boolean;
  alt: string;
  objectFit: ObjectFit;
  aspectRatio: AspectRatio;
  radius: Radius;
};

const props = defineProps({
  image: field.raw(mediaField("Image"), null),
  decorative: field.raw(
    {
      type: "radio",
      label: "Decorative only",
      options: [
        { label: "No", value: false },
        { label: "Yes", value: true },
      ],
    },
    false,
  ),
  alt: field.raw({ type: "text", label: "Alt text (blank uses the media library's)" }, ""),
  objectFit: field.select(objectFit, { label: "Object fit" }),
  aspectRatio: field.select(aspectRatio, { label: "Aspect ratio" }),
  radius: field.select(radius, { label: "Corners" }),
});

function MediaRenderer({
  image,
  decorative,
  alt,
  objectFit: fit,
  aspectRatio: ratio,
  radius: r,
  isEditing,
}: MediaProps & { isEditing: boolean }) {
  const { url, mediaId } = image ?? {};
  // Falls back to the media library's alt text when the block's own field is empty.
  const altText = decorative ? "" : getImageAlt({ alt, image });

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
      {isEditing && !decorative && !altText && (
        <EditorWarning label="No alt text">Add alt text or mark as decorative</EditorWarning>
      )}
      <img
        src={url}
        // Without alt text yet, omit alt rather than alt="", which would pass the image off as decorative.
        alt={decorative ? "" : altText || undefined}
        className={cn("h-full w-full", objectFit.classes[fit])}
      />
    </div>
  );
}

export const Media: ComponentConfig<MediaProps> = {
  label: "Image",
  ...props,
  // Alt text is meaningless for decorative images, so hide the field.
  resolveFields: (data) => {
    const f = { ...Media.fields! };
    f.alt = { ...f.alt, visible: !data.props.decorative };
    return f;
  },
  render: ({ puck, ...props }) => <MediaRenderer {...props} isEditing={puck.isEditing} />,
};
