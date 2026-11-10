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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDialogs } from "@/components/ui/dialog-provider";
import { splitStoragePath, normalizeFileName, validateFileName } from "@/lib/media-path";

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


/**
 * Dialog for renaming a media item. Collects two independent values:
 *  - `name`: the display name (the `Media.name` column, just a label)
 *  - `fileName`: the file name WITHOUT its extension (part of `storagePath`)
 *
 * The extension is shown beside the file name input as static text, so users
 * can't change it. The server must also re-attach the extension itself
 * from the stored record, and never trust one sent by the client.
 *
 * This component only collects input. It never calls the server. The parent
 * decides what to do with the values via `onSubmit`.
 *
 * Mount it only while a rename is in progress (see `renamingFile` in
 * `MediaLibrary`). The inputs read their starting values from `file` once,
 * so a fresh mount per file keeps them from showing stale values. The `key`
 * prop on the call site enforces this.
 *
 * @param file     The media item being renamed.
 * @param onSubmit Called with trimmed values when the user clicks Save.
 * @param onCancel Called on Cancel, Escape, or clicking outside the dialog.
 */
function RenameMediaDialog({
  file,
  onSubmit,
  onCancel,
}: {
  file: MediaWithUrl;
  onSubmit: (values: { name: string; fileName: string }) => void;
  onCancel: () => void;
}) {
  const { base, ext } = splitStoragePath(file.storagePath);
  const [name, setName] = useState(file.name);
  const [fileName, setFileName] = useState(base);
  const normalized = normalizeFileName(fileName);
  const fileNameError = validateFileName(normalized);

  return (
    <Dialog open onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename</DialogTitle>
        </DialogHeader>
          <form
  onSubmit={(e) => {
    e.preventDefault();
    if (fileNameError) return;
    onSubmit({ name: name.trim(), fileName: normalized });
  }}
>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Display name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
            </div>
            <div className="grid gap-2">
  <label className="text-sm font-medium">File name</label>
  <div className="flex items-center gap-2">
    <Input
      value={fileName}
      onChange={(e) => setFileName(e.target.value)}
      onFocus={(e) => e.target.select()}
      aria-invalid={fileNameError !== null}
    />
    <span className="text-sm text-muted-foreground">{ext}</span>
  </div>
  {fileNameError && (
    <p className="text-sm text-destructive">{fileNameError}</p>
  )}
</div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={fileNameError !== null}>Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


export function MediaLibrary({ files: initialFiles }: { files: MediaWithUrl[] }) {
  const [isPending, startTransition] = useTransition();
  const [files, setFiles] = useState(initialFiles);
  const [renamingFile, setRenamingFile] = useState<MediaWithUrl | null>(null);
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

  /**
 * Handles the rename dialog's Save action.
 *
 * Closes the dialog, works out what actually changed, and saves it.
 *
 * Current behavior (work in progress):
 *  - Display name changed: saved via `renameMediaAction`, and local state updated.
 *  - File name changed: NOT saved yet. `fileNameChanged` is computed but unused
 *    until `renameMediaAction` accepts a file name (it must move the object in
 *    Supabase Storage and update `storagePath`).
 */
  async function handleRenameSubmit(
  file: MediaWithUrl,
  values: { name: string; fileName: string }
) {
  setRenamingFile(null); // close the dialog

  const { base } = splitStoragePath(file.storagePath);
  const nameChanged = values.name !== "" && values.name !== file.name;
  const fileNameChanged = values.fileName !== "" && values.fileName !== base;

  if (!nameChanged && !fileNameChanged) return;

  startTransition(async () => {
    const result = await runAction(
      renameMediaAction({
        id: file.id,
        // Only send what changed. The server re-checks everything anyway.
        ...(nameChanged && { name: values.name }),
        ...(fileNameChanged && { fileName: values.fileName }),
      })
    );
    if (result.success) {
      // Use the server's record, so storagePath and url are fresh too.
      setFiles((prev) => prev.map((f) => (f.id === file.id ? result.data : f)));
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
            onRename={(file) => setRenamingFile(file)}
            onDelete={handleDelete}
            disabled={isPending}
          />
        ))}
      </div>

      {renamingFile && (
        <RenameMediaDialog
          key={renamingFile.id}
          file={renamingFile}
          onSubmit={(values) => handleRenameSubmit(renamingFile, values)}
          onCancel={() => setRenamingFile(null)}
        />
      )}
    </div>
  );
}
