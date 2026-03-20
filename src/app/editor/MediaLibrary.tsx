"use client";

import { useRef, useState, useTransition } from "react";
import { File as FileIcon, Trash2, Copy } from "lucide-react";
import { uploadMediaAction, deleteMediaAction } from "../../lib/actions";
import type { Media } from "../../generated/prisma/client";
import { runAction } from "./runAction";
import { ResourceCard, NewResourceCard, formatRelativeTime } from "./ResourceCard";

type MediaWithUrl = Media & { url: string };

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

  return (
    <NewResourceCard
      label="Upload File"
      loadingLabel="Uploading..."
      disabled={disabled}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelected(file);
          e.target.value = "";
        }}
        disabled={disabled}
      />
    </NewResourceCard>
  );
}

function MediaCard({
  file,
  onDelete,
  disabled,
}: {
  file: MediaWithUrl;
  onDelete: (file: MediaWithUrl) => void;
  disabled: boolean;
}) {
  const isImage = file.contentType?.startsWith("image/");
  const createdDate = formatRelativeTime(new Date(file.createdAt));

  return (
    <ResourceCard
      preview={
        isImage ? (
          <img
            src={file.url}
            alt={file.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <FileIcon className="h-10 w-10 text-gray-400" />
        )
      }
      name={file.name}
      date={`${createdDate} \u00B7 ${formatFileSize(file.size)}`}
      actions={
        <>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(file.url)}
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
        </>
      }
    />
  );
}

export function MediaLibrary({ files: initialFiles }: { files: MediaWithUrl[] }) {
  const [isPending, startTransition] = useTransition();
  const [files, setFiles] = useState(initialFiles);

  function handleUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    startTransition(async () => {
      const result = await runAction(uploadMediaAction(formData));
      if (result.success) {
        setFiles((prev) => [result.data, ...prev]);
      } else {
        alert(result.error);
      }
    });
  }

  function handleDelete(file: MediaWithUrl) {
    if (!window.confirm(`Delete "${file.name}"?`)) return;
    startTransition(async () => {
      const result = await runAction(deleteMediaAction({ id: file.id }));
      if (result.success) {
        setFiles((prev) => prev.filter((f) => f.id !== file.id));
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
            key={file.id}
            file={file}
            onDelete={handleDelete}
            disabled={isPending}
          />
        ))}
      </div>
    </div>
  );
}
