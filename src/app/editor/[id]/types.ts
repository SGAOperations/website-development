import type { Data } from "@puckeditor/core";

export type Version = {
  id: number;
  documentId: number;
  createdAt: string;
};

export type UseVersionStateReturn = {
  // State
  currentData: Data;
  versions: Version[];
  currentVersionId?: number;
  publishedVersionId: number | null;
  isLoading: boolean;
  isSaving: boolean;
  isPublishing: boolean;

  // Actions
  fetchVersions: () => Promise<void>;
  loadVersion: (versionId: number) => Promise<void>;
  saveVersion: (data: Data) => Promise<any>;
  publishVersion: (data: Data) => Promise<any>;
  updateData: (data: Data) => void;
};
