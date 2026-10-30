"use client";

import type { Data, Plugin } from "@puckeditor/core";
import { Puck, blocksPlugin, outlinePlugin } from "@puckeditor/core";
import config from "../../../../puck.config";
import { useState, useCallback, useEffect, type ReactNode } from "react";
import { VersionPlugin } from "./VersionPlugin";
import { ActionBarOverride } from "./ActionBarOverride";
import { SaveButton } from "./SaveButton";
import { EditorSaveProvider, useEditorSaveHotkey } from "./editor-save-context";
import { MediaProvider, type MediaWithUrl } from "@/components/puck/media-context";
import type { Version } from "../../../../lib/types";
import { useUnsavedChangesGuard } from "./useUnsavedChangesGuard";
import { DocumentContext, useDocumentContext } from "./document-context";
import { UnsavedChangesContext } from "./unsaved-changes-context";
import { House } from "lucide-react";
import { DisplaySettingsButton } from "@/components/display-settings/DisplaySettingsButton";
import { useDisplaySettings } from "@/components/display-settings/DisplaySettingsProvider";
import { AccessibilityPlugin } from "./AccessibilityPlugin";
import {
  AccessibilityHelpButton,
  BlocksDrawer,
  DrawerItemOverride,
  FieldsRegion,
  PreviewRegion,
  useCanvasA11y,
  useEditorA11yPatches,
  useMoveHotkeys,
} from "./editor-a11y";

// Puck's outline panel has no landmark; wrap it so screen reader users can jump to it.
const outline = outlinePlugin();
const OutlineRender = outline.render!;
const OutlinePlugin: Plugin = {
  ...outline,
  render: () => (
    <section aria-label="Outline">
      <OutlineRender />
    </section>
  ),
};

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
            plugins={[VersionPlugin, blocksPlugin(), OutlinePlugin, AccessibilityPlugin]}
            permissions={isArchived
              ? { drag: false, duplicate: false, delete: false, edit: false, insert: false }
              : { duplicate: false } // We replace this with our own, to avoid an icon collision
            }
            overrides={{
              actionBar: ActionBarOverride,
              headerActions: HeaderActionsOverride,
              puck: EditorPuckOverride,
              iframe: EditorIframeOverride,
              drawer: BlocksDrawer,
              drawerItem: DrawerItemOverride,
              fields: FieldsRegion,
              preview: PreviewRegion,
            }}
          />
        </UnsavedChangesContext.Provider>
      </DocumentContext.Provider>
    </MediaProvider>
  );
}

function HeaderActionsOverride() {
  return <>
      <DisplaySettingsButton />
      <AccessibilityHelpButton />
      <a href="/editor" title="All documents" aria-label="All documents">
        <House />
      </a>
      <SaveButton />
  </>
}

function EditorPuckOverride({ children }: { children: ReactNode }) {
  return (
    <EditorSaveProvider>
      <EditorShell>{children}</EditorShell>
    </EditorSaveProvider>
  );
}

function EditorShell({ children }: { children: ReactNode }) {
  const { documentName } = useDocumentContext();
  useEditorA11yPatches();
  useMoveHotkeys();

  return (
    <>
      <h1 className="sr-only">Editing {documentName}</h1>
      {children}
    </>
  );
}

function EditorIframeOverride({
  children,
  document,
}: {
  children: ReactNode;
  document?: Document;
}) {
  useEditorSaveHotkey(document, Boolean(document));
  useMoveHotkeys(document, Boolean(document));
  useCanvasA11y(document);
  useEditorA11yPatches(document, Boolean(document));
  useCanvasDisplay(document);

  return <>{children}</>;
}

/**
 * The canvas previews the published page, so it keeps the site's own colors and text size, even though
 * Puck copies the editor's <html> attributes into the iframe. Motion is the exception: a webmaster who
 * asked for reduced motion shouldn't get animation inside the canvas either.
 */
function useCanvasDisplay(document?: Document) {
  const { settings } = useDisplaySettings();

  useEffect(() => {
    const root = document?.documentElement;
    if (!root) return;

    const sync = () => {
      for (const key of ["theme", "contrast", "textSize"]) {
        if (key in root.dataset) delete root.dataset[key];
      }
      if (settings.motion === "system") {
        if ("motion" in root.dataset) delete root.dataset.motion;
      } else if (root.dataset.motion !== settings.motion) {
        root.dataset.motion = settings.motion;
      }
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme", "data-contrast", "data-text-size", "data-motion"] });
    return () => observer.disconnect();
  }, [document, settings.motion]);
}
