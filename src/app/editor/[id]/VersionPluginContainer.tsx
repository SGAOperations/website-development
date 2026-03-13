"use client";

import { createUsePuck } from "@puckeditor/core";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useDocumentContext } from "./client";
import { saveVersionAction, publishVersionAction } from "../../../lib/actions";
import { VersionToolbar } from "./VersionToolbar";
import { VersionListPanel } from "./VersionListPanel";

const usePuck = createUsePuck();

export function VersionPluginContainer() {
  const data = usePuck((s) => s.appState.data);
  const dispatch = usePuck((s) => s.dispatch);
  const router = useRouter();

  const { documentId, versionId, publishedVersionId, versions } = useDocumentContext();

  const [isSaving, startSaveTransition] = useTransition();
  const [isPublishing, startPublishTransition] = useTransition();

  const handleSaveVersion = () => {
    startSaveTransition(async () => {
      const result = await saveVersionAction({ documentId, content: data });

      if (result.success === false) {
        alert(`Error: ${result.error}`);
        return;
      }

      dispatch({ type: "setData", data });
      router.push(`/editor/${documentId}?versionId=${result.data.version.id}`);
      alert("Saved successfully");
    });
  };

  const handlePublish = () => {
    if (!versionId) {
      alert("No version selected");
      return;
    }

    startPublishTransition(async () => {
      const result = await publishVersionAction({ documentId, versionId });

      if (result.success === false) {
        alert(`Error: ${result.error}`);
        return;
      }

      dispatch({ type: "setData", data });
      router.push(`/editor/${documentId}?versionId=${versionId}`);
      alert("Published successfully");
    });
  };

  const handleLoadVersion = (versionIdToLoad: number) => {
    router.push(`/editor/${documentId}?versionId=${versionIdToLoad}`);
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
        isLoading={false}
        currentVersionId={versionId}
        publishedVersionId={publishedVersionId}
        onLoadVersion={handleLoadVersion}
      />
    </div>
  );
}
