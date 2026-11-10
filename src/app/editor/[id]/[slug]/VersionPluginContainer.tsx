"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useDocumentContext } from "./document-context";
import { useUnsavedChangesContext } from "./unsaved-changes-context";
import {
  archiveVersionAction,
  publishVersionAction,
  unarchiveVersionAction,
} from "../../../../lib/documents/actions";
import { getEditorUrl } from "../../../../lib/editor-url";
import { runAction } from "../../runAction";
import { VersionListPanel } from "./VersionListPanel";
import { useDialogs } from "@/components/ui/dialog-provider";
import { toast } from "sonner";

export function VersionPluginContainer() {
  const router = useRouter();
  const { documentId, documentName, versionId, publishedVersionId, versions, isArchived, setVersionArchivedAt, setPublishedVersionId } = useDocumentContext();
  const { confirmDiscardChanges } = useUnsavedChangesContext();
  const [isArchiving, startTransition] = useTransition();
  const { alert, confirm } = useDialogs();

  const handlePublishVersion = (targetVersionId: number) => {
    startTransition(async () => {
      const result = await runAction(publishVersionAction({ documentId, versionId: targetVersionId }));
      if (result.success === false) {
        await alert(result.error);
        return;
      }
      setPublishedVersionId(targetVersionId);
      toast.success("Published");
    });
  };

  const handleArchiveVersion = (targetVersionId: number) => {
    startTransition(async () => {
      const result = await runAction(archiveVersionAction({ documentId, versionId: targetVersionId }));
      if (result.success === false) {
        await alert(result.error);
        return;
      }
      setVersionArchivedAt(targetVersionId, new Date());
      router.refresh();
      toast.success("Version archived");
    });
  };

  const handleUnarchiveVersion = (targetVersionId: number) => {
    startTransition(async () => {
      const result = await runAction(unarchiveVersionAction({ documentId, versionId: targetVersionId }));
      if (result.success === false) {
        await alert(result.error);
        return;
      }
      setVersionArchivedAt(targetVersionId, null);
      router.refresh();
      toast.success("Version unarchived");
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
        onArchiveVersion={async (targetVersionId) => {
          const version = versions.find((item) => item.id === targetVersionId);
          if (!version) return;
          const confirmed = await confirm({ message: "Archive this version?", actionLabel: "Archive" });
          if (confirmed) handleArchiveVersion(targetVersionId);
        }}
        onUnarchiveVersion={async (targetVersionId) => {
          const version = versions.find((item) => item.id === targetVersionId);
          if (!version) return;
          const confirmed = await confirm({ message: "Unarchive this version?", actionLabel: "Unarchive" });
          if (confirmed) handleUnarchiveVersion(targetVersionId);
        }}
        isArchiveDisabled={isArchived || isArchiving}
      />
    </div>
  );
}
