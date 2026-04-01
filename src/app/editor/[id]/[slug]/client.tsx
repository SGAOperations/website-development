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
  isDirty: boolean;
  addVersion: (version: Version) => void;
  setPublishedVersionId: (id: number) => void;
};

const DocumentContext = createContext<DocumentContextType>({
  documentId: 0,
  documentName: "",
  versions: [],
  isArchived: false,
  isDirty: false,
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
  const [isDirty, setIsDirty] = useState(false);

  const addVersion = useCallback((version: Version) => {
    setVersions(prev => [version, ...prev]);
    setVersionId(version.id);
    setIsDirty(false);
  }, []);

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // Needed for Chrome version <=119 to show the confirmation dialog
      event.returnValue = true;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  return (
    <MediaProvider media={media}>
    <DocumentContext.Provider
      value={{ documentId, documentName, versionId, publishedVersionId, versions, isArchived, isDirty, addVersion, setPublishedVersionId }}
    >
      <Puck
        config={config}
        data={data}
        onChange={() => setIsDirty(true)}
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
      />
    </DocumentContext.Provider>
    </MediaProvider>
  );
}
