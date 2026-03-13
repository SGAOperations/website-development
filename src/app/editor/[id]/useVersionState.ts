import type { Data } from "@puckeditor/core";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Version, UseVersionStateReturn } from "./types";
import { fetchVersions, saveVersion as saveVersionApi, publishVersion } from "../../../lib/version-api";

export function useVersionState({
  documentId,
  initialVersionId,
  initialPublishedVersionId,
  initialData,
}: {
  documentId: number;
  initialVersionId?: number;
  initialPublishedVersionId?: number;
  initialData: Data;
}): UseVersionStateReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [currentData, setCurrentData] = useState<Data>(initialData);
  const [versions, setVersions] = useState<Version[]>([]);
  const [publishedVersionId, setPublishedVersionId] = useState<number | null>(
    initialPublishedVersionId || null
  );

  const currentVersionId = searchParams 
    ? parseInt(searchParams.get("versionId") || "", 10) 
    : initialVersionId;

  useEffect(() => {
    fetchVersions({ documentId }).then(setVersions).catch(console.error);
    if (!initialPublishedVersionId) {
      fetchDocumentInfo();
    }
  }, [documentId]);

  useEffect(() => {
    setCurrentData(initialData);
  }, [initialData]);

  const fetchDocumentInfo = async () => {
    try {
      const response = await fetch(`/puck/api/documents/${documentId}`);
      if (response.ok) {
        const result = await response.json();
        setPublishedVersionId(result.document?.publishedVersionId || null);
      }
    } catch (error) {
      console.debug("Document info endpoint not available:", error);
    }
  };

  const loadVersion = async (versionIdToLoad: number) => {
    router.push(`/editor/${documentId}?versionId=${versionIdToLoad}`);
    router.refresh();
  };

  const saveVersion = async (dataToSave: Data) => {
    setIsSaving(true);
    try {
      const result = await saveVersionApi({ documentId, content: dataToSave });
      if (result.version?.id) {
        router.push(`/editor/${documentId}?versionId=${result.version.id}`);
      }
      const newVersions = await fetchVersions({ documentId });
      setVersions(newVersions);
      fetchDocumentInfo();
      return result;
    } finally {
      setIsSaving(false);
    }
  };

  const publishVersionAction = async (_dataToSave: Data) => {
    if (!currentVersionId || isNaN(currentVersionId)) {
      throw new Error("No version selected");
    }
    setIsPublishing(true);
    try {
      await publishVersion({ documentId, versionId: currentVersionId });
      setPublishedVersionId(currentVersionId);
      const newVersions = await fetchVersions({ documentId });
      setVersions(newVersions);
      fetchDocumentInfo();
    } finally {
      setIsPublishing(false);
    }
  };

  const updateData = (newData: Data) => {
    setCurrentData(newData);
  };

  return {
    currentData,
    versions,
    currentVersionId: isNaN(currentVersionId as number) ? undefined : currentVersionId,
    publishedVersionId,
    isLoading,
    isSaving,
    isPublishing,
    loadVersion,
    saveVersion,
    publishVersion: publishVersionAction,
    updateData,
  };
}
