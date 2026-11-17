"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useDocumentContext } from "./document-context";
import { useUnsavedChangesContext } from "./unsaved-changes-context";
import { publishVersionAction, renameVersionAction } from "../../../../lib/documents/actions";
import type { Version } from "../../../../lib/types";
import { getEditorUrl, getPreviewUrl } from "../../../../lib/editor-url";
import { runAction } from "../../runAction";
import { VersionListPanel } from "./VersionListPanel";
import { useDialogs } from "@/components/ui/dialog-provider";
import { toast } from "sonner";

export function VersionPluginContainer() {
  const router = useRouter();
  const {
    documentId,
    documentName,
    versionId,
    publishedVersionId,
    versions,
    isArchived,
    setVersionName,
    setPublishedVersionId,
  } = useDocumentContext();
  const { confirmDiscardChanges } = useUnsavedChangesContext();
  const [isPublishing, startTransition] = useTransition();
  const [isRenaming, startRenameTransition] = useTransition();
  const { alert, prompt } = useDialogs();

  const handleRenameVersion = async (version: Version) => {
    const input = await prompt({
      title: "Rename Version",
      label: "Version name",
      defaultValue: version.name,
    });
    if (input === null) return;

    const name = input.trim();
    if (name === version.name) return;

    startRenameTransition(async () => {
      const result = await runAction(
        renameVersionAction({ documentId, versionId: version.id, name }),
      );
      if (result.success === false) {
        await alert(result.error);
        return;
      }

      setVersionName(version.id, name);
    });
  };

  const handlePublishVersion = (targetVersionId: number) => {
    startTransition(async () => {
      const result = await runAction(
        publishVersionAction({ documentId, versionId: targetVersionId }),
      );

      if (result.success === false) {
        await alert(result.error);
        return;
      }

      setPublishedVersionId(targetVersionId);
      toast.success("Published");
    });
  };

  const handleLoadVersion = async (versionIdToLoad: number) => {
    if (versionIdToLoad === versionId) {
      return;
    }

    const shouldLeave = await confirmDiscardChanges();

    if (!shouldLeave) {
      return;
    }

    router.replace(getEditorUrl(documentId, documentName, versionIdToLoad));
  };

  return (
    <div className="flex flex-col gap-4 p-4 text-sm">
      <VersionListPanel
        versions={versions}
        isLoading={false}
        currentVersionId={versionId}
        publishedVersionId={publishedVersionId}
        onLoadVersion={handleLoadVersion}
        onPublishVersion={handlePublishVersion}
        onRenameVersion={handleRenameVersion}
        getPreviewUrlForVersion={(targetVersionId) =>
          getPreviewUrl(documentId, documentName, targetVersionId)
        }
        isPublishing={isPublishing}
        isPublishDisabled={isArchived}
        isRenameDisabled={isArchived || isRenaming}
      />
    </div>
  );
}
