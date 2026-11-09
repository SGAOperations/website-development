"use client";

import { useTransition } from "react";
import { createUsePuck } from "@puckeditor/core";
import { useRouter } from "next/navigation";
import { useDocumentContext } from "./document-context";
import { useUnsavedChangesContext } from "./unsaved-changes-context";
import { publishVersionAction } from "../../../../lib/documents/actions";
import { getEditorUrl, getPreviewUrl } from "../../../../lib/editor-url";
import { runAction } from "../../runAction";
import { VersionListPanel } from "./VersionListPanel";
import { useDialogs } from "@/components/ui/dialog-provider";
import { toast } from "sonner";
import { checkAccessibility } from "@/lib/puck/a11y-check";

const usePuck = createUsePuck();

export function VersionPluginContainer() {
  const router = useRouter();
  const { documentId, documentName, versionId, publishedVersionId, versions, isArchived, isDirty, setPublishedVersionId } = useDocumentContext();
  const data = usePuck((s) => s.appState.data);
  const { confirmDiscardChanges } = useUnsavedChangesContext();
  const [isPublishing, startTransition] = useTransition();
  const { alert, confirm } = useDialogs();

  const handlePublishVersion = async (targetVersionId: number) => {
    // Check what is about to go live when the editor holds exactly that version (ATAG B.3.1).
    if (targetVersionId === versionId && !isDirty) {
      const errors = checkAccessibility(data).filter((issue) => issue.severity === "error").length;
      if (errors > 0) {
        const proceed = await confirm({
          message: `This version has ${errors} accessibility ${errors === 1 ? "error" : "errors"}. Open the Checks panel to see and fix ${errors === 1 ? "it" : "them"}, or publish anyway.`,
          actionLabel: "Publish anyway",
        });
        if (!proceed) return;
      }
    }

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

    const shouldLeave = await confirmDiscardChanges();

    if (!shouldLeave) {
      return;
    }

    router.replace(getEditorUrl(documentId, documentName, versionIdToLoad));
  };

  return (
    <section aria-label="Versions" className="flex flex-col gap-4 p-4 text-sm">
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
    </section>
  );
}
