"use client";

import { useRef, useState, useTransition } from "react";
import { File as FileIcon, Trash2, Copy, Pencil } from "lucide-react";
import { toast } from "sonner";
import { uploadMediaAction, deleteMediaAction, renameMediaAction } from "../../lib/media/actions";
import type { MediaWithUrl } from "@/components/puck/media-context";
import { runAction } from "./runAction";
import { ResourceCard, NewResourceCard } from "./ResourceCard";
import { formatRelativeTime, formatFileSize } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { useDialogs } from "@/components/ui/dialog-provider";

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
          <FileIcon className="h-10 w-10 text-muted-foreground" />
        )
      }
      name={file.name}
      date={`${createdDate} \u00B7 ${formatFileSize(file.size)}`}
      href={file.url}
      external
      actions={
        <>
          <Button variant="ghost" size="icon-xs" onClick={() => onRename(file)} disabled={disabled} title="Rename">
            <Pencil className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon-xs" onClick={() => { navigator.clipboard.writeText(file.url); toast.success("URL copied"); }} title="Copy URL">
            <Copy className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon-xs" className="hover:text-destructive" onClick={() => onDelete(file)} disabled={disabled} title="Delete">
            <Trash2 className="h-3 w-3" />
          </Button>
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
    const newName = await prompt({ title: `Rename "${file.name}"`, label: "New name", defaultValue: file.name });
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
    if (!await confirm({ message: `Delete "${file.name}"?`, actionLabel: "Delete", destructive: true })) return;
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

      <div className="resource-card-grid grid gap-2">
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
