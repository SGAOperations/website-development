import type { Data } from "@puckeditor/core";

export type Draft = {
  id: number;
  pageId: number;
  createdAt: string;
};

export type UseDraftStateReturn = {
  // State
  currentData: Data;
  drafts: Draft[];
  currentDraftId?: number;
  finalDraftId: number | null;
  isLoading: boolean;
  isSaving: boolean;
  isPublishing: boolean;

  // Actions
  fetchDrafts: () => Promise<void>;
  fetchPageInfo: () => Promise<void>;
  loadDraft: (draftId: number) => Promise<void>;
  saveDraft: (data: Data) => Promise<void>;
  publishDraft: (data: Data) => Promise<void>;
  deleteDraft: (draftId: number) => Promise<void>;
  createNewDraft: () => Promise<void>;
  updateData: (newData: Data) => void;
};
