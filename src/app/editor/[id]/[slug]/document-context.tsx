"use client";

import { createContext, useContext } from "react";
import type { Version } from "../../../../lib/types";

type DocumentContextType = {
  documentId: number;
  documentName: string;
  versionId?: number;
  isVersionArchived: boolean;
  publishedVersionId?: number;
  versions: Version[];
  isArchived: boolean;
  isDirty: boolean;
  addVersion: (version: Version) => void;
  setVersionArchivedAt: (id: number, archivedAt: Date | null) => void;
  setPublishedVersionId: (id: number) => void;
};

const DocumentContext = createContext<DocumentContextType>({
  documentId: 0,
  documentName: "",
  versions: [],
  isVersionArchived: false,
  isArchived: false,
  isDirty: false,
  addVersion: () => {},
  setVersionArchivedAt: () => {},
  setPublishedVersionId: () => {},
});

export function useDocumentContext() {
  return useContext(DocumentContext);
}

export { DocumentContext };
