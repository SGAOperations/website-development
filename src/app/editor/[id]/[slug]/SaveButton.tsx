"use client";

import { createUsePuck } from "@puckeditor/core";
import { useTransition } from "react";
import { toast } from "sonner";
import { useDocumentContext } from "./document-context";
import { saveVersionAction } from "../../../../lib/documents/actions";
import { getEditorUrl, getPreviewUrl } from "../../../../lib/editor-url";
import { runAction } from "../../runAction";
import { useDialogs } from "@/components/ui/dialog-provider";

const usePuck = createUsePuck();

export function SaveButton() {
  const data = usePuck((s) => s.appState.data);
  const { documentId, documentName, isArchived, isDirty, addVersion } = useDocumentContext();
  const { alert } = useDialogs();

  const [isSaving, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      const result = await runAction(saveVersionAction({ documentId, content: data }));

      if (result.success === false) {
        await alert(result.error);
        return;
      }

      addVersion(result.data.version);
      window.history.replaceState(window.history.state, "", getEditorUrl(documentId, documentName, result.data.version.id));

      const previewUrl = getPreviewUrl(documentId, documentName, result.data.version.id);
      toast.success("Saved", {
        action: {
          label: "Preview",

          onClick: () => {
            window.open(previewUrl, "_blank");
          },
        },
      });
    });
  };

  return (
    <button
      onClick={handleSave}
      disabled={isSaving || isArchived || !isDirty}
      className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      {isArchived ? "Archived" : isSaving ? "Saving..." : "Save"}
    </button>
  );
}
