"use client";

import type { Data } from "@puckeditor/core";
import { Puck } from "@puckeditor/core";
import config from "../../../puck.config";
import {
  useState,
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { VersionPlugin } from "./VersionPlugin";
import { ActionBarOverride } from "./ActionBarOverride";
import { SaveButton } from "./SaveButton";
import type { Version } from "../../../lib/types";

const UNSAVED_WARNING_MESSAGE =
  "You have unsaved changes. Are you sure you want to leave this page?";

type DocumentContextType = {
  documentId: number;
  versionId?: number;
  publishedVersionId?: number;
  versions: Version[];
  isArchived: boolean;
  isDirty: boolean;
  addVersion: (version: Version) => void;
  markSaved: (savedData: Data) => void;
  confirmNavigationIfUnsaved: () => boolean;
  setPublishedVersionId: (id: number) => void;
};

const DocumentContext = createContext<DocumentContextType>({
  documentId: 0,
  versions: [],
  isArchived: false,
  isDirty: false,
  addVersion: () => {},
  markSaved: () => {},
  confirmNavigationIfUnsaved: () => true,
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
  isArchived,
}: {
  documentId: number;
  data: Partial<Data>;
  versionId?: number;
  publishedVersionId?: number;
  versions: Version[];
  isArchived: boolean;
}) {
  const [currentData, setCurrentData] = useState<Data>(data as Data);
  const [currentSerializedData, setCurrentSerializedData] = useState<string>(
    () => JSON.stringify(data)
  );
  const [savedSerializedData, setSavedSerializedData] = useState<string>(
    () => JSON.stringify(data)
  );
  const [versions, setVersions] = useState(initialVersions);
  const [versionId, setVersionId] = useState(initialVersionId);
  const [publishedVersionId, setPublishedVersionId] = useState(
    initialPublishedVersionId
  );
  const suppressBeforeUnloadRef = useRef(false);

  const isDirty = useMemo(
    () => currentSerializedData !== savedSerializedData,
    [currentSerializedData, savedSerializedData]
  );

  const confirmNavigationIfUnsaved = useCallback(() => {
    if (!isDirty) {
      return true;
    }

    return window.confirm(UNSAVED_WARNING_MESSAGE);
  }, [isDirty]);

  const addVersion = useCallback((version: Version) => {
    setVersions((prev) => [version, ...prev]);
    setVersionId(version.id);
  }, []);

  const markSaved = useCallback((savedData: Data) => {
    setSavedSerializedData(JSON.stringify(savedData));
  }, []);

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
      if (suppressBeforeUnloadRef.current) {
        return;
      }

      event.preventDefault();
      event.returnValue = true;
    };

    window.addEventListener("beforeunload", beforeUnloadHandler);

    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, [isDirty]);

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const clickHandler = (event: MouseEvent) => {
      if (event.defaultPrevented) {
        return;
      }

      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;

      if (!anchor) {
        return;
      }

      if (anchor.target === "_blank" || anchor.hasAttribute("download")) {
        return;
      }

      const href = anchor.getAttribute("href");
      if (!href) {
        return;
      }

      const destination = new URL(href, window.location.href);
      const samePath = destination.pathname === window.location.pathname;
      const sameSearch = destination.search === window.location.search;
      const hashOnlyNavigation =
        samePath && sameSearch && destination.hash !== window.location.hash;

      if (hashOnlyNavigation) {
        return;
      }

      if (!confirmNavigationIfUnsaved()) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      suppressBeforeUnloadRef.current = true;
      window.setTimeout(() => {
        suppressBeforeUnloadRef.current = false;
      }, 1000);
    };

    document.addEventListener("click", clickHandler, true);
    return () => {
      document.removeEventListener("click", clickHandler, true);
    };
  }, [isDirty, confirmNavigationIfUnsaved]);

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    let ignoreNextPopState = false;

    const popStateHandler = () => {
      if (ignoreNextPopState) {
        ignoreNextPopState = false;
        return;
      }

      if (confirmNavigationIfUnsaved()) {
        return;
      }

      ignoreNextPopState = true;
      window.history.go(1);
    };

    window.addEventListener("popstate", popStateHandler);
    return () => {
      window.removeEventListener("popstate", popStateHandler);
    };
  }, [isDirty, confirmNavigationIfUnsaved]);

  return (
    <DocumentContext.Provider
      value={{
        documentId,
        versionId,
        publishedVersionId,
        versions,
        isArchived,
        isDirty,
        addVersion,
        markSaved,
        confirmNavigationIfUnsaved,
        setPublishedVersionId,
      }}
    >
      <Puck
        config={config}
        data={currentData}
        ui={{ plugin: { current: "version-plugin" } }}
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
          setCurrentSerializedData(JSON.stringify(data));
        }}
      />
    </DocumentContext.Provider>
  );
}
