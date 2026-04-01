"use client";

import { createContext, useCallback, useContext, useTransition, type ReactNode } from "react";
import { createUsePuck } from "@puckeditor/core";
import { toast } from "sonner";
import { getEditorUrl, getPreviewUrl } from "../../../../lib/editor-url";
import { saveVersionAction } from "../../../../lib/documents/actions";
import { runAction } from "../../runAction";
import { useKeybind } from "@/hooks/useKeybind";
import { useDialogs } from "@/components/ui/dialog-provider";
import { useDocumentContext } from "./document-context";

const usePuck = createUsePuck();

const SAVE_KEYBINDS = [
  { key: "s", ctrlKey: true },
  { key: "s", metaKey: true },
] as const;

type EditorSaveContextType = {
  canSave: boolean;
  isSaving: boolean;
  save: () => void;
};

const EditorSaveContext = createContext<EditorSaveContextType>({
  canSave: false,
  isSaving: false,
  save: () => {},
});

function useSaveHotkey(save: () => void, target?: Document | null, enabled = true) {
  useKeybind(
    SAVE_KEYBINDS,
    (event) => {
      event.preventDefault();
      save();
    },
    [target],
    { capture: true, enabled },
  );
}

export function EditorSaveProvider({ children }: { children: ReactNode }) {
  const data = usePuck((s) => s.appState.data);
  const { documentId, documentName, isArchived, isDirty, addVersion } = useDocumentContext();
  const { alert } = useDialogs();
  const [isSaving, startTransition] = useTransition();

  const save = useCallback(() => {
    if (isArchived || isSaving) {
      return;
    }

    if (!isDirty) {
      toast.info("No changes to save", { id: "editor-no-changes-to-save" });
      return;
    }

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
  }, [addVersion, alert, data, documentId, documentName, isArchived, isDirty, isSaving]);

  useSaveHotkey(save);

  return (
    <EditorSaveContext.Provider value={{ canSave: !isArchived && !isSaving && isDirty, isSaving, save }}>
      {children}
    </EditorSaveContext.Provider>
  );
}

export function useEditorSaveContext() {
  return useContext(EditorSaveContext);
}

export function useEditorSaveHotkey(target?: Document | null, enabled = true) {
  const { save } = useEditorSaveContext();

  useSaveHotkey(save, target, enabled);
}
