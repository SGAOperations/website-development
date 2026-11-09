"use client";

import { useRef, useState, useTransition } from "react";
import { File as FileIcon, Trash2, Copy, Pencil, ScanText } from "lucide-react";
import { toast } from "sonner";
import { uploadMediaAction, deleteMediaAction, renameMediaAction, updateMediaAltTextAction } from "../../lib/media/actions";
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
  onEditAltText,
  onDelete,
  disabled,
}: {
  file: MediaWithUrl;
  onRename: (file: MediaWithUrl) => void;
  onEditAltText: (file: MediaWithUrl) => void;
  onDelete: (file: MediaWithUrl) => void;
  disabled: boolean;
}) {
  const isImage = file.contentType?.startsWith("image/");
  const createdDate = formatRelativeTime(new Date(file.createdAt));

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(file.url);
      toast.success("URL copied");
    } catch {
      toast.error("Couldn't copy the URL. Open the file and copy it from the address bar.", { duration: Infinity, closeButton: true });
    }
  }

  return (
    <ResourceCard
      preview={
        isImage ? (
          <img
            src={file.url}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <FileIcon className="h-10 w-10 text-muted-foreground" />
        )
      }
      name={file.name}
      date={`${createdDate} \u00B7 ${formatFileSize(file.size)}${isImage && !file.altText ? " \u00B7 No alt text" : ""}`}
      href={file.url}
      external
      actions={
        <>
          <Button variant="ghost" size="icon-xs" onClick={() => onRename(file)} disabled={disabled} title="Rename" aria-label={`Rename ${file.name}`}>
            <Pencil className="h-3 w-3" />
          </Button>
          {isImage && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onEditAltText(file)}
              disabled={disabled}
              title={file.altText ? "Edit alt text" : "Add alt text"}
              aria-label={`${file.altText ? "Edit" : "Add"} alt text for ${file.name}`}
            >
              <ScanText className="h-3 w-3" />
            </Button>
          )}
          <Button variant="ghost" size="icon-xs" onClick={copyUrl} title="Copy URL" aria-label={`Copy URL of ${file.name}`}>
            <Copy className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon-xs" className="hover:text-destructive" onClick={() => onDelete(file)} disabled={disabled} title="Delete" aria-label={`Delete ${file.name}`}>
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
        toast.success(`Uploaded ${result.data.name}`);
        // Ask for a description while the image is fresh in mind (ATAG B.2.3); skipping is fine.
        if (result.data.contentType?.startsWith("image/")) void handleEditAltText(result.data);
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
        toast.success(`Renamed to ${newName.trim()}`);
      } else {
        await alert(result.error);
      }
    });
  }

  async function handleEditAltText(file: MediaWithUrl) {
    const altText = await prompt({
      title: `Alt text for "${file.name}"`,
      description: "Describe what the image shows for people who can't see it. Image blocks use this unless they set their own. Leave blank if the image is purely decorative.",
      label: "Alt text",
      defaultValue: file.altText ?? "",
    });
    if (altText === null || altText.trim() === (file.altText ?? "")) return;
    startTransition(async () => {
      const result = await runAction(updateMediaAltTextAction({ id: file.id, altText }));
      if (result.success) {
        setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, altText: altText.trim() || null } : f)));
        toast.success(altText.trim() ? "Alt text saved" : "Alt text removed");
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
        toast.success(`Deleted ${file.name}`);
        // The card that had focus is gone; put focus somewhere predictable (WCAG 2.4.3).
        document.getElementById("media-heading")?.focus();
      } else {
        await alert(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 id="media-heading" tabIndex={-1} className="text-2xl font-bold">Media</h2>

      <div className="resource-card-grid grid gap-2">
        <UploadCard onFileSelected={handleUpload} disabled={isPending} />

        {files.map((file) => (
          <MediaCard
            key={file.id}
            file={file}
            onRename={handleRename}
            onEditAltText={handleEditAltText}
            onDelete={handleDelete}
            disabled={isPending}
          />
        ))}
      </div>
    </div>
  );
}
