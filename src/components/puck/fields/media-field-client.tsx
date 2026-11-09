"use client";

import { useRef, useState, useTransition } from "react";
import { FieldLabel } from "@puckeditor/core";
import { FileIcon, X } from "lucide-react";
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
} from "@/app/editor/ResourceCard";
import { formatRelativeTime, formatFileSize } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { MediaValue } from "./media-field";

function MediaPreview({ media }: { media: MediaWithUrl }) {
  const isVideo = media.contentType?.startsWith("video/");

  if (isVideo) {
    return (
      <video
        src={media.url}
        className="h-full w-full object-cover"
        controls
      />
    );
  }

  return (
    <img
      src={media.url}
      alt={media.name}
      className="h-full w-full object-cover"
    />
  );
}

function MediaPickerDialog({
  open,
  onSelect,
  onClose,
}: {
  open: boolean;
  onSelect: (media: MediaWithUrl) => void;
  onClose: () => void;
}) {
  const { media, addMedia } = useMedia();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, startTransition] = useTransition();

  function handleUpload(file: File) {
    const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB

    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File size exceeds 1GB limit. File size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      return;
    }

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
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choose media</DialogTitle>
        </DialogHeader>

        <div className="resource-card-grid grid max-h-96 gap-2 overflow-y-auto p-0.5">
          <NewResourceCard
            label="Upload File"
            loadingLabel="Uploading..."
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*,video/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
                e.target.value = "";
              }}
            />
          </NewResourceCard>

          {media.map((m) => {
            const date = `${formatRelativeTime(new Date(m.createdAt))} · ${formatFileSize(m.size)}`;

            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onSelect(m)}
                className="cursor-pointer rounded-xl text-left ring-2 ring-transparent transition hover:ring-primary focus-visible:ring-primary"
              >
                <ResourceCard
                  preview={<MediaPreview media={m} />}
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

export function MediaFieldClient({
  label,
  value,
  onChange,
  readOnly,
}: {
  label: string;
  value: MediaValue;
  onChange: (value: MediaValue) => void;
  readOnly?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { getMedia } = useMedia();
  const { mediaId, url } = value ?? {};
  const hasValue = value !== null;
  const media = mediaId !== undefined ? getMedia(mediaId) : undefined;
  const unresolved = hasValue && !media;
  const isVideo = media?.contentType?.startsWith("video/");
  const displayName = media?.name ?? (unresolved ? "Unknown media" : "Choose media...");

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
            isVideo ? (
              <video
                src={url}
                className="h-full w-full object-cover"
              />
            ) : (
              <img src={url} alt="" className="h-full w-full object-cover" />
            )
          ) : (
            <FileIcon className="size-4 text-muted-foreground" />
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
