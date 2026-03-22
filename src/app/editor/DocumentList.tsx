"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Archive, ArchiveRestore, ChevronDown, CopyPlus, FileText, Pencil } from "lucide-react";
import {
  archiveDocumentAction,
  createDocumentAction,
  duplicateDocumentAction,
  renameDocumentAction,
  unarchiveDocumentAction,
} from "../../lib/actions";
import { runAction } from "./runAction";
import { getDocumentName } from "../../lib/documents";
import { ResourceCard, NewResourceCard, formatRelativeTime } from "./ResourceCard";
import { Button } from "@/components/ui/button";
import { useDialogs } from "@/components/ui/dialog-provider";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

type DocumentItem = { id: number; name: string | null; lastModified: Date | null };

function DocumentCard({
  id,
  name,
  lastModified,
  actions,
}: {
  id: number;
  name: string | null;
  lastModified: Date | null;
  actions?: ReactNode;
}) {
  const displayName = getDocumentName({ id, name });

  return (
    <ResourceCard
      preview={<FileText className="h-10 w-10 text-muted-foreground" />}
      name={displayName}
      date={lastModified ? formatRelativeTime(lastModified) : "No versions"}
      href={`/editor/${id}`}
      actions={actions}
    />
  );
}

function useDocumentActions() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { prompt, alert, confirm } = useDialogs();

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

  async function handleArchive(id: number, displayName: string) {
    const confirmed = await confirm({ message: `Archive "${displayName}"?`, actionLabel: "Archive" });
    if (!confirmed) return;
    startTransition(async () => {
      const result = await runAction(archiveDocumentAction({ id }));
      if (result.success) {
        router.refresh();
      } else {
        await alert(result.error);
      }
    });
  }

  async function handleUnarchive(id: number, displayName: string) {
    const confirmed = await confirm({ message: `Unarchive "${displayName}"?`, actionLabel: "Unarchive" });
    if (!confirmed) return;
    startTransition(async () => {
      const result = await runAction(unarchiveDocumentAction({ id }));
      if (result.success) {
        router.refresh();
      } else {
        await alert(result.error);
      }
    });
  }

  async function handleDuplicate(id: number, displayName: string) {
    const name = await prompt({
      title: "Duplicate document",
      label: "Name",
      defaultValue: `Copy of ${displayName}`,
    });
    if (name === null || name.trim() === "") return;
    startTransition(async () => {
      const result = await runAction(duplicateDocumentAction({ id, name: name.trim() }));
      if (result.success) {
        router.refresh();
      } else {
        await alert(result.error);
      }
    });
  }

  return { isPending, handleRename, handleArchive, handleUnarchive, handleDuplicate };
}

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

export function DocumentList({ documents }: { documents: DocumentItem[] }) {
  const { isPending, handleRename, handleArchive, handleDuplicate } = useDocumentActions();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Documents</h1>

      <div className="flex flex-wrap gap-2">
        <NewDocumentCard />

        {documents.map((doc) => {
          const displayName = getDocumentName(doc);
          return (
            <DocumentCard
              key={doc.id}
              id={doc.id}
              name={doc.name}
              lastModified={doc.lastModified}
              actions={
                <>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRename(doc.id, displayName);
                    }}
                    disabled={isPending}
                    title="Rename"
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDuplicate(doc.id, displayName);
                    }}
                    disabled={isPending}
                    title="Duplicate"
                  >
                    <CopyPlus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleArchive(doc.id, displayName);
                    }}
                    disabled={isPending}
                    title="Archive"
                  >
                    <Archive className="h-3 w-3" />
                  </Button>
                </>
              }
            />
          );
        })}
      </div>
    </div>
  );
}

export function ArchivedDocumentList({ documents }: { documents: DocumentItem[] }) {
  const [open, setOpen] = useState(false);
  const { isPending, handleUnarchive } = useDocumentActions();

  if (documents.length === 0) return null;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold leading-none">Archived</h2>
        <CollapsibleTrigger
          render={<Button variant="ghost" size="icon-xs" />}
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent>
        <div className="mt-4 flex flex-wrap gap-2">
          {documents.map((doc) => {
            const displayName = getDocumentName(doc);
            return (
              <DocumentCard
                key={doc.id}
                id={doc.id}
                name={doc.name}
                lastModified={doc.lastModified}
                actions={
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleUnarchive(doc.id, displayName);
                    }}
                    disabled={isPending}
                    title="Unarchive"
                  >
                    <ArchiveRestore className="h-3 w-3" />
                  </Button>
                }
              />
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
