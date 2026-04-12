"use client";

import { useState } from "react";
import { Folder as FolderIcon, ChevronRight, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { FolderSummary } from "@/lib/folders/queries";

export type MoveTarget = {
  type: "document" | "folder";
  id: number;
  name: string;
  currentFolderId: number | null;
};

export function MoveToFolderDialog({
  target,
  folders,
  excludeFolderIds,
  onSelect,
  onCancel,
}: {
  target: MoveTarget;
  folders: FolderSummary[];
  excludeFolderIds: Set<number>;
  onSelect: (folderId: number | null) => void;
  onCancel: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(target.currentFolderId);
  const [expanded, setExpanded] = useState<Set<number>>(() => {
    // Auto-expand the path to the current folder
    const set = new Set<number>();
    const folderMap = new Map(folders.map((f) => [f.id, f]));
    let current = target.currentFolderId !== null ? folderMap.get(target.currentFolderId) : undefined;
    while (current) {
      if (current.parentId !== null) set.add(current.parentId);
      current = current.parentId !== null ? folderMap.get(current.parentId) : undefined;
    }
    return set;
  });

  const canSubmit = selected !== target.currentFolderId;

  function toggleExpanded(id: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function renderTree(parentId: number | null, depth: number) {
    const children = folders
      .filter((f) => f.parentId === parentId && !excludeFolderIds.has(f.id));

    if (children.length === 0) return null;

    return children.map((folder) => {
      const hasChildren = folders.some(
        (f) => f.parentId === folder.id && !excludeFolderIds.has(f.id)
      );
      const isExpanded = expanded.has(folder.id);
      const isSelected = selected === folder.id;

      return (
        <div key={folder.id}>
          <button
            type="button"
            className={`flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-sm hover:bg-muted ${
              isSelected ? "bg-primary/10 font-medium text-primary" : ""
            }`}
            style={{ paddingLeft: `${depth * 1.25 + 0.5}rem` }}
            onClick={() => setSelected(folder.id)}
          >
            {hasChildren ? (
              <button
                type="button"
                className="shrink-0 rounded p-0.5 hover:bg-muted-foreground/20"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpanded(folder.id);
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </button>
            ) : (
              <span className="w-4" />
            )}
            <FolderIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">{folder.name}</span>
          </button>
          {isExpanded && renderTree(folder.id, depth + 1)}
        </div>
      );
    });
  }

  return (
    <Dialog open onOpenChange={() => onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move &ldquo;{target.name}&rdquo;</DialogTitle>
        </DialogHeader>

        <div className="max-h-64 overflow-y-auto rounded border p-1">
          <button
            type="button"
            className={`flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-sm hover:bg-muted ${
              selected === null ? "bg-primary/10 font-medium text-primary" : ""
            }`}
            onClick={() => setSelected(null)}
          >
            <span className="w-4" />
            <FolderIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span>Root</span>
          </button>
          {renderTree(null, 1)}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button disabled={!canSubmit} onClick={() => onSelect(selected)}>
            Move
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function getDescendantIds(
  folders: FolderSummary[],
  folderId: number
): Set<number> {
  const result = new Set<number>([folderId]);
  let added = true;
  while (added) {
    added = false;
    for (const f of folders) {
      if (f.parentId !== null && result.has(f.parentId) && !result.has(f.id)) {
        result.add(f.id);
        added = true;
      }
    }
  }
  return result;
}
