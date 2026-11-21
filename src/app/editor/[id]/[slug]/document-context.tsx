"use client";

import { createContext, useContext } from "react";
import type { Version } from "../../../../lib/types";

type DocumentContextType = {
  documentId: number;
  documentName: string;
  versionId?: number;
  publishedVersionId?: number;
  versions: Version[];
  isArchived: boolean;
  isDirty: boolean;
  addVersion: (version: Version) => void;
  setVersionName: (id: number, name: string) => void;
  setPublishedVersionId: (id: number) => void;
};

const DocumentContext = createContext<DocumentContextType>({
  documentId: 0,
  documentName: "",
  versions: [],
  isArchived: false,
  isDirty: false,
  addVersion: () => {},
  setVersionName: () => {},
  setPublishedVersionId: () => {},
});

export function useDocumentContext() {
  return useContext(DocumentContext);
}

export { DocumentContext };
