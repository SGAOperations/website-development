"use client";

import { useEffect, useRef } from "react";
import { createUsePuck } from "@puckeditor/core";
import type { ComponentData, Config } from "@puckeditor/core";

const usePuck = createUsePuck();
const CLIPBOARD_MARKER = "_puckClipboard";

type ClipboardPayload = {
  _puckClipboard: true;
  version: 1;
  component: ComponentData;
};

// Undo, redo and Delete/Backspace are not handled here: Puck already binds
// them (and its Delete skips text being edited). Cmd/Ctrl+S is handled by
// useEditorSaveHotkey. This hook only adds copy, cut and paste for blocks.
//
// It listens to the browser's copy/cut/paste events rather than raw key
// presses, so normal text editing keeps working:
// - copy/cut act on the selected block only when no text is highlighted
// - paste inserts a block only when the clipboard holds a copied block
// Reading the clipboard from the paste event also avoids the permission
// prompt that navigator.clipboard.readText() triggers.

function serializeComponent(component: ComponentData): string {
  const payload: ClipboardPayload = {
    [CLIPBOARD_MARKER]: true,
    version: 1,
    component: structuredClone(component),
  };
  return JSON.stringify(payload);
}

function parseComponent(text: string): ComponentData | null {
  try {
    const parsed = JSON.parse(text);
    if (
      parsed?.[CLIPBOARD_MARKER] &&
      parsed.version === 1 &&
      parsed.component?.type &&
      parsed.component?.props?.id
    ) {
      return parsed.component as ComponentData;
    }
  } catch {
    // Not a copied block: let the browser paste it as text.
  }
  return null;
}

function regenerateIds(component: ComponentData, config: Config): ComponentData {
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

// True when the user is working with text, so the browser should handle the
// clipboard: focus in a form field, or text highlighted on the canvas.
function isWorkingWithText(doc: Document): boolean {
  const tag = doc.activeElement?.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  const selection = doc.getSelection();
  return Boolean(selection && !selection.isCollapsed && selection.toString());
}

function takeOverEvent(event: ClipboardEvent) {
  event.preventDefault();
  // Stop the canvas rich-text editor from also handling it.
  event.stopImmediatePropagation();
}

export function useEditorKeybindings(
  target: Document | null | undefined,
  enabled = true,
) {
  const selectedItem = usePuck((s) => s.selectedItem);
  const config = usePuck((s) => s.config);
  const dispatch = usePuck((s) => s.dispatch);
  const getSelectorForId = usePuck((s) => s.getSelectorForId);

  // Listeners are attached once per document; they read the latest editor
  // state from this ref.
  const puckRef = useRef({ selectedItem, config, dispatch, getSelectorForId });
  useEffect(() => {
    puckRef.current = { selectedItem, config, dispatch, getSelectorForId };
  }, [selectedItem, config, dispatch, getSelectorForId]);

  useEffect(() => {
    if (!enabled || !target) return;

    function removeSelected() {
      const { selectedItem, dispatch, getSelectorForId } = puckRef.current;
      if (!selectedItem) return;
      const selector = getSelectorForId(selectedItem.props.id);
      if (!selector) return;
      dispatch({
        type: "remove",
        index: selector.index,
        zone: selector.zone ?? "default-zone",
      });
    }

    function onCopyOrCut(event: ClipboardEvent) {
      const { selectedItem } = puckRef.current;
      if (!selectedItem || !event.clipboardData || isWorkingWithText(target!)) {
        return;
      }
      event.clipboardData.setData("text/plain", serializeComponent(selectedItem));
      takeOverEvent(event);
      if (event.type === "cut") removeSelected();
    }

    function onPaste(event: ClipboardEvent) {
      const { selectedItem, config, dispatch, getSelectorForId } = puckRef.current;
      const raw = parseComponent(event.clipboardData?.getData("text/plain") ?? "");
      if (!raw || !selectedItem) return;
      takeOverEvent(event);

      if (!config.components?.[raw.type]) return;
      const selector = getSelectorForId(selectedItem.props.id);
      if (!selector) return;

      const component = regenerateIds(raw, config);
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
    }

    target.addEventListener("copy", onCopyOrCut, true);
    target.addEventListener("cut", onCopyOrCut, true);
    target.addEventListener("paste", onPaste, true);
    return () => {
      target.removeEventListener("copy", onCopyOrCut, true);
      target.removeEventListener("cut", onCopyOrCut, true);
      target.removeEventListener("paste", onPaste, true);
    };
  }, [target, enabled]);
}
