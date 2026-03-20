"use client";

import { createUsePuck } from "@puckeditor/core";
import { useTransition } from "react";
import { toast } from "sonner";
import { useDocumentContext } from "./client";
import { saveVersionAction } from "../../../lib/actions";
import { runAction } from "../runAction";
import { useDialogs } from "@/components/ui/dialog-provider";

const usePuck = createUsePuck();

export function SaveButton() {
  const data = usePuck((s) => s.appState.data);
  const dispatch = usePuck((s) => s.dispatch);
  const { documentId, addVersion } = useDocumentContext();
  const { alert } = useDialogs();

  const [isSaving, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      const result = await runAction(saveVersionAction({ documentId, content: data }));

      if (result.success === false) {
        await alert(result.error);
        return;
      }

      dispatch({ type: "setData", data });
      addVersion(result.data.version);
      toast.success("Saved");
    });
  };

  return (
    <button
      onClick={handleSave}
      disabled={isSaving}
      className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      {isSaving ? "Saving..." : "Save"}
    </button>
  );
}
