"use client";

import { useRef, useState, useTransition } from "react";
import { FieldLabel, type CustomField } from "@puckeditor/core";
import { ImageIcon, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMedia, type MediaWithUrl } from "@/components/puck/media-context";
import { uploadMediaAction } from "@/lib/media/actions";
import { runAction } from "@/app/editor/runAction";
import { toast } from "sonner";
import {
  ResourceCard,
  NewResourceCard,
  formatRelativeTime,
  formatFileSize,
} from "@/app/editor/ResourceCard";
import { cn } from "@/lib/utils";

type ImageValue = { mediaId: number; url: string } | null;

function MediaPickerDialog({
  open,
  onSelect,
  onClose,
}: {
  open: boolean;
  onSelect: (media: MediaWithUrl) => void;
  onClose: () => void;
}) {
  const { imageMedia, addMedia } = useMedia();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, startTransition] = useTransition();

  function handleUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    startTransition(async () => {
      const result = await runAction(uploadMediaAction(formData));
      if (result.success) {
        addMedia(result.data);
        onSelect(result.data);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choose image</DialogTitle>
        </DialogHeader>

        <div className="grid max-h-96 grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-2 overflow-y-auto p-0.5">
          <NewResourceCard
            label="Upload File"
            loadingLabel="Uploading..."
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
                e.target.value = "";
              }}
            />
          </NewResourceCard>

          {imageMedia.map((m) => {
            const date = `${formatRelativeTime(new Date(m.createdAt))} · ${formatFileSize(m.size)}`;

            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onSelect(m)}
                className="cursor-pointer rounded-xl text-left ring-2 ring-transparent transition hover:ring-primary focus-visible:ring-primary"
              >
                <ResourceCard
                  preview={
                    <img
                      src={m.url}
                      alt={m.name}
                      className="h-full w-full object-cover"
                    />
                  }
                  name={m.name}
                  date={date}
                />
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MediaFieldRender({
  label,
  value,
  onChange,
  readOnly,
}: {
  label: string;
  value: ImageValue;
  onChange: (value: ImageValue) => void;
  readOnly?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { getMedia } = useMedia();
  const { mediaId, url } = value ?? {};
  const hasValue = value !== null;
  const media = mediaId !== undefined ? getMedia(mediaId) : undefined;
  const unresolved = hasValue && !media;
  const displayName = media?.name ?? (unresolved ? "Unknown image" : "Choose image…");

  return (
    <FieldLabel label={label} el="div" readOnly={readOnly}>
      <div
        className={cn(
          "flex items-stretch overflow-hidden rounded-[4px] border border-(--puck-color-grey-09)",
          unresolved && "bg-destructive/10 border-destructive/50",
        )}
      >
        <div className="flex w-10 shrink-0 items-center justify-center overflow-hidden bg-muted">
          {url ? (
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="size-4 text-muted-foreground" />
          )}
        </div>
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center px-3 py-3 text-left transition hover:bg-muted/50 disabled:pointer-events-none disabled:opacity-50"
          onClick={() => setOpen(true)}
          disabled={readOnly}
        >
          <span className="truncate text-sm text-muted-foreground" title={displayName}>
            {displayName}
          </span>
        </button>

        {hasValue && (
          <button
            type="button"
            className="flex items-center border-l px-2 text-muted-foreground transition hover:bg-muted/50 hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
            onClick={() => onChange(null)}
            disabled={readOnly}
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      <MediaPickerDialog
        open={open}
        onSelect={(media) => {
          onChange({ mediaId: media.id, url: media.url });
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
      />
    </FieldLabel>
  );
}

export function mediaField(label: string): CustomField<ImageValue> {
  return {
    type: "custom",
    label,
    render: ({ value, onChange, readOnly }) => (
      <MediaFieldRender
        label={label}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
      />
    ),
  };
}
