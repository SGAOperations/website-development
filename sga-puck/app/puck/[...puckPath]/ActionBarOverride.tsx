"use client";

import { useCallback, useRef } from "react";
import { ActionBar, usePuck } from "@puckeditor/core";
import type { ComponentData, Config } from "@puckeditor/core";
import { Copy, CopyPlus, ClipboardPaste } from "lucide-react";

const CLIPBOARD_MARKER = "_puckClipboard";

type ClipboardPayload = {
  _puckClipboard: true;
  version: 1;
  component: ComponentData;
};

/** Check whether a prop is a slot by looking up its field definition in the config. */
function isSlotArray(
  propKey: string,
  componentType: string,
  config: Config
): boolean {
  const fieldDef = config.components?.[componentType]?.fields?.[propKey];
  return fieldDef?.type === "slot";
}

/** Recursively regenerate all `props.id` fields to avoid duplicates. */
function regenerateIds(
  component: ComponentData,
  config: Config
): ComponentData {
  const clone = structuredClone(component);
  clone.props.id = crypto.randomUUID();

  for (const key of Object.keys(clone.props)) {
    if (key === "id") continue;
    const val = clone.props[key];
    if (Array.isArray(val) && isSlotArray(key, clone.type, config)) {
      clone.props[key] = val.map((child: ComponentData) =>
        regenerateIds(child, config)
      );
    }
  }

  return clone;
}

async function copyComponent(component: ComponentData): Promise<void> {
  const payload: ClipboardPayload = {
    [CLIPBOARD_MARKER]: true,
    version: 1,
    component: structuredClone(component),
  };
  await navigator.clipboard.writeText(JSON.stringify(payload));
}

/**
 * Read and validate Puck clipboard data. Returns the raw component data
 * without modifying IDs — callers are responsible for calling regenerateIds.
 */
async function readFromClipboard(): Promise<ComponentData | null> {
  let text: string;
  try {
    text = await navigator.clipboard.readText();
  } catch (err) {
    console.warn("Clipboard access denied:", err);
    return null;
  }

  try {
    const parsed = JSON.parse(text);
    if (
      parsed?.[CLIPBOARD_MARKER] &&
      parsed?.version === 1 &&
      parsed?.component?.type &&
      parsed?.component?.props?.id
    ) {
      return parsed.component as ComponentData;
    }
  } catch {
    // Clipboard content is not JSON — not Puck data, safe to ignore
    console.warn("Clipboard does not contain valid Puck data");
  }
  return null;
}

export function ActionBarOverride({
  children,
  label,
  parentAction,
}: {
  children: React.ReactNode;
  label?: string;
  parentAction: React.ReactNode;
}) {
  const { selectedItem, config, dispatch, getSelectorForId } = usePuck();
  const isPastingRef = useRef(false);

  const handleDuplicate = useCallback(() => {
    if (!selectedItem) return;
    const selector = getSelectorForId(selectedItem.props.id);
    if (!selector) return;
    dispatch({
      type: "duplicate",
      sourceIndex: selector.index,
      sourceZone: selector.zone ?? "default-zone",
    });
  }, [selectedItem, dispatch, getSelectorForId]);

  const handleCopy = useCallback(async () => {
    if (!selectedItem) return;
    try {
      await copyComponent(selectedItem);
    } catch (err) {
      console.warn("Failed to copy component:", err);
    }
  }, [selectedItem]);

  const handlePaste = useCallback(async () => {
    if (isPastingRef.current) return;
    isPastingRef.current = true;
    try {
      if (!selectedItem) return;
      const selector = getSelectorForId(selectedItem.props.id);
      if (!selector) return;

      // Read and validate clipboard
      const raw = await readFromClipboard();
      if (!raw) {
        alert("Invalid clipboard data")
        return;
      }

      // Regenerate UUIDs of components
      const component = regenerateIds(raw, config);

      // Validate component type exists in config
      // (in case a user copies components from different versions, for example)
      if (!config.components?.[component.type]) {
        console.warn(
          `Cannot paste: unknown component type "${component.type}"`
        );
        return;
      }

      const zone = selector.zone ?? "default-zone";
      const index = selector.index + 1;

      // Puck's InsertAction only accepts componentType + position, not full
      // component data. We insert a stub first, then immediately replace it
      // with the full component data (including props and slot content).
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
        // Replace failed — remove the stub to avoid leaving a broken component
        dispatch({ type: "remove", index, zone });
      }
    } finally {
      isPastingRef.current = false;
    }
  }, [selectedItem, config, dispatch, getSelectorForId]);

  return (
    <ActionBar label={label}>
      <ActionBar.Group>
        <ActionBar.Action label="Duplicate" onClick={handleDuplicate}>
          <CopyPlus size={16} />
        </ActionBar.Action>
        <ActionBar.Action label="Copy" onClick={handleCopy}>
          <Copy size={16} />
        </ActionBar.Action>
        <ActionBar.Action label="Paste" onClick={handlePaste}>
          <ClipboardPaste size={16} />
        </ActionBar.Action>
        {children}
        {parentAction}
      </ActionBar.Group>
    </ActionBar>
  );
}
