"use client";

import { useCallback, useRef } from "react";
import { useKeybind, type Keybind } from "./useKeybind";
import { createUsePuck } from "@puckeditor/core";
import type { ComponentData } from "@puckeditor/core";

const usePuck = createUsePuck();
const CLIPBOARD_MARKER = "_puckClipboard";

type ClipboardPayload = {
  _puckClipboard: true;
  version: 1;
  component: ComponentData;
};

const EDITOR_KEYBINDS = {
  undo: [
    { key: "z", ctrlKey: true },
    { key: "z", metaKey: true },
  ],
  redo: [
    { key: "z", ctrlKey: true, shiftKey: true },
    { key: "z", metaKey: true, shiftKey: true },
    { key: "y", ctrlKey: true },
    { key: "y", metaKey: true },
  ],
  cut: [
    { key: "x", ctrlKey: true },
    { key: "x", metaKey: true },
  ],
  copy: [
    { key: "c", ctrlKey: true },
    { key: "c", metaKey: true },
  ],
  paste: [
    { key: "v", ctrlKey: true },
    { key: "v", metaKey: true },
  ],
  delete: [{ key: "Delete" }],
  save: [
    { key: "s", ctrlKey: true },
    { key: "s", metaKey: true },
  ],
} as Record<string, Keybind[]>;

async function copyComponent(component: ComponentData): Promise<void> {
  const payload: ClipboardPayload = {
    [CLIPBOARD_MARKER]: true,
    version: 1,
    component: structuredClone(component),
  };
  await navigator.clipboard.writeText(JSON.stringify(payload));
}

async function readFromClipboard(): Promise<ComponentData | null> {
  try {
    const text = await navigator.clipboard.readText();
    const parsed = JSON.parse(text);
    if (
      parsed[CLIPBOARD_MARKER] &&
      parsed.version === 1 &&
      parsed.component?.type &&
      parsed.component?.props?.id
    ) {
      return parsed.component as ComponentData;
    }
  } catch {
    return null;
  }
  return null;
}

function regenerateIds(component: ComponentData, config: any): ComponentData {
  const clone = structuredClone(component);
  clone.props.id = crypto.randomUUID();

  for (const key of Object.keys(clone.props)) {
    if (key === "id") continue;
    const val = clone.props[key];
    if (Array.isArray(val)) {
      const fieldDef = config.components?.[clone.type]?.fields?.[key];
      if (fieldDef?.type === "slot") {
        clone.props[key] = val.map((child: ComponentData) =>
          regenerateIds(child, config)
        );
      }
    }
  }

  return clone;
}

function useUndo() {
  const back = usePuck((s) => s.history.back);
  return useCallback(() => back(), [back]);
}

function useRedo() {
  const forward = usePuck((s) => s.history.forward);
  return useCallback(() => forward(), [forward]);
}

function useCopy() {
  const selectedItem = usePuck((s) => s.selectedItem);
  return useCallback(async () => {
    if (!selectedItem) return;
    try {
      await copyComponent(selectedItem);
    } catch (err) {
      console.warn("Failed to copy component:", err);
    }
  }, [selectedItem]);
}

function usePaste() {
  const selectedItem = usePuck((s) => s.selectedItem);
  const config = usePuck((s) => s.config);
  const dispatch = usePuck((s) => s.dispatch);
  const getSelectorForId = usePuck((s) => s.getSelectorForId);
  const isPastingRef = useRef(false);

  return useCallback(async () => {
    if (isPastingRef.current || !selectedItem) return;
    isPastingRef.current = true;

    try {
      const selector = getSelectorForId(selectedItem.props.id);
      if (!selector) return;

      const raw = await readFromClipboard();
      if (!raw) return;

      const component = regenerateIds(raw, config);

      if (!config.components?.[component.type]) return;

      const zone = selector.zone ?? "default-zone";
      const index = selector.index + 1;

      dispatch({
        type: "insert",
        componentType: component.type,
        destinationIndex: index,
        destinationZone: zone,
        id: component.props.id,
      });

      try {
        dispatch({
          type: "replace",
          destinationIndex: index,
          destinationZone: zone,
          data: component,
        });
      } catch {
        dispatch({ type: "remove", index, zone });
      }
    } finally {
      isPastingRef.current = false;
    }
  }, [selectedItem, config, dispatch, getSelectorForId]);
}

function useCut() {
  const selectedItem = usePuck((s) => s.selectedItem);
  const dispatch = usePuck((s) => s.dispatch);
  const getSelectorForId = usePuck((s) => s.getSelectorForId);
  const copy = useCopy();

  return useCallback(async () => {
    if (!selectedItem) return;
    await copy();

    const selector = getSelectorForId(selectedItem.props.id);
    if (!selector) return;

    dispatch({
      type: "remove",
      index: selector.index,
      zone: selector.zone ?? "default-zone",
    });
  }, [selectedItem, dispatch, getSelectorForId, copy]);
}

function useDelete() {
  const selectedItem = usePuck((s) => s.selectedItem);
  const dispatch = usePuck((s) => s.dispatch);
  const getSelectorForId = usePuck((s) => s.getSelectorForId);

  return useCallback(() => {
    if (!selectedItem) return;

    const selector = getSelectorForId(selectedItem.props.id);
    if (!selector) return;

    dispatch({
      type: "remove",
      index: selector.index,
      zone: selector.zone ?? "default-zone",
    });
  }, [selectedItem, dispatch, getSelectorForId]);
}

export function useEditorKeybindings(
  target: Document | HTMLElement | Window | null | undefined = null,
  enabled = true,
) {
  const undo = useUndo();
  const redo = useRedo();
  const copy = useCopy();
  const paste = usePaste();
  const cut = useCut();
  const deleteItem = useDelete();

  const actions = [
    { keybind: "undo", handler: undo },
    { keybind: "redo", handler: redo },
    { keybind: "copy", handler: copy },
    { keybind: "paste", handler: paste },
    { keybind: "cut", handler: cut },
    { keybind: "delete", handler: deleteItem },
  ];

  actions.forEach(({ keybind, handler }) => {
    useKeybind(
      EDITOR_KEYBINDS[keybind],
      (event) => {
        event.preventDefault();
        handler();
      },
      [target],
      { capture: true, enabled },
    );
  });
}
