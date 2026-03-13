"use client";

import type { Data } from "@puckeditor/core";
import { Puck } from "@puckeditor/core";
import config from "../../../puck.config";
import { useState, createContext, useContext } from "react";
import { VersionPlugin } from "./VersionPlugin";
import { ActionBarOverride } from "./ActionBarOverride";

type DocumentContextType = {
  documentId: number;
  versionId?: number;
  publishedVersionId?: number;
};

const DocumentContext = createContext<DocumentContextType>({ documentId: 0 });

export function useDocumentContext() {
  return useContext(DocumentContext);
}

export function Client({
  documentId,
  data,
  versionId,
  publishedVersionId,
}: {
  documentId: number;
  data: Partial<Data>;
  versionId?: number;
  publishedVersionId?: number;
}) {
  const [currentData, setCurrentData] = useState<Data>(data as Data);

  return (
    <DocumentContext.Provider value={{ documentId, versionId, publishedVersionId }}>
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
