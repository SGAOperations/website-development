"use client";

import type { Data } from "@puckeditor/core";
import { Puck } from "@puckeditor/core";
import config from "../../../puck.config";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Draft = {
  id: number;
  pageId: number;
  createdAt: string;
};

export function Client({
  path,
  data,
  pageId,
  draftId,
  finalDraftId: initialFinalDraftId,
}: {
  path: string;
  data: Partial<Data>;
  pageId?: number;
  draftId?: number;
  finalDraftId?: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastAction, setLastAction] = useState<"draft" | "publish" | null>(null);
  const [currentData, setCurrentData] = useState<Data>(data as Data);
  const [showDrafts, setShowDrafts] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [finalDraftId, setFinalDraftId] = useState<number | null>(
    initialFinalDraftId || null
  );
  const [loadingDrafts, setLoadingDrafts] = useState(false);

  // Get current draftId from URL search params (this updates automatically when URL changes)
  const currentDraftIdFromUrl = searchParams.get("draftId");
  let currentDraftId: number | undefined;
  if (currentDraftIdFromUrl) {
    const parsed = parseInt(currentDraftIdFromUrl, 10);
    currentDraftId = !isNaN(parsed) ? parsed : undefined;
  } else {
    // Fallback to prop values
    currentDraftId = draftId || (finalDraftId !== null ? finalDraftId : undefined);
  }

  // Update currentData when data prop changes (e.g., when switching drafts)
  useEffect(() => {
    // console.log("Data prop changed:", {
    //   draftId: currentDraftId,
    //   hasData: !!data,
    //   dataKeys: data ? Object.keys(data) : []
    // });
    setCurrentData(data as Data);
  }, [data, currentDraftId]);

  // Update finalDraftId when initialFinalDraftId prop changes
  useEffect(() => {
    if (initialFinalDraftId !== undefined) {
      setFinalDraftId(initialFinalDraftId);
    }
  }, [initialFinalDraftId]);

  // Fetch drafts when pageId is available
  useEffect(() => {
    if (pageId) {
      fetchDrafts();
      // Only fetch page info if we don't already have finalDraftId
      if (!initialFinalDraftId) {
        fetchPageInfo();
      }
    }
  }, [pageId]);

  // Close drafts panel when clicking outside
  useEffect(() => {
    if (!showDrafts) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-drafts-panel]') && !target.closest('[data-drafts-button]')) {
        setShowDrafts(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDrafts]);

  const fetchDrafts = async () => {
    if (!pageId) return;
    setLoadingDrafts(true);
    try {
      const response = await fetch(`/puck/api/drafts?pageId=${pageId}`);
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const result = await response.json();
          setDrafts(result.drafts || []);
        } else {
          console.error("Expected JSON but got:", contentType);
        }
      }
    } catch (error) {
      console.error("Failed to fetch drafts", error);
    } finally {
      setLoadingDrafts(false);
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
          // console.log("Updated finalDraftId:", newFinalDraftId);
        }
      }
    } catch (error) {
      // API endpoint might not exist, that's okay - fail silently
      console.debug("Page info endpoint not available:", error);
    }
  };

  const handleLoadDraft = async (draftIdToLoad: number) => {
    // Reload the page with the draftId query parameter
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("draftId", draftIdToLoad.toString());
    const newUrl = currentUrl.pathname + currentUrl.search;

    // console.log("Loading draft:", { draftId: draftIdToLoad, newUrl });

    // Use router.push and wait for it, then refresh to ensure fresh data
    await router.push(newUrl);
    // Force a refresh to re-fetch server data after navigation
    router.refresh();
  };

  const handleDeleteDraft = async (draftIdToDelete: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the load draft action

    if (!confirm("Are you sure you want to delete this draft? This action cannot be undone.")) {
      return;
    }

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

      alert("Draft deleted successfully");
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleSave = async (dataToSave: Data, action: "save-draft" | "publish") => {
    const isPublish = action === "publish";
    if (isPublish) {
      setIsPublishing(true);
    } else {
      setIsSaving(true);
    }

    try {
      const payload: any = {
        data: dataToSave,
        action,
      };

      if (pageId) {
        payload.pageId = pageId;
      } else if (path) {
        payload.path = path;
      }

      // If we're editing an existing draft, include draftId to update it
      // For "save-draft": only update if it's not the published draft (to avoid accidentally modifying published content)
      // For "publish": always update if we have a draftId (including the published draft)
      if (currentDraftId !== undefined) {
        const finalDraftIdNum = finalDraftId !== null ? finalDraftId : undefined;
        if (isPublish || (action === "save-draft" && currentDraftId !== finalDraftIdNum)) {
          payload.draftId = currentDraftId;
        }
      }

      // console.log("Save payload:", {
      //   action,
      //   pageId,
      //   currentDraftId,
      //   finalDraftId,
      //   hasDraftId: !!payload.draftId
      // });

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
      setLastAction(isPublish ? "publish" : "draft");

      // If a new draft was created, update the URL to edit that draft
      if (!result.updated && result.draftId && action === "save-draft") {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set("draftId", result.draftId.toString());
        router.push(currentUrl.pathname + currentUrl.search);
      }

      // If a draft was published, update the finalDraftId
      if (isPublish && result.draftId) {
        setFinalDraftId(result.draftId);
      }

      // Refresh drafts list and page info after saving/publishing
      if (pageId) {
        fetchDrafts();
        // Always fetch page info to get updated finalDraftId
        fetchPageInfo();
      }

      // Show success message
      alert(
        isPublish
          ? "Page published successfully!"
          : result.updated
            ? "Draft updated successfully!"
            : "Draft saved successfully!"
      );

      return result;
    } catch (error: any) {
      alert(`Error: ${error.message}`);
      throw error;
    } finally {
      setIsPublishing(false);
      setIsSaving(false);
    }
  };

  const handleNewDraft = async () => {
    if (!pageId) {
      alert("Cannot create draft: Page not found");
      return;
    }

    if (!confirm("Create a new draft? You'll be able to edit it separately from the current draft.")) {
      return;
    }

    try {
      // Create a new draft with current content
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
      alert("New draft created! You're now editing this draft.");
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: "#fff",
          borderBottom: "1px solid #e5e7eb",
          padding: "12px 24px",
          display: "flex",
          gap: "12px",
          alignItems: "center",
        }}
      >
        {pageId && (
          <button
            onClick={handleNewDraft}
            disabled={isSaving || isPublishing}
            style={{
              padding: "8px 16px",
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isSaving || isPublishing ? "not-allowed" : "pointer",
              opacity: isSaving || isPublishing ? 0.6 : 1,
            }}
          >
            New Draft
          </button>
        )}
        <button
          onClick={() => handleSave(currentData, "save-draft")}
          disabled={isSaving || isPublishing}
          style={{
            padding: "8px 16px",
            backgroundColor: "#6b7280",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isSaving || isPublishing ? "not-allowed" : "pointer",
            opacity: isSaving || isPublishing ? 0.6 : 1,
          }}
        >
          {isSaving ? "Saving..." : currentDraftId && currentDraftId !== finalDraftId ? "Update Draft" : "Save Draft"}
        </button>
        <button
          onClick={() => handleSave(currentData, "publish")}
          disabled={isSaving || isPublishing}
          style={{
            padding: "8px 16px",
            backgroundColor: "#dc2626",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isSaving || isPublishing ? "not-allowed" : "pointer",
            opacity: isSaving || isPublishing ? 0.6 : 1,
          }}
        >
          {isPublishing ? "Publishing..." : "Publish"}
        </button>
        {lastAction && (
          <span style={{ color: "#6b7280", fontSize: "14px" }}>
            Last action: {lastAction === "publish" ? "Published" : "Saved as draft"}
          </span>
        )}
        {pageId && (
          <div style={{ position: "relative", marginLeft: "auto" }}>
            <button
              data-drafts-button
              onClick={() => {
                setShowDrafts(!showDrafts);
                if (!showDrafts && drafts.length === 0) {
                  fetchDrafts();
                }
              }}
              style={{
                padding: "8px 16px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              View Drafts ({drafts.length})
            </button>
            {showDrafts && (
              <div
                data-drafts-panel
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: "8px",
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  minWidth: "300px",
                  maxHeight: "400px",
                  overflowY: "auto",
                  zIndex: 1001,
                }}
              >
                <div style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>
                  <strong>Drafts</strong>
                </div>
                {loadingDrafts ? (
                  <div style={{ padding: "12px", textAlign: "center" }}>
                    Loading...
                  </div>
                ) : drafts.length === 0 ? (
                  <div style={{ padding: "12px", color: "#6b7280" }}>
                    No drafts found
                  </div>
                ) : (
                  <div>
                    {drafts.map((draft) => {
                      const isPublished = draft.id === finalDraftId;
                      const isCurrent = draft.id === currentDraftId;
                      const date = new Date(draft.createdAt);
                      return (
                        <div
                          key={draft.id}
                          onClick={() => handleLoadDraft(draft.id)}
                          style={{
                            padding: "12px",
                            borderBottom: "1px solid #e5e7eb",
                            cursor: "pointer",
                            backgroundColor: isCurrent ? "#f3f4f6" : "#fff",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                          onMouseEnter={(e) => {
                            if (!isCurrent) {
                              e.currentTarget.style.backgroundColor = "#f9fafb";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isCurrent) {
                              e.currentTarget.style.backgroundColor = "#fff";
                            }
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: isCurrent ? "bold" : "normal" }}>
                              Draft #{draft.id}
                              {isPublished && (
                                <span
                                  style={{
                                    marginLeft: "8px",
                                    padding: "2px 6px",
                                    backgroundColor: "#10b981",
                                    color: "white",
                                    borderRadius: "4px",
                                    fontSize: "11px",
                                  }}
                                >
                                  Published
                                </span>
                              )}
                              {isCurrent && (
                                <span
                                  style={{
                                    marginLeft: "8px",
                                    padding: "2px 6px",
                                    backgroundColor: "#3b82f6",
                                    color: "white",
                                    borderRadius: "4px",
                                    fontSize: "11px",
                                  }}
                                >
                                  Current
                                </span>
                              )}
                            </div>
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#6b7280",
                                marginTop: "4px",
                              }}
                            >
                              {date.toLocaleString()}
                            </div>
                          </div>
                          {!isPublished && (
                            <button
                              onClick={(e) => handleDeleteDraft(draft.id, e)}
                              style={{
                                padding: "4px 8px",
                                backgroundColor: "#ef4444",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "12px",
                                marginLeft: "8px",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#dc2626";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#ef4444";
                              }}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <div style={{ marginTop: "60px" }}>
        <Puck
          key={currentDraftId || "new"} // Force re-render when draftId changes
          config={config}
          data={currentData}
          onChange={(data) => {
            setCurrentData(data);
          }}
          onPublish={async (data) => {
            // Default to publish for backward compatibility
            setCurrentData(data);
            await handleSave(data, "publish");
          }}
        />
      </div>
    </div>
  );
}
