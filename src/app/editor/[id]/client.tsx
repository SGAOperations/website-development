"use client";

import type { Data } from "@puckeditor/core";
import { Puck } from "@puckeditor/core";
import config from "../../../puck.config";
import { useState, createContext, useContext, useCallback } from "react";
import { VersionPlugin } from "./VersionPlugin";
import { ActionBarOverride } from "./ActionBarOverride";
import { SaveButton } from "./SaveButton";
import type { Version } from "../../../lib/types";

type DocumentContextType = {
  documentId: number;
  versionId?: number;
  publishedVersionId?: number;
  versions: Version[];
  addVersion: (version: Version) => void;
  setPublishedVersionId: (id: number) => void;
};

const DocumentContext = createContext<DocumentContextType>({
  documentId: 0,
  versions: [],
  addVersion: () => {},
  setPublishedVersionId: () => {},
});

export function useDocumentContext() {
  return useContext(DocumentContext);
}

export function Client({
  documentId,
  data,
  versionId: initialVersionId,
  publishedVersionId: initialPublishedVersionId,
  versions: initialVersions,
}: {
  documentId: number;
  data: Partial<Data>;
  versionId?: number;
  publishedVersionId?: number;
  versions: Version[];
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
      value={{ documentId, versionId, publishedVersionId, versions, addVersion, setPublishedVersionId }}
    >
      <Puck
        config={config}
        data={currentData}
        ui={{plugin: {current: "version-plugin"}}}
        plugins={[VersionPlugin]}
        permissions={{ duplicate: false }}
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
