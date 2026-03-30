"use client";

import { useRef, useTransition } from "react";
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

export function MediaPickerDialog({
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
            const date = `${formatRelativeTime(new Date(m.createdAt))} \u00B7 ${formatFileSize(m.size)}`;

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

          {imageMedia.length === 0 && (
            <p className="w-full py-8 text-center text-sm text-muted-foreground">
              No images uploaded yet
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
