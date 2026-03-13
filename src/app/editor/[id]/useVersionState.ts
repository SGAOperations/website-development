import type { Data } from "@puckeditor/core";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Version, UseVersionStateReturn } from "./types";

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

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [currentData, setCurrentData] = useState<Data>(initialData);
  const [versions, setVersions] = useState<Version[]>([]);
  const [publishedVersionId, setPublishedVersionId] = useState<number | null>(
    initialPublishedVersionId || null
  );
  const [currentVersionId] = useState<number | undefined>(initialVersionId);

  // Fetch versions on mount
  useEffect(() => {
    fetchVersions();
    if (!initialPublishedVersionId) {
      fetchDocumentInfo();
    }
  }, [documentId]);

  // Update currentData when initialData changes
  useEffect(() => {
    setCurrentData(initialData);
  }, [initialData]);

  const fetchVersions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/puck/api/versions?documentId=${documentId}`);
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const result = await response.json();
          setVersions(result.versions || []);
        }
      }
    } catch (error) {
      console.error("Failed to fetch versions", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDocumentInfo = async () => {
    try {
      const response = await fetch(`/puck/api/documents/${documentId}`);
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const result = await response.json();
          const newPublishedVersionId = result.document?.publishedVersionId || null;
          setPublishedVersionId(newPublishedVersionId);
        }
      }
    } catch (error) {
      console.debug("Document info endpoint not available:", error);
    }
  };

  const loadVersion = async (versionIdToLoad: number) => {
    const newUrl = `/editor/${documentId}?versionId=${versionIdToLoad}`;
    await router.push(newUrl);
    router.refresh();
  };

  const saveVersion = async (dataToSave: Data) => {
    setIsSaving(true);
    try {
      const response = await fetch("/puck/api/versions", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId,
          content: dataToSave,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save");
      }

      const result = await response.json();

      if (result.version?.id) {
        const newUrl = `/editor/${documentId}?versionId=${result.version.id}`;
        router.push(newUrl);
      }

      fetchVersions();
      fetchDocumentInfo();

      return result;
    } catch (error: any) {
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const publishVersionAction = async (_dataToSave: Data) => {
    setIsPublishing(true);
    try {
      const response = await fetch("/puck/api/publish", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId,
          versionId: currentVersionId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to publish");
      }

      const result = await response.json();

      if (currentVersionId) {
        setPublishedVersionId(currentVersionId);
      }

      fetchVersions();
      fetchDocumentInfo();

      return result;
    } catch (error: any) {
      throw error;
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
    currentVersionId,
    publishedVersionId,
    isLoading,
    isSaving,
    isPublishing,
    fetchVersions,
    loadVersion,
    saveVersion,
    publishVersion: publishVersionAction,
    updateData,
  };
}
