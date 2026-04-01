"use client";

import { useDocumentContext } from "./document-context";
import { useEditorSaveContext } from "./editor-save-context";

export function SaveButton() {
  const { isArchived } = useDocumentContext();
  const { canSave, isSaving, save } = useEditorSaveContext();

  return (
    <button
      onClick={save}
      disabled={isSaving || isArchived || !canSave}
      className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      {isArchived ? "Archived" : isSaving ? "Saving..." : "Save"}
    </button>
  );
}
