import type { Data } from "@puckeditor/core";

export type Version = {
  id: number;
  documentId: number;
  createdAt: Date;
};

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export type CreateDocumentInput = {
  name: string;
  content?: Data;
};

export type SaveVersionInput = {
  documentId: number;
  content: Data;
};

export type PublishVersionInput = {
  documentId: number;
  versionId: number;
};

export type CreateRouteInput = {
  path: string;
  documentId: number;
};

export type UpdateRouteInput = {
  id: number;
  path: string;
  documentId: number;
};

export type DeleteRouteInput = {
  id: number;
};

export type RenameInput = {
  id: number;
  name: string;
};

export type DeleteMediaInput = {
  id: number;
};

export type ArchiveDocumentInput = {
  id: number;
};

export type DuplicateDocumentInput = {
  id: number;
  name: string;
};

export type CreateFolderInput = {
  name: string;
  parentId?: number | null;
};

export type RenameFolderInput = {
  id: number;
  name: string;
};

export type MoveFolderInput = {
  id: number;
  parentId: number | null;
};

export type DeleteFolderInput = {
  id: number;
};
