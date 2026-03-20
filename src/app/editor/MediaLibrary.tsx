"use client";

import { useRef, useState, useTransition } from "react";
import { File as FileIcon, Trash2, Copy } from "lucide-react";
import { uploadMediaAction, deleteMediaAction } from "../../lib/media-actions";
import type { MediaFile } from "../../lib/types";
import { runAction } from "./runAction";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function UploadCard({
  onFileSelected,
  disabled,
}: {
  onFileSelected: (file: File) => void;
  disabled: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
    e.target.value = "";
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      disabled={disabled}
      className="flex h-48 w-32 shrink-0 cursor-pointer rounded-lg flex-col items-center justify-center border border-dashed border-gray-400 bg-white p-4 text-center text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="text-3xl leading-none">+</span>
      <span className="mt-2 text-sm font-medium">
        {disabled ? "Uploading..." : "Upload File"}
      </span>
      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={handleChange}
        disabled={disabled}
      />
    </button>
  );
}

function MediaCard({
  file,
  onDelete,
  disabled,
}: {
  file: MediaFile;
  onDelete: (file: MediaFile) => void;
  disabled: boolean;
}) {
  const isImage = file.contentType?.startsWith("image/");

  function handleCopyUrl() {
    navigator.clipboard.writeText(file.url);
  }

  return (
    <div className="flex h-48 w-32 shrink-0 flex-col rounded-lg bg-gray-100 overflow-hidden">
      <div className="flex h-28 items-center justify-center bg-gray-200">
        {isImage ? (
          <img
            src={file.url}
            alt={file.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <FileIcon className="h-10 w-10 text-gray-400" />
        )}
      </div>

      <div className="flex flex-1 flex-col p-2">
        <span className="truncate text-xs font-medium" title={file.name}>
          {file.name}
        </span>
        <span className="text-xs text-gray-500">
          {formatFileSize(file.size)}
        </span>

        <div className="mt-auto flex gap-1">
          <button
            type="button"
            onClick={handleCopyUrl}
            className="rounded p-1 text-gray-500 hover:text-blue-600"
            title="Copy URL"
          >
            <Copy className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(file)}
            disabled={disabled}
            className="rounded p-1 text-gray-500 hover:text-red-600 disabled:opacity-50"
            title="Delete"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function MediaLibrary({ files: initialFiles }: { files: MediaFile[] }) {
  const [isPending, startTransition] = useTransition();
  const [files, setFiles] = useState(initialFiles);

  function handleUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    startTransition(async () => {
      const result = await runAction(uploadMediaAction(formData));
      if (result.success) {
        setFiles((prev) => [...prev, result.data]);
      } else {
        alert(result.error);
      }
    });
  }

  function handleDelete(file: MediaFile) {
    if (!window.confirm(`Delete "${file.name}"?`)) return;
    startTransition(async () => {
      const result = await runAction(deleteMediaAction({ name: file.name }));
      if (result.success) {
        setFiles((prev) => prev.filter((f) => f.name !== file.name));
      } else {
        alert(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Media</h1>

      <div className="flex flex-wrap gap-2">
        <UploadCard onFileSelected={handleUpload} disabled={isPending} />

        {files.map((file) => (
          <MediaCard
            key={file.name}
            file={file}
            onDelete={handleDelete}
            disabled={isPending}
          />
        ))}
      </div>
    </div>
  );
}
