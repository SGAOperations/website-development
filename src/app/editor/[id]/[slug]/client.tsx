"use client";

import type { Data } from "@puckeditor/core";
import { Puck, blocksPlugin, outlinePlugin } from "@puckeditor/core";
import config from "../../../../puck.config";
import { useState, useCallback, type ReactNode } from "react";
import { VersionPlugin } from "./VersionPlugin";
import { ActionBarOverride } from "./ActionBarOverride";
import { SaveButton } from "./SaveButton";
import { EditorSaveProvider, useEditorSaveHotkey } from "./editor-save-context";
import { MediaProvider, type MediaWithUrl } from "@/components/puck/media-context";
import type { Version } from "../../../../lib/types";
import { useUnsavedChangesGuard } from "./useUnsavedChangesGuard";
import { DocumentContext } from "./document-context";
import { UnsavedChangesContext } from "./unsaved-changes-context";

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
  const { confirmDiscardChanges } = useUnsavedChangesGuard(isDirty);

  const addVersion = useCallback((version: Version) => {
    setVersions(prev => [version, ...prev]);
    setVersionId(version.id);
    setIsDirty(false);
  }, []);

  return (
    <MediaProvider media={media}>
      <DocumentContext.Provider
        value={{ documentId, documentName, versionId, publishedVersionId, versions, isArchived, isDirty, addVersion, setPublishedVersionId }}
      >
        <UnsavedChangesContext.Provider value={{ confirmDiscardChanges }}>
          <Puck
            config={config}
            data={data}
            onChange={() => setIsDirty(true)}
            ui={{ plugin: { current: "version-plugin" } }}
            plugins={[VersionPlugin, blocksPlugin(), outlinePlugin()]}
            permissions={isArchived
              ? { drag: false, duplicate: false, delete: false, edit: false, insert: false }
              : { duplicate: false } // We replace this with our own, to avoid an icon collision
            }
            overrides={{
              actionBar: ActionBarOverride,
              headerActions: SaveButton,
              puck: EditorPuckOverride,
              iframe: EditorIframeOverride,
            }}
          />
        </UnsavedChangesContext.Provider>
      </DocumentContext.Provider>
    </MediaProvider>
  );
}

function EditorPuckOverride({ children }: { children: ReactNode }) {
  return <EditorSaveProvider>{children}</EditorSaveProvider>;
}

function EditorIframeOverride({
  children,
  document,
}: {
  children: ReactNode;
  document?: Document;
}) {
  useEditorSaveHotkey(document, Boolean(document));

  return <>{children}</>;
}
