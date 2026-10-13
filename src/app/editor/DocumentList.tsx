"use client";

import { Fragment, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  Archive,
  ArchiveRestore,
  ChevronDown,
  ChevronRight,
  CopyPlus,
  FileText,
  Folder as FolderIcon,
  FolderInput,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  archiveDocumentAction,
  createDocumentAction,
  duplicateDocumentAction,
  moveDocumentAction,
  renameDocumentAction,
  unarchiveDocumentAction,
} from "../../lib/documents/actions";
import {
  createFolderAction,
  deleteFolderAction,
  moveFolderAction,
  renameFolderAction,
} from "../../lib/folders/actions";
import { runAction } from "./runAction";
import { getDocumentName } from "../../lib/documents/utils";
import { getEditorUrl } from "../../lib/editor-url";
import { ResourceCard, NewResourceCard } from "./ResourceCard";
import { MoveToFolderDialog, getDescendantIds } from "./MoveToFolderDialog";
import type { MoveTarget } from "./MoveToFolderDialog";
import type { FolderSummary } from "@/lib/folders/queries";
import { formatRelativeTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { useDialogs } from "@/components/ui/dialog-provider";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

type DocumentItem = {
  id: number;
  name: string | null;
  lastModified: Date | null;
  folderId: number | null;
};

// --- Breadcrumbs ---

function FolderBreadcrumbs({
  folders,
  currentFolderId,
  onNavigate,
}: {
  folders: FolderSummary[];
  currentFolderId: number | null;
  onNavigate: (folderId: number | null) => void;
}) {
  const path: { id: number | null; name: string }[] = [
    { id: null, name: "Documents" },
  ];

  if (currentFolderId !== null) {
    const folderMap = new Map(folders.map((f) => [f.id, f]));
    const segments: { id: number; name: string }[] = [];
    let current = folderMap.get(currentFolderId);
    while (current) {
      segments.unshift({ id: current.id, name: current.name });
      current =
        current.parentId !== null
          ? folderMap.get(current.parentId)
          : undefined;
    }
    path.push(...segments);
  }

  return (
    <nav className="flex items-center gap-1 text-sm">
      {path.map((segment, i) => (
        <Fragment key={segment.id ?? "root"}>
          {i > 0 && (
            <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
          )}
          {i < path.length - 1 ? (
            <button
              className="text-muted-foreground hover:text-foreground hover:underline"
              onClick={() => onNavigate(segment.id)}
            >
              {segment.name}
            </button>
          ) : (
            <span className="font-medium">{segment.name}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}

// --- Document components ---

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
      href={getEditorUrl(id, name)}
      actions={actions}
    />
  );
}

function useDocumentActions() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { prompt, alert, confirm } = useDialogs();

  async function handleRename(id: number, currentName: string) {
    const newName = await prompt({
      title: `Rename "${currentName}"`,
      label: "New name",
      defaultValue: currentName,
    });
    if (newName === null || newName.trim() === "" || newName.trim() === currentName)
      return;
    startTransition(async () => {
      const result = await runAction(
        renameDocumentAction({ id, name: newName.trim() })
      );
      if (result.success) {
        router.refresh();
      } else {
        await alert(result.error);
      }
    });
  }

  async function handleArchive(id: number, displayName: string) {
    const confirmed = await confirm({
      message: `Archive "${displayName}"?`,
      actionLabel: "Archive",
    });
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
    const confirmed = await confirm({
      message: `Unarchive "${displayName}"?`,
      actionLabel: "Unarchive",
    });
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
      const result = await runAction(
        duplicateDocumentAction({ id, name: name.trim() })
      );
      if (result.success) {
        router.refresh();
      } else {
        await alert(result.error);
      }
    });
  }

  return { isPending, handleRename, handleArchive, handleUnarchive, handleDuplicate };
}

function NewDocumentCard({ folderId }: { folderId: number | null }) {
  const router = useRouter();
  const [isCreating, startTransition] = useTransition();
  const { prompt, alert } = useDialogs();

  async function handleCreateDocument() {
    const name = await prompt({ title: "Create document", label: "Name" });

    if (name === null) return;

    const trimmedName = name.trim();
    if (!trimmedName) return;

    startTransition(async () => {
      const result = await createDocumentAction({
        name: trimmedName,
        folderId,
      });

      if (result.success === false) {
        await alert(result.error);
        return;
      }

      router.push(getEditorUrl(result.data.documentId, trimmedName));
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

// --- Folder components ---

function FolderCard({
  folder,
  onOpen,
  actions,
}: {
  folder: FolderSummary;
  onOpen: () => void;
  actions?: ReactNode;
}) {
  return (
    <Card
      className="h-48 min-w-0 cursor-pointer gap-0 py-0 transition-colors hover:bg-muted/50"
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
    >
      <div className="flex h-24 items-center justify-center bg-muted">
        <FolderIcon className="h-10 w-10 text-muted-foreground" />
      </div>
      <CardContent className="flex flex-1 flex-col px-2 py-2">
        <span className="truncate text-xs font-medium" title={folder.name}>
          {folder.name}
        </span>
        <span className="text-xs text-muted-foreground">{"\u00A0"}</span>
        {actions && (
          <CardFooter className="mt-auto gap-1 border-t-0 bg-transparent p-0">
            {actions}
          </CardFooter>
        )}
      </CardContent>
    </Card>
  );
}

function NewFolderCard({ parentId }: { parentId: number | null }) {
  const router = useRouter();
  const [isCreating, startTransition] = useTransition();
  const { prompt, alert } = useDialogs();

  async function handleCreateFolder() {
    const name = await prompt({ title: "Create folder", label: "Name" });
    if (name === null || name.trim() === "") return;
    startTransition(async () => {
      const result = await runAction(
        createFolderAction({ name: name.trim(), parentId })
      );
      if (result.success) {
        router.refresh();
      } else {
        await alert(result.error);
      }
    });
  }

  return (
    <NewResourceCard
      label="New Folder"
      loadingLabel="Creating..."
      disabled={isCreating}
      onClick={handleCreateFolder}
    />
  );
}

function useFolderActions(onNavigate: (id: number | null) => void) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { prompt, alert, confirm } = useDialogs();

  async function handleRenameFolder(id: number, currentName: string) {
    const newName = await prompt({
      title: `Rename "${currentName}"`,
      label: "New name",
      defaultValue: currentName,
    });
    if (newName === null || newName.trim() === "" || newName.trim() === currentName)
      return;
    startTransition(async () => {
      const result = await runAction(
        renameFolderAction({ id, name: newName.trim() })
      );
      if (result.success) {
        router.refresh();
      } else {
        await alert(result.error);
      }
    });
  }

  async function handleDeleteFolder(id: number, name: string, parentId: number | null) {
    const confirmed = await confirm({
      message: `Delete folder "${name}"? Contents will be moved to the parent folder.`,
      actionLabel: "Delete",
      destructive: true,
    });
    if (!confirmed) return;
    startTransition(async () => {
      const result = await runAction(deleteFolderAction({ id }));
      if (result.success) {
        onNavigate(parentId);
        router.refresh();
      } else {
        await alert(result.error);
      }
    });
  }

  return { isPending, handleRenameFolder, handleDeleteFolder };
}

// --- Main components ---

export function DocumentList({
  documents,
  folders,
}: {
  documents: DocumentItem[];
  folders: FolderSummary[];
}) {
  const router = useRouter();
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [moveTarget, setMoveTarget] = useState<MoveTarget | null>(null);
  const [isMoving, startMoveTransition] = useTransition();

  const { isPending, handleRename, handleArchive, handleDuplicate } =
    useDocumentActions();
  const {
    isPending: isFolderPending,
    handleRenameFolder,
    handleDeleteFolder,
  } = useFolderActions(setCurrentFolderId);

  const { alert } = useDialogs();

  // Reset to root if current folder no longer exists (e.g. after deletion)
  useEffect(() => {
    if (
      currentFolderId !== null &&
      !folders.some((f) => f.id === currentFolderId)
    ) {
      setCurrentFolderId(null);
    }
  }, [currentFolderId, folders]);

  const currentDocuments = documents.filter(
    (d) => d.folderId === currentFolderId
  );
  const currentSubfolders = folders.filter(
    (f) => f.parentId === currentFolderId
  );

  function handleMoveConfirm(target: MoveTarget, folderId: number | null) {
    startMoveTransition(async () => {
      const result =
        target.type === "document"
          ? await runAction(moveDocumentAction({ id: target.id, folderId }))
          : await runAction(moveFolderAction({ id: target.id, parentId: folderId }));
      if (result.success) {
        router.refresh();
      } else {
        await alert(result.error);
      }
    });
  }

  const actionDisabled = isPending || isFolderPending || isMoving;

  return (
    <div className="flex flex-col gap-4">
      <FolderBreadcrumbs
        folders={folders}
        currentFolderId={currentFolderId}
        onNavigate={setCurrentFolderId}
      />

      <div className="resource-card-grid grid gap-2">
        <NewDocumentCard folderId={currentFolderId} />
        <NewFolderCard parentId={currentFolderId} />

        {currentSubfolders.map((folder) => (
          <FolderCard
            key={`folder-${folder.id}`}
            folder={folder}
            onOpen={() => setCurrentFolderId(folder.id)}
            actions={
              <>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRenameFolder(folder.id, folder.name);
                  }}
                  disabled={actionDisabled}
                  title="Rename"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMoveTarget({
                      type: "folder",
                      id: folder.id,
                      name: folder.name,
                      currentFolderId: folder.parentId,
                    });
                  }}
                  disabled={actionDisabled}
                  title="Move"
                >
                  <FolderInput className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFolder(folder.id, folder.name, folder.parentId);
                  }}
                  disabled={actionDisabled}
                  title="Delete"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </>
            }
          />
        ))}

        {currentDocuments.map((doc) => {
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
                    disabled={actionDisabled}
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
                    disabled={actionDisabled}
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
                      setMoveTarget({
                        type: "document",
                        id: doc.id,
                        name: displayName,
                        currentFolderId: doc.folderId,
                      });
                    }}
                    disabled={actionDisabled}
                    title="Move to folder"
                  >
                    <FolderInput className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleArchive(doc.id, displayName);
                    }}
                    disabled={actionDisabled}
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

      {moveTarget && (
        <MoveToFolderDialog
          target={moveTarget}
          folders={folders}
          excludeFolderIds={
            moveTarget.type === "folder"
              ? getDescendantIds(folders, moveTarget.id)
              : new Set()
          }
          onSelect={(folderId) => {
            handleMoveConfirm(moveTarget, folderId);
            setMoveTarget(null);
          }}
          onCancel={() => setMoveTarget(null)}
        />
      )}
    </div>
  );
}

export function ArchivedDocumentList({
  documents,
}: {
  documents: DocumentItem[];
}) {
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
        <div className="resource-card-grid mt-4 grid gap-2">
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
