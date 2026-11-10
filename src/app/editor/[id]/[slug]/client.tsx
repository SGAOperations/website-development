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
import { House } from "lucide-react";

export function Client({
  documentId,
  documentName,
  data,
  media,
  versionId: initialVersionId,
  publishedVersionId: initialPublishedVersionId,
  versions: initialVersions,
  isArchived,
  isVersionArchived,
}: {
  documentId: number;
  documentName: string;
  data: Data;
  media: MediaWithUrl[];
  versionId?: number;
  publishedVersionId?: number;
  versions: Version[];
  isArchived: boolean;
  isVersionArchived: boolean;
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
  const setVersionArchivedAt = useCallback((id: number, archivedAt: Date | null) => {
    setVersions((prev) => prev.map((version) =>
      version.id === id ? { ...version, archivedAt } : version
    ));
  }, []);
  const currentVersionIsArchived = versions.find((version) => version.id === versionId)?.archivedAt != null;

  return (
    <MediaProvider media={media}>
      <DocumentContext.Provider
        value={{ documentId, documentName, versionId, publishedVersionId, versions, isArchived, isVersionArchived: currentVersionIsArchived, isDirty, addVersion, setVersionArchivedAt, setPublishedVersionId }}
      >
        <UnsavedChangesContext.Provider value={{ confirmDiscardChanges }}>
          <Puck
            config={config}
            data={data}
            onChange={() => setIsDirty(true)}
            ui={{ plugin: { current: "version-plugin" } }}
            plugins={[VersionPlugin, blocksPlugin(), outlinePlugin()]}
            permissions={isArchived || isVersionArchived
              ? { drag: false, duplicate: false, delete: false, edit: false, insert: false }
              : { duplicate: false } // We replace this with our own, to avoid an icon collision
            }
            overrides={{
              actionBar: ActionBarOverride,
              headerActions: HeaderActionsOverride,
              puck: EditorPuckOverride,
              iframe: EditorIframeOverride,
            }}
          />
        </UnsavedChangesContext.Provider>
      </DocumentContext.Provider>
    </MediaProvider>
  );
}

function HeaderActionsOverride() {
  return <>
      <a href="/editor">
        <House />
      </a>
      <SaveButton />
  </>
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
