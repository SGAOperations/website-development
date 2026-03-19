"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDocumentContext } from "./client";
import { publishVersionAction } from "../../../lib/actions";
import { VersionListPanel } from "./VersionListPanel";

export function VersionPluginContainer() {
  const router = useRouter();
  const { documentId, versionId, publishedVersionId, versions, setPublishedVersionId } = useDocumentContext();
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublishVersion = async (targetVersionId: number) => {
    setIsPublishing(true);
    const result = await publishVersionAction({ documentId, versionId: targetVersionId });

    if (result.success === false) {
      alert(`Error: ${result.error}`);
      setIsPublishing(false);
      return;
    }

    setPublishedVersionId(targetVersionId);
    setIsPublishing(false);
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
