"use client";

import { createUsePuck } from "@puckeditor/core";
import { useState } from "react";
import { useDocumentContext } from "./client";
import { useVersionState } from "./useVersionState";
import { VersionToolbar } from "./VersionToolbar";
import { VersionListPanel } from "./VersionListPanel";
import { ConfirmDialog } from "./ConfirmDialog";

const usePuck = createUsePuck();

export function VersionPluginContainer() {
  const data = usePuck((s) => s.appState.data);
  const dispatch = usePuck((s) => s.dispatch);

  const { documentId, versionId: versionIdFromContext, publishedVersionId: publishedVersionIdFromContext } = useDocumentContext();

  // State for notifications
  const [notification, setNotification] = useState<string | null>(null);

  const {
    versions,
    currentVersionId,
    publishedVersionId,
    isLoading,
    isSaving,
    isPublishing,
    saveVersion,
    publishVersion,
    loadVersion,
  } = useVersionState({
    documentId,
    initialVersionId: versionIdFromContext,
    initialPublishedVersionId: publishedVersionIdFromContext,
    initialData: data,
  });

  const handleSaveVersion = async () => {
    try {
      await saveVersion(data);
      dispatch({ type: "setData", data });
      setNotification("Saved");
    } catch (error: any) {
      setNotification(`Error: ${error.message}`);
    }
  };

  const handlePublish = async () => {
    try {
      await publishVersion(data);
      dispatch({ type: "setData", data });
      setNotification("Published");
    } catch (error: any) {
      setNotification(`Error: ${error.message}`);
    }
  };

  const handleLoadVersion = async (versionId: number) => {
    try {
      await loadVersion(versionId);
    } catch (error: any) {
      setNotification(`Error: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 text-sm">
      <VersionToolbar
        onSaveVersion={handleSaveVersion}
        onPublish={handlePublish}
        isSaving={isSaving}
        isPublishing={isPublishing}
      />

      <VersionListPanel
        versions={versions}
        isLoading={isLoading}
        currentVersionId={currentVersionId}
        publishedVersionId={publishedVersionId}
        onLoadVersion={handleLoadVersion}
      />

      {notification && (
        <ConfirmDialog
          message={notification}
          isDangerous={false}
          onCancel={() => setNotification(null)}
        />
      )}
    </div>
  );
}
