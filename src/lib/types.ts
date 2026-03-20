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

export type DeleteMediaInput = {
  id: number;
};
