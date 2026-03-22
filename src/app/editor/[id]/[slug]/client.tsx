"use client";

import type { Data } from "@puckeditor/core";
import { Puck } from "@puckeditor/core";
import config from "../../../../puck.config";
import { useState, createContext, useContext, useCallback } from "react";
import { VersionPlugin } from "./VersionPlugin";
import { ActionBarOverride } from "./ActionBarOverride";
import { SaveButton } from "./SaveButton";
import type { Version } from "../../../../lib/types";

type DocumentContextType = {
  documentId: number;
  documentName: string;
  versionId?: number;
  publishedVersionId?: number;
  versions: Version[];
  isArchived: boolean;
  addVersion: (version: Version) => void;
  setPublishedVersionId: (id: number) => void;
};

const DocumentContext = createContext<DocumentContextType>({
  documentId: 0,
  documentName: "",
  versions: [],
  isArchived: false,
  addVersion: () => {},
  setPublishedVersionId: () => {},
});

export function useDocumentContext() {
  return useContext(DocumentContext);
}

export function Client({
  documentId,
  documentName,
  data,
  versionId: initialVersionId,
  publishedVersionId: initialPublishedVersionId,
  versions: initialVersions,
  isArchived,
}: {
  documentId: number;
  documentName: string;
  data: Partial<Data>;
  versionId?: number;
  publishedVersionId?: number;
  versions: Version[];
  isArchived: boolean;
}) {
  const [currentData, setCurrentData] = useState<Data>(data as Data);
  const [versions, setVersions] = useState(initialVersions);
  const [versionId, setVersionId] = useState(initialVersionId);
  const [publishedVersionId, setPublishedVersionId] = useState(initialPublishedVersionId);

  const addVersion = useCallback((version: Version) => {
    setVersions(prev => [version, ...prev]);
    setVersionId(version.id);
  }, []);

  return (
    <DocumentContext.Provider
      value={{ documentId, documentName, versionId, publishedVersionId, versions, isArchived, addVersion, setPublishedVersionId }}
    >
      <Puck
        config={config}
        data={currentData}
        ui={{plugin: {current: "version-plugin"}}}
        plugins={[VersionPlugin]}
        permissions={isArchived
          ? { drag: false, duplicate: false, delete: false, edit: false, insert: false }
          : { duplicate: false } // Re replace this with our own, to avoid an icon collision
        }
        overrides={{
          actionBar: ActionBarOverride,
          headerActions: SaveButton
        }}
        onChange={(data) => {
          setCurrentData(data);
        }}
      />
    </DocumentContext.Provider>
  );
}
