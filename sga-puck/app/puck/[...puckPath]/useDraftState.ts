import type { Data } from "@puckeditor/core";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Draft, UseDraftStateReturn } from "./types";

export function useDraftState({
  pageId,
  initialDraftId,
  initialFinalDraftId,
  initialData,
}: {
  pageId?: number;
  initialDraftId?: number;
  initialFinalDraftId?: number;
  initialData: Data;
}): UseDraftStateReturn {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [currentData, setCurrentData] = useState<Data>(initialData);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [finalDraftId, setFinalDraftId] = useState<number | null>(
    initialFinalDraftId || null
  );
  const [currentDraftId] = useState<number | undefined>(initialDraftId);

  // Fetch drafts when pageId is available
  useEffect(() => {
    if (pageId) {
      fetchDrafts();
      if (!initialFinalDraftId) {
        fetchPageInfo();
      }
    }
  }, [pageId]);

  // Update currentData when initialData changes
  useEffect(() => {
    setCurrentData(initialData);
  }, [initialData]);

  const fetchDrafts = async () => {
    if (!pageId) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/puck/api/drafts?pageId=${pageId}`);
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const result = await response.json();
          setDrafts(result.drafts || []);
        }
      }
    } catch (error) {
      console.error("Failed to fetch drafts", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPageInfo = async () => {
    if (!pageId) return;
    try {
      const response = await fetch(`/puck/api/pages/${pageId}`);
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const result = await response.json();
          const newFinalDraftId = result.page?.finalDraftId || null;
          setFinalDraftId(newFinalDraftId);
        }
      }
    } catch (error) {
      console.debug("Page info endpoint not available:", error);
    }
  };

  const loadDraft = async (draftIdToLoad: number) => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("draftId", draftIdToLoad.toString());
    const newUrl = currentUrl.pathname + currentUrl.search;

    await router.push(newUrl);
    router.refresh();
  };

  const deleteDraft = async (draftIdToDelete: number): Promise<void> => {
    try {
      const response = await fetch(`/puck/api/drafts?draftId=${draftIdToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete draft");
      }

      // If we deleted the current draft, redirect to the page without draftId
      if (draftIdToDelete === currentDraftId) {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.delete("draftId");
        router.push(currentUrl.pathname + currentUrl.search);
      } else {
        // Refresh the drafts list and page info
        fetchDrafts();
        if (pageId && !initialFinalDraftId) {
          fetchPageInfo();
        }
      }
    } catch (error: any) {
      throw new Error(error.message || "Failed to delete draft");
    }
  };

  const saveDraft = async (dataToSave: Data) => {
    setIsSaving(true);
    try {
      const payload: any = {
        data: dataToSave,
        action: "save-draft",
      };

      if (pageId) {
        payload.pageId = pageId;
      }

      // Always include draftId if we have a currentDraftId (whether it's the published draft or a working draft)
      if (currentDraftId !== undefined) {
        payload.draftId = currentDraftId;
      }

      const response = await fetch("/puck/api", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save");
      }

      const result = await response.json();

      // If a new draft was created, update the URL to edit that draft
      if (!result.updated && result.draftId && payload.action === "save-draft") {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set("draftId", result.draftId.toString());
        router.push(currentUrl.pathname + currentUrl.search);
      }

      // Refresh drafts list
      if (pageId) {
        fetchDrafts();
        fetchPageInfo();
      }

      return result;
    } catch (error: any) {
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const publishDraft = async (dataToSave: Data) => {
    setIsPublishing(true);
    try {
      const payload: any = {
        data: dataToSave,
        action: "publish",
      };

      if (pageId) {
        payload.pageId = pageId;
      }

      if (currentDraftId !== undefined) {
        payload.draftId = currentDraftId;
      }

      const response = await fetch("/puck/api", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to publish");
      }

      const result = await response.json();

      // If a draft was published, update the finalDraftId
      if (result.draftId) {
        setFinalDraftId(result.draftId);
      }

      // Refresh drafts list and page info
      if (pageId) {
        fetchDrafts();
        fetchPageInfo();
      }

      return result;
    } catch (error: any) {
      throw error;
    } finally {
      setIsPublishing(false);
    }
  };

  const createNewDraft = async (): Promise<void> => {
    if (!pageId) {
      throw new Error("Cannot create draft: Page not found");
    }

    try {
      const payload: any = {
        data: currentData,
        action: "save-draft",
        pageId: pageId,
      };

      const response = await fetch("/puck/api", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create draft");
      }

      const result = await response.json();

      // Navigate to the new draft
      if (result.draftId) {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set("draftId", result.draftId.toString());
        router.push(currentUrl.pathname + currentUrl.search);
      }

      // Refresh drafts list
      fetchDrafts();
    } catch (error: any) {
      throw error;
    }
  };

  const updateData = (newData: Data) => {
    setCurrentData(newData);
  };

  return {
    currentData,
    drafts,
    currentDraftId,
    finalDraftId,
    isLoading,
    isSaving,
    isPublishing,
    fetchDrafts,
    fetchPageInfo,
    loadDraft,
    saveDraft,
    publishDraft,
    deleteDraft,
    createNewDraft,
    updateData,
  };
}
