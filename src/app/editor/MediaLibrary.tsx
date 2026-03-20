"use client";

import { useRef, useState, useTransition } from "react";
import { File as FileIcon, Trash2, Copy, Pencil } from "lucide-react";
import { toast } from "sonner";
import { uploadMediaAction, deleteMediaAction, renameMediaAction } from "../../lib/actions";
import type { Media } from "../../generated/prisma/client";
import { runAction } from "./runAction";
import { ResourceCard, NewResourceCard, ActionButton, formatRelativeTime } from "./ResourceCard";
import { useDialogs } from "@/components/ui/dialog-provider";

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
  onRename,
  onDelete,
  disabled,
}: {
  file: MediaWithUrl;
  onRename: (file: MediaWithUrl) => void;
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
          <ActionButton onClick={() => onRename(file)} disabled={disabled} title="Rename">
            <Pencil className="h-3 w-3" />
          </ActionButton>
          <ActionButton onClick={() => { navigator.clipboard.writeText(file.url); toast.success("URL copied"); }} title="Copy URL">
            <Copy className="h-3 w-3" />
          </ActionButton>
          <ActionButton onClick={() => onDelete(file)} disabled={disabled} title="Delete" variant="danger">
            <Trash2 className="h-3 w-3" />
          </ActionButton>
        </>
      }
    />
  );
}

export function MediaLibrary({ files: initialFiles }: { files: MediaWithUrl[] }) {
  const [isPending, startTransition] = useTransition();
  const [files, setFiles] = useState(initialFiles);
  const { confirm, prompt, alert } = useDialogs();

  function handleUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    startTransition(async () => {
      const result = await runAction(uploadMediaAction(formData));
      if (result.success) {
        setFiles((prev) => [result.data, ...prev]);
      } else {
        await alert(result.error);
      }
    });
  }

  async function handleRename(file: MediaWithUrl) {
    const newName = await prompt({ title: "Rename file", defaultValue: file.name });
    if (newName === null || newName.trim() === "" || newName.trim() === file.name) return;
    startTransition(async () => {
      const result = await runAction(renameMediaAction({ id: file.id, name: newName.trim() }));
      if (result.success) {
        setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, name: newName.trim() } : f)));
      } else {
        await alert(result.error);
      }
    });
  }

  async function handleDelete(file: MediaWithUrl) {
    if (!await confirm({ message: `Delete "${file.name}"?`, actionLabel: "Delete" })) return;
    startTransition(async () => {
      const result = await runAction(deleteMediaAction({ id: file.id }));
      if (result.success) {
        setFiles((prev) => prev.filter((f) => f.id !== file.id));
      } else {
        await alert(result.error);
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
            onRename={handleRename}
            onDelete={handleDelete}
            disabled={isPending}
          />
        ))}
      </div>
    </div>
  );
}
