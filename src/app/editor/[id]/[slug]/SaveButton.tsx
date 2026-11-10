"use client";

import { cn } from "@/lib/utils";
import { useDocumentContext } from "./document-context";
import { useEditorSaveContext } from "./editor-save-context";

export function SaveButton() {
  const { isArchived } = useDocumentContext();
  const { canSave, isSaving, save } = useEditorSaveContext();
  const isDisabled = isSaving || isArchived;

  return (
    <button
      onClick={save}
      disabled={isDisabled}
      className={cn(
        "px-3 py-1.5 text-white text-sm rounded transition disabled:opacity-50 disabled:cursor-not-allowed",
        canSave ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 hover:bg-gray-700",
      )}
    >
      {isArchived ? "Archived" : isSaving ? "Saving..." : "Save"}
    </button>
  );
}
