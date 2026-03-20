"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useDocumentContext } from "./client";
import { publishVersionAction } from "../../../lib/actions";
import { runAction } from "../runAction";
import { VersionListPanel } from "./VersionListPanel";

export function VersionPluginContainer() {
  const router = useRouter();
  const { documentId, versionId, publishedVersionId, versions, setPublishedVersionId } = useDocumentContext();
  const [isPublishing, startTransition] = useTransition();

  const handlePublishVersion = (targetVersionId: number) => {
    startTransition(async () => {
      const result = await runAction(publishVersionAction({ documentId, versionId: targetVersionId }));

      if (result.success === false) {
        alert(result.error);
        return;
      }

      setPublishedVersionId(targetVersionId);
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
      />
    </div>
  );
}
