"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  upload: (file: File) => void | Promise<void>;
  onError: (message: string) => void;
  disabled?: boolean;
};

export function DropzoneUploadCard({ upload, onError, disabled = false }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const uploadInFlight = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const busy = disabled || isUploading;

  async function handleFiles(files: File[]) {
    if (busy || uploadInFlight.current || files.length === 0) return;

    if (files.length !== 1) {
      onError("Please upload one image at a time.");
      return;
    }

    const file = files[0];

    if (!file.type.startsWith("image/")) {
      onError("Please choose an image file.");
      return;
    }

    uploadInFlight.current = true;
    setIsUploading(true);

    try {
      await upload(file);
    } catch (error) {
      onError(
        error instanceof Error ? error.message : "Unable to upload image."
      );
    } finally {
      uploadInFlight.current = false;
      setIsUploading(false);
    }
  }

  return (
    <div
      onDragEnter={(event) => {
        event.preventDefault();
        event.stopPropagation();
        dragDepth.current += 1;
        setIsDragging(!busy);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = busy ? "none" : "copy";
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        event.stopPropagation();
        dragDepth.current = Math.max(0, dragDepth.current - 1);
        if (dragDepth.current === 0) setIsDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        dragDepth.current = 0;
        setIsDragging(false);
        void handleFiles(Array.from(event.dataTransfer.files));
      }}
    >
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex h-48 w-full min-w-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-background p-4 text-center text-sm font-medium shadow-xs transition-colors enabled:hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-60",
          isDragging && !busy && "border-primary bg-muted ring-2 ring-primary",
        )}
        aria-busy={isUploading}
      >
        <span aria-hidden="true" className="text-3xl leading-none">+</span>
        <span aria-live="polite">
          {isUploading
            ? "Uploading…"
            : isDragging && !busy
              ? "Drop your image here"
              : "Click or drop an image"}
        </span>
        <span className="text-xs font-normal text-muted-foreground">
          One image at a time
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          const files = Array.from(event.currentTarget.files ?? []);
          event.currentTarget.value = "";
          void handleFiles(files);
        }}
        disabled={busy}
      />
    </div>
  );
}
