"use client";

import type { Data } from "@puckeditor/core";
import { Puck } from "@puckeditor/core";
import config from "../../../../puck.config";
import { useState, createContext, useContext, useCallback, useEffect } from "react";
import { VersionPlugin } from "./VersionPlugin";
import { blocksPlugin, outlinePlugin } from "@puckeditor/core";
import { ActionBarOverride } from "./ActionBarOverride";
import { SaveButton } from "./SaveButton";
import { MediaProvider, type MediaWithUrl } from "@/components/puck/media-context";
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
  setIsDirty: (value: boolean) => void;
  isDirty: boolean;
};

const DocumentContext = createContext<DocumentContextType>({
  documentId: 0,
  documentName: "",
  versions: [],
  isArchived: false,
  addVersion: () => {},
  setPublishedVersionId: () => {},
  setIsDirty: (boolean) => {
    //empty function, will pass state change in later
  },
  isDirty: false
});

export function useDocumentContext() {
  return useContext(DocumentContext);
}

export function Client({
  documentId,
  documentName,
  data,
  media,
  versionId: initialVersionId,
  publishedVersionId: initialPublishedVersionId,
  versions: initialVersions,
  isArchived,
}: {
  documentId: number;
  documentName: string;
  data: Data;
  media: MediaWithUrl[];
  versionId?: number;
  publishedVersionId?: number;
  versions: Version[];
  isArchived: boolean;
}) {
  const [versions, setVersions] = useState(initialVersions);
  const [versionId, setVersionId] = useState(initialVersionId);
  const [publishedVersionId, setPublishedVersionId] = useState(initialPublishedVersionId);
  const [isDirty, setIsDirty ] = useState<boolean>(false);
  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const showSaveModal = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", showSaveModal);

    return () => {
      window.removeEventListener("beforeunload", showSaveModal);
    };
  }, [isDirty]);

  const addVersion = useCallback((version: Version) => {
    setVersions(prev => [version, ...prev]);
    setVersionId(version.id);
  }, []);

  return (
    <MediaProvider media={media}>
    <DocumentContext.Provider
      value={{ documentId, documentName, versionId, publishedVersionId, versions, isArchived, addVersion, setPublishedVersionId, setIsDirty, isDirty }}
    >
      <Puck
        config={config}
        data={data}
        ui={{plugin: {current: "version-plugin"}}}
        plugins={[VersionPlugin, blocksPlugin(), outlinePlugin()]}
        permissions={isArchived
          ? { drag: false, duplicate: false, delete: false, edit: false, insert: false }
          : { duplicate: false } // We replace this with our own, to avoid an icon collision
        }
        overrides={{
          actionBar: ActionBarOverride,
          headerActions: SaveButton
        }}
        onChange={(data) => setIsDirty(true)}
      />
    </DocumentContext.Provider>
    </MediaProvider>
  );
}
