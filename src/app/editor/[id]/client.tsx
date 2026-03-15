"use client";

import type { Data } from "@puckeditor/core";
import { Puck } from "@puckeditor/core";
import config from "../../../puck.config";
import { useState, createContext, useContext } from "react";
import { VersionPlugin } from "./VersionPlugin";
import { ActionBarOverride } from "./ActionBarOverride";
import type { Version } from "../../../lib/types";

type DocumentContextType = {
  documentId: number;
  versionId?: number;
  publishedVersionId?: number;
  versions: Version[];
};

const DocumentContext = createContext<DocumentContextType>({
  documentId: 0,
  versions: [],
});

export function useDocumentContext() {
  return useContext(DocumentContext);
}

export function Client({
  documentId,
  data,
  versionId,
  publishedVersionId,
  versions,
}: {
  documentId: number;
  data: Partial<Data>;
  versionId?: number;
  publishedVersionId?: number;
  versions: Version[];
}) {
  const [currentData, setCurrentData] = useState<Data>(data as Data);

  return (
    <DocumentContext.Provider
      value={{ documentId, versionId, publishedVersionId, versions }}
    >
      <Puck
        config={config}
        data={currentData}
        ui={{plugin: {current: "version-plugin"}}}
        plugins={[VersionPlugin]}
        permissions={{ duplicate: false }}
        overrides={{ 
          actionBar: ActionBarOverride,
          headerActions: () => <div /> // Remove Publish button from header
        }}
        onChange={(data) => {
          setCurrentData(data);
        }}
      />
    </DocumentContext.Provider>
  );
}
