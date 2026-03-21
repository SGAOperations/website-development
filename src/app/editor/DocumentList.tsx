"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { FileText, Pencil } from "lucide-react";
import { createDocumentAction, renameDocumentAction } from "../../lib/actions";
import { runAction } from "./runAction";
import { getDocumentName } from "../../lib/documents";
import { ResourceCard, NewResourceCard, formatRelativeTime } from "./ResourceCard";
import { Button } from "@/components/ui/button";
import { useDialogs } from "@/components/ui/dialog-provider";

function NewDocumentCard() {
  const router = useRouter();
  const [isCreating, startTransition] = useTransition();
  const { prompt, alert } = useDialogs();

  async function handleCreateDocument() {
    const name = await prompt({ title: "Create document", label: "Name" });

    if (name === null) {
      return;
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    startTransition(async () => {
      const result = await createDocumentAction({
        name: trimmedName,
      });

      if (result.success === false) {
        await alert(result.error);
        return;
      }

      router.push(`/editor/${result.data.documentId}`);
    });
  }

  return (
    <NewResourceCard
      label="New Document"
      loadingLabel="Creating..."
      disabled={isCreating}
      onClick={handleCreateDocument}
    />
  );
}

function DocumentCard({
  id,
  name,
  lastModified,
  onRename,
  disabled,
}: {
  id: number;
  name: string | null;
  lastModified: Date | null;
  onRename: (id: number, currentName: string) => void;
  disabled: boolean;
}) {
  const displayName = getDocumentName({ id, name });

  return (
    <ResourceCard
      preview={<FileText className="h-10 w-10 text-muted-foreground" />}
      name={displayName}
      date={lastModified ? formatRelativeTime(lastModified) : "No versions"}
      href={`/editor/${id}`}
      actions={
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRename(id, displayName);
          }}
          disabled={disabled}
          title="Rename"
        >
          <Pencil className="h-3 w-3" />
        </Button>
      }
    />
  );
}

export function DocumentList({ documents }: {
  documents: { id: number; name: string | null; lastModified: Date | null }[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { prompt, alert } = useDialogs();

  async function handleRename(id: number, currentName: string) {
    const newName = await prompt({ title: `Rename "${currentName}"`, label: "New name", defaultValue: currentName });
    if (newName === null || newName.trim() === "" || newName.trim() === currentName) return;
    startTransition(async () => {
      const result = await runAction(renameDocumentAction({ id, name: newName.trim() }));
      if (result.success) {
        router.refresh();
      } else {
        await alert(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Documents</h1>

      <div className="flex flex-wrap gap-2">
        <NewDocumentCard />

        {documents.map((doc) => (
          <DocumentCard
            key={doc.id}
            id={doc.id}
            name={doc.name}
            lastModified={doc.lastModified}
            onRename={handleRename}
            disabled={isPending}
          />
        ))}
      </div>
    </div>
  );
}
