"use client";

import { createUsePuck } from "@puckeditor/core";
import { useState } from "react";
import { useDraftContext } from "./client";
import { useDraftState } from "./useDraftState";
import { DraftToolbar } from "./DraftToolbar";
import { DraftListPanel } from "./DraftListPanel";
import { ConfirmDialog } from "./ConfirmDialog";

const usePuck = createUsePuck();

export function DraftPluginContainer() {
  const data = usePuck((s) => s.appState.data);
  const dispatch = usePuck((s) => s.dispatch);

  // Get pageId, draftId, and finalDraftId from context
  const { pageId, draftId: draftIdFromContext, finalDraftId: finalDraftIdFromContext } = useDraftContext();

  // State for notifications and confirmations dialogs
  const [notification, setNotification] = useState<string | null>(null);
  const [pendingConfirmation, setPendingConfirmation] = useState<{
    type: "delete" | "createDraft";
    draftId?: number;
  } | null>(null);

  const {
    drafts,
    currentDraftId,
    finalDraftId,
    isLoading,
    isSaving,
    isPublishing,
    saveDraft: saveDraftToBackend,
    publishDraft: publishDraftToBackend,
    deleteDraft,
    createNewDraft,
    loadDraft,
  } = useDraftState({
    pageId,
    initialDraftId: draftIdFromContext,
    initialFinalDraftId: finalDraftIdFromContext,
    initialData: data,
  });

  const handleSaveDraft = async () => {
    try {
      await saveDraftToBackend(data);
      dispatch({ type: "setData", data });
      setNotification("Saved");
    } catch (error: any) {
      setNotification(`Error: ${error.message}`);
    }
  };

  const handlePublish = async () => {
    try {
      await publishDraftToBackend(data);
      dispatch({ type: "setData", data });
      setNotification("Published");
    } catch (error: any) {
      setNotification(`Error: ${error.message}`);
    }
  };

  const handleCreateNewDraft = async () => {
    setPendingConfirmation({ type: "createDraft" });
  };

  const handleDeleteDraft = async (draftId: number) => {
    setPendingConfirmation({ type: "delete", draftId });
  };

  const handleLoadDraft = async (draftId: number) => {
    try {
      await loadDraft(draftId);
    } catch (error: any) {
      setNotification(`Error: ${error.message}`);
    }
  };

  const handleConfirmAction = async () => {
    if (!pendingConfirmation) return;

    try {
      if (pendingConfirmation.type === "delete" && pendingConfirmation.draftId) {
        await deleteDraft(pendingConfirmation.draftId);
      } else if (pendingConfirmation.type === "createDraft") {
        await createNewDraft();
      }
      setNotification("Saved");
      setPendingConfirmation(null);
    } catch (error: any) {
      setNotification(`Error: ${error.message}`);
      setPendingConfirmation(null);
    }
  };

  const getConfirmationMessage = (): string => {
    if (!pendingConfirmation) return "";
    if (pendingConfirmation.type === "delete") {
      return "Are you sure you want to delete this draft? This action cannot be undone.";
    }
    if (pendingConfirmation.type === "createDraft") {
      return "Create a new draft? You'll be able to edit it separately from the current draft.";
    }
    return "";
  };

  const isDraft = currentDraftId !== undefined && currentDraftId !== finalDraftId;

  return (
    <div className="flex flex-col gap-4 p-4 text-sm">
      <DraftToolbar
        onNewDraft={handleCreateNewDraft}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        isSaving={isSaving}
        isPublishing={isPublishing}
        canCreateDraft={!!pageId}
        isDraft={isDraft}
      />

      <DraftListPanel
        isOpen={true}
        drafts={drafts}
        isLoading={isLoading}
        currentDraftId={currentDraftId}
        publishedDraftId={finalDraftId}
        onLoadDraft={handleLoadDraft}
        onDeleteDraft={handleDeleteDraft}
      />

      {notification && (
        <ConfirmDialog
          message={notification}
          isDangerous={false}
          onCancel={() => setNotification(null)}
        />
      )}

      {pendingConfirmation && (
        <ConfirmDialog
          message={getConfirmationMessage()}
          isDangerous={true}
          onConfirm={handleConfirmAction}
          onCancel={() => setPendingConfirmation(null)}
        />
      )}
    </div>
  );
}
