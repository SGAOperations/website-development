"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useDocumentContext } from "./client";
import { publishVersionAction } from "../../../lib/actions";
import { runAction } from "../runAction";
import { VersionListPanel } from "./VersionListPanel";
import { useDialogs } from "@/components/ui/dialog-provider";
import { toast } from "sonner";

export function VersionPluginContainer() {
  const router = useRouter();
  const { documentId, versionId, publishedVersionId, versions, isArchived, setPublishedVersionId } = useDocumentContext();
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

  const handleLoadVersion = (versionIdToLoad: number) => {
    router.replace(`/editor/${documentId}?versionId=${versionIdToLoad}`);
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
        isPublishing={isPublishing}
        isPublishDisabled={isArchived}
      />
    </div>
  );
}
