"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useDocumentContext } from "./client";
import { publishVersionAction } from "../../../../lib/documents/actions";
import { getEditorUrl, getPreviewUrl } from "../../../../lib/editor-url";
import { runAction } from "../../runAction";
import { VersionListPanel } from "./VersionListPanel";
import { useDialogs } from "@/components/ui/dialog-provider";
import { toast } from "sonner";

export function VersionPluginContainer() {
  const router = useRouter();
  const { documentId, documentName, versionId, publishedVersionId, versions, isArchived, confirmDiscardChanges, setPublishedVersionId } = useDocumentContext();
  const [isPublishing, startTransition] = useTransition();
  const { alert } = useDialogs();

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

  const handleLoadVersion = async (versionIdToLoad: number) => {
    if (versionIdToLoad === versionId) {
      return;
    }

    const shouldLeave = await confirmDiscardChanges({
      message: "You have unsaved changes. Leave this version without saving?",
      actionLabel: "Leave",
      destructive: true,
    });

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
        getPreviewUrlForVersion={(targetVersionId) =>
          getPreviewUrl(documentId, documentName, targetVersionId)
        }
        isPublishing={isPublishing}
        isPublishDisabled={isArchived}
      />
    </div>
  );
}
