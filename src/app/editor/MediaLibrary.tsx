"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { File as FileIcon, Trash2, Copy, Pencil } from "lucide-react";
import { toast } from "sonner";
import { uploadMediaAction, deleteMediaAction, renameMediaAction } from "../../lib/media/actions";
import type { MediaWithUrl } from "@/components/puck/media-context";
import { runAction } from "./runAction";
import { ResourceCard, NewResourceCard } from "./ResourceCard";
import { formatRelativeTime, formatFileSize } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { useDialogs } from "@/components/ui/dialog-provider";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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

function RenameMediaDialog({
  file,
  open,
  pending,
  onClose,
  onSubmit,
}: {
  file: MediaWithUrl | null;
  open: boolean;
  pending: boolean;
  onClose: () => void;
  onSubmit: (values: { name: string; fileName: string }) => void;
}) {
  const [name, setName] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (!file || !open) {
      return;
    }

    setName(file.name);
    setFileName(file.fileStem);
  }, [file, open]);

  const extensionLabel = file?.fileExtension ? `.${file.fileExtension}` : "";
  const trimmedName = name.trim();
  const trimmedFileName = fileName.trim();
  const unchanged = file
    ? trimmedName === file.name && trimmedFileName === file.fileStem
    : true;

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && !pending && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{file ? `Rename "${file.name}"` : "Rename media"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit({ name: trimmedName, fileName: trimmedFileName });
          }}
        >
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">
                Display name
              </label>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoFocus
                disabled={pending}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">
                File name
              </label>
              <div className="relative">
                <Input
                  value={fileName}
                  onChange={(event) => setFileName(event.target.value)}
                  disabled={pending}
                  className={extensionLabel ? "pr-16" : undefined}
                />
                {extensionLabel && (
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center rounded-r-md border-l bg-muted px-3 text-sm text-muted-foreground">
                    {extensionLabel}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending || unchanged}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function MediaLibrary({ files: initialFiles }: { files: MediaWithUrl[] }) {
  const [isPending, startTransition] = useTransition();
  const [files, setFiles] = useState(initialFiles);
  const [fileToRename, setFileToRename] = useState<MediaWithUrl | null>(null);
  const { confirm, alert } = useDialogs();

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

  function handleRename(file: MediaWithUrl) {
    setFileToRename(file);
  }

  function submitRename(values: { name: string; fileName: string }) {
    if (!fileToRename) {
      return;
    }

    startTransition(async () => {
      const result = await runAction(
        renameMediaAction({
          id: fileToRename.id,
          name: values.name.trim(),
          fileName: values.fileName.trim(),
        }),
      );

      if (result.success) {
        setFiles((prev) => prev.map((file) => (file.id === result.data.id ? result.data : file)));
        setFileToRename(null);
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

      <RenameMediaDialog
        file={fileToRename}
        open={fileToRename !== null}
        pending={isPending}
        onClose={() => setFileToRename(null)}
        onSubmit={submitRename}
      />
    </div>
  );
}
