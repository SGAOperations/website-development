"use client";

import { useCallback } from "react";
import { createUsePuck, type ComponentData } from "@puckeditor/core";
import { announce } from "@/components/ui/announcer";
import { describeComponent, ROOT_ISSUE_ID } from "@/lib/puck/a11y-check";
import { useDocumentContext } from "./document-context";

const usePuck = createUsePuck();

/** Puck's top-level drop zone ("root" area + "default-zone"). */
export const ROOT_ZONE = "root:default-zone";

export type InsertPosition = "after" | "inside" | "end";

/**
 * Keyboard and single-pointer alternatives to Puck's drag and drop (WCAG 2.1.1, 2.5.7):
 * select, move and insert blocks, announcing each result to screen readers.
 */
export function useBlockActions() {
  const dispatch = usePuck((s) => s.dispatch);
  const config = usePuck((s) => s.config);
  const data = usePuck((s) => s.appState.data);
  const selectedItem = usePuck((s) => s.selectedItem);
  const getSelectorForId = usePuck((s) => s.getSelectorForId);
  const getItemByIdUnsafe = usePuck((s) => s.getItemById);
  // Puck throws for ids it hasn't indexed yet, e.g. the placeholder shown while dragging.
  const getItemById = useCallback(
    (id: string): ComponentData | undefined => {
      try {
        return getItemByIdUnsafe(id);
      } catch {
        return undefined;
      }
    },
    [getItemByIdUnsafe],
  );
  const { isArchived } = useDocumentContext();
  const canEdit = !isArchived;

  const labelFor = useCallback(
    (type: string) => config.components[type]?.label ?? type,
    [config],
  );

  const describe = useCallback(
    (item: ComponentData) => describeComponent(item, labelFor(item.type)),
    [labelFor],
  );

  const zoneItems = useCallback(
    (zone: string): ComponentData[] => {
      if (zone === ROOT_ZONE) return data.content;
      const [parentId, slot] = zone.split(":");
      const value = getItemById(parentId)?.props[slot];
      return Array.isArray(value) ? value : (data.zones?.[zone] ?? []);
    },
    [data, getItemById],
  );

  const select = useCallback(
    (id: string) => {
      if (id === ROOT_ISSUE_ID) {
        dispatch({ type: "setUi", ui: { itemSelector: null } });
        announce("Selected the page. Its settings are in the Fields panel.");
        return;
      }

      const selector = getSelectorForId(id);
      const item = getItemById(id);
      if (!selector || !item) return;

      dispatch({ type: "setUi", ui: { itemSelector: selector } });
      announce(`Selected ${describe(item)}. Its settings are in the Fields panel.`);
    },
    [describe, dispatch, getItemById, getSelectorForId],
  );

  const move = useCallback(
    (direction: "up" | "down") => {
      if (!canEdit) return;
      if (!selectedItem) {
        announce("Select a block first.");
        return;
      }

      const selector = getSelectorForId(selectedItem.props.id);
      if (!selector) return;

      const items = zoneItems(selector.zone);
      const target = selector.index + (direction === "up" ? -1 : 1);
      const label = labelFor(selectedItem.type);

      if (target < 0 || target >= items.length) {
        announce(`${label} is already ${direction === "up" ? "first" : "last"} in its area.`);
        return;
      }

      dispatch({ type: "reorder", sourceIndex: selector.index, destinationIndex: target, destinationZone: selector.zone });
      dispatch({ type: "setUi", ui: { itemSelector: { index: target, zone: selector.zone } } });
      announce(`Moved ${label} ${direction}. Position ${target + 1} of ${items.length}.`);
    },
    [canEdit, dispatch, getSelectorForId, labelFor, selectedItem, zoneItems],
  );

  const insert = useCallback(
    (componentType: string, position: InsertPosition) => {
      if (!canEdit) return;

      let zone = ROOT_ZONE;
      let index = data.content.length;
      let where = "at the end of the page";

      if (selectedItem && position !== "end") {
        const selector = getSelectorForId(selectedItem.props.id);
        const parentLabel = labelFor(selectedItem.type);
        const slot = position === "inside" ? getSlotFor(config.components[selectedItem.type]?.fields, componentType) : undefined;

        if (slot) {
          zone = `${selectedItem.props.id}:${slot}`;
          index = zoneItems(zone).length;
          where = `inside ${parentLabel}`;
        } else if (selector) {
          zone = selector.zone;
          index = selector.index + 1;
          where = `after ${parentLabel}`;
        }
      }

      dispatch({ type: "insert", componentType, destinationIndex: index, destinationZone: zone });
      dispatch({ type: "setUi", ui: { itemSelector: { index, zone } } });
      announce(`Added ${labelFor(componentType)} ${where}. It is selected.`);
    },
    [canEdit, config, data.content.length, dispatch, getSelectorForId, labelFor, selectedItem, zoneItems],
  );

  return { canEdit, labelFor, describe, select, move, insert, getItemById };
}

type FieldMap = Record<string, { type: string; allow?: string[]; disallow?: string[]; visible?: boolean }> | undefined;

/** First slot of a component that accepts `componentType`, honouring allow/disallow lists. */
function getSlotFor(fields: unknown, componentType: string): string | undefined {
  return Object.entries((fields as FieldMap) ?? {}).find(
    ([, field]) =>
      field.type === "slot" &&
      (!field.allow || field.allow.includes(componentType)) &&
      !field.disallow?.includes(componentType),
  )?.[0];
}

/** True when keyboard focus is in a text field, where arrow-key shortcuts must not fire. */
export function isEditableTarget(target: EventTarget | null) {
  // Duck-typed: elements inside the canvas iframe aren't instances of this window's Element.
  const element = target as Element | null;
  if (typeof element?.closest !== "function") return false;
  return Boolean(element.closest("input, textarea, select, [contenteditable=''], [contenteditable='true']"));
}
