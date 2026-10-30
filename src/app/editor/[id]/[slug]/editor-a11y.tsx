"use client";

import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createUsePuck } from "@puckeditor/core";
import { Keyboard, Plus } from "lucide-react";
import { useKeybind } from "@/hooks/useKeybind";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { isEditableTarget, useBlockActions, type InsertPosition } from "./block-actions";

const usePuck = createUsePuck();

// -- Blocks drawer: click/keyboard insertion instead of drag only --------------

const InsertPositionContext = createContext<InsertPosition>("after");

const insertPositions: { value: InsertPosition; label: string }[] = [
  { value: "after", label: "After the selected block" },
  { value: "inside", label: "Inside the selected block" },
  { value: "end", label: "At the end of the page" },
];

export function BlocksDrawer({ children }: { children?: ReactNode }) {
  const [position, setPosition] = useState<InsertPosition>("after");
  const name = useId();

  return (
    <InsertPositionContext value={position}>
      <section aria-label="Blocks">
        <fieldset className="mb-3 flex flex-col gap-0.5 px-1 text-sm">
          <legend className="mb-1 text-xs font-semibold text-foreground">Add blocks</legend>
          {insertPositions.map((option) => (
            <label key={option.value} className="flex min-h-6 cursor-pointer items-center gap-2">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={position === option.value}
                onChange={() => setPosition(option.value)}
                className="size-4 accent-blue-600"
              />
              {option.label}
            </label>
          ))}
          <p className="mt-1 text-xs text-muted-foreground">Drag a block onto the page, or press its Add (+) button.</p>
        </fieldset>
        {children}
      </section>
    </InsertPositionContext>
  );
}

export function DrawerItemOverride({ children, name }: { children: ReactNode; name: string }) {
  const position = useContext(InsertPositionContext);
  const { canEdit, insert, labelFor } = useBlockActions();
  const label = `Add ${labelFor(name)}`;

  return (
    <div className="flex items-center gap-1">
      <div className="min-w-0 flex-1">{children}</div>
      <button
        type="button"
        title={label}
        aria-label={label}
        disabled={!canEdit}
        // The drawer item cancels mousedown to stop text selection; let this button take focus.
        onMouseDown={(e) => e.stopPropagation()}
        onClick={() => insert(name, position)}
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-input bg-background text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}

// -- Canvas: name blocks, select with Enter/Space, move with shortcuts ---------

const MOVE_KEYBINDS = [
  { key: "ArrowUp", altKey: true, shiftKey: true },
  { key: "ArrowDown", altKey: true, shiftKey: true },
] as const;

/** Alt+Shift+Up/Down moves the selected block, in the editor and inside the canvas iframe. */
export function useMoveHotkeys(target?: Document | null, enabled = true) {
  const { move } = useBlockActions();

  useKeybind(
    MOVE_KEYBINDS,
    (event) => {
      if (isEditableTarget(event.target)) return;
      event.preventDefault();
      move(event.key === "ArrowUp" ? "up" : "down");
    },
    [target],
    { capture: true, enabled },
  );
}

const CANVAS_HINT_ID = "puck-canvas-a11y-hint";

/**
 * Puck draws each block as an unnamed role="button" "draggable" that contains other controls,
 * and only a mouse can select or drag it. Make blocks named groups that Enter/Space selects.
 */
export function useCanvasA11y(doc?: Document) {
  const data = usePuck((s) => s.appState.data);
  const { describe, select, getItemById } = useBlockActions();
  const latest = useRef({ describe, select, getItemById });
  latest.current = { describe, select, getItemById };

  useEffect(() => {
    if (!doc?.body) return;

    doc.defaultView?.frameElement?.setAttribute("title", "Page canvas");

    if (!doc.getElementById(CANVAS_HINT_ID)) {
      const hint = doc.createElement("div");
      hint.id = CANVAS_HINT_ID;
      hint.hidden = true;
      hint.textContent = "Press Enter to select. Alt+Shift+Up or Down moves the selected block.";
      doc.body.append(hint);
    }

    const label = () => {
      // Puck rewrites the iframe <head>, so keep restoring the title.
      if (doc.title !== "Page canvas") doc.title = "Page canvas";

      doc.querySelectorAll<HTMLElement>("[data-puck-component]").forEach((el) => {
        const item = latest.current.getItemById(el.dataset.puckComponent ?? "");
        if (!item) return;
        setAttrs(el, {
          role: "group",
          "aria-label": latest.current.describe(item),
          "aria-roledescription": "block",
          "aria-describedby": CANVAS_HINT_ID,
          "aria-pressed": null,
          "aria-grabbed": null,
          "aria-disabled": null,
        });
      });
    };

    label();
    const observer = new MutationObserver(label);
    observer.observe(doc.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["role", "aria-label", "aria-roledescription", "aria-describedby", "aria-pressed", "aria-grabbed", "aria-disabled"],
    });

    const onKeyDown = (event: KeyboardEvent) => {
      const el = event.target as HTMLElement | null;
      if ((event.key !== "Enter" && event.key !== " ") || !el?.dataset?.puckComponent) return;
      event.preventDefault();
      latest.current.select(el.dataset.puckComponent);
    };
    doc.addEventListener("keydown", onKeyDown);

    return () => {
      observer.disconnect();
      doc.removeEventListener("keydown", onKeyDown);
    };
  }, [doc, data]);
}

/** Set attributes only when they differ (so MutationObservers settle); null removes one. */
function setAttrs(el: Element, attrs: Record<string, string | null>) {
  for (const [name, value] of Object.entries(attrs)) {
    if (value === null) {
      if (el.hasAttribute(name)) el.removeAttribute(name);
    } else if (el.getAttribute(name) !== value) {
      el.setAttribute(name, value);
    }
  }
}

// -- Puck chrome fixes ---------------------------------------------------------

// Puck 0.21.1 (pinned in package.json) leaves these controls unlabelled or misleading. Class
// names are CSS-module hashes, so match on the stable prefix. Re-check after upgrading Puck.
const PUCK_PATCHES: { selector: string; attrs: Record<string, string | null> }[] = [
  { selector: 'select[class*="_ViewportControls-zoomSelect"]', attrs: { "aria-label": "Zoom" } },
  { selector: 'span[class*="_Loader_"]', attrs: { role: "status", "aria-label": "Loading" } },
  { selector: "iframe#preview-frame", attrs: { title: "Page canvas" } },
  { selector: '.tiptap[role="textbox"]', attrs: { "aria-label": "Text content", "aria-multiline": "true" } },
  // Each drawer item is drawn twice; the copy behind it is only a drag placeholder.
  { selector: '[class*="_Drawer-draggableBg_"]', attrs: { inert: "", "aria-hidden": "true" } },
  // Drawer items announce as keyboard-draggable buttons, but only a mouse can drag them.
  // Make them plain containers so keyboard users land on the Add button instead.
  {
    selector: "[data-puck-drawer-item]",
    attrs: {
      tabindex: null,
      role: null,
      "aria-roledescription": null,
      "aria-describedby": null,
      "aria-pressed": null,
      "aria-grabbed": null,
      "aria-disabled": null,
    },
  },
];

// Plugin rail items (Versions, Blocks, Outline, Checks) are click-only divs; they become buttons below.
const NAV_ITEM_SELECTOR = '[class*="_NavItem-link_"]';

// The rich text toolbar's icon-only dropdowns, in Puck's default order.
const RICH_TEXT_SELECT_NAMES = ["Text style", "List", "Alignment"];

const PATCHED_ATTRIBUTES = [
  ...new Set([...PUCK_PATCHES.flatMap(({ attrs }) => Object.keys(attrs)), "aria-label"]),
];

/** Fix Puck's markup in `doc` (the editor, or the canvas iframe) and keep it fixed. */
export function useEditorA11yPatches(doc?: Document, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const root = doc ?? document;
    if (!root.body) return;

    const apply = () => {
      for (const { selector, attrs } of PUCK_PATCHES) {
        root.querySelectorAll(selector).forEach((el) => setAttrs(el, attrs));
      }
      root.querySelectorAll(NAV_ITEM_SELECTOR).forEach((item) => {
        const isOpen = Boolean(item.closest('[class*="_NavItem--active_"]'));
        setAttrs(item, { role: "button", tabindex: "0", "aria-pressed": String(isOpen) });
      });
      root.querySelectorAll('[class*="_RichTextMenu_"]').forEach((menu) => {
        menu.querySelectorAll('button[class*="_Select-button_"]').forEach((button, i) => {
          const name = RICH_TEXT_SELECT_NAMES[i];
          if (name) setAttrs(button, { "aria-label": name, title: name });
        });
      });
    };

    apply();
    // Watch attributes too: Puck's drag library re-applies its own on every render.
    const observer = new MutationObserver(apply);
    observer.observe(root.body, { subtree: true, childList: true, attributes: true, attributeFilter: PATCHED_ATTRIBUTES });

    // Rail items only listen for clicks, so Enter and Space click them (WCAG 2.1.1).
    const onKeyDown = (event: KeyboardEvent) => {
      const el = event.target as HTMLElement | null;
      if ((event.key !== "Enter" && event.key !== " ") || !el?.matches?.(NAV_ITEM_SELECTOR)) return;
      event.preventDefault();
      el.click();
    };
    root.addEventListener("keydown", onKeyDown);

    return () => {
      observer.disconnect();
      root.removeEventListener("keydown", onKeyDown);
    };
  }, [doc, enabled]);
}

// -- Landmarks -----------------------------------------------------------------

export function PreviewRegion({ children }: { children?: ReactNode }) {
  return <main aria-label="Page canvas" className="h-full">{children}</main>;
}

export function FieldsRegion({ children }: { children?: ReactNode }) {
  return <section aria-label="Fields">{children}</section>;
}

// -- Help ----------------------------------------------------------------------

const shortcuts: { keys: string[]; action: string }[] = [
  { keys: ["Ctrl", "S"], action: "Save (⌘ S on Mac)" },
  { keys: ["Enter"], action: "Select the focused block on the canvas" },
  { keys: ["Alt", "Shift", "↑"], action: "Move the selected block up (⌥ ⇧ ↑ on Mac)" },
  { keys: ["Alt", "Shift", "↓"], action: "Move the selected block down" },
  { keys: ["Alt", "T"], action: "Jump to notifications" },
  { keys: ["Esc"], action: "Close a dialog" },
];

export function AccessibilityHelpButton() {
  return (
    <Dialog>
      <DialogTrigger
        render={<Button variant="ghost" size="icon" title="Keyboard and accessibility help" aria-label="Keyboard and accessibility help" />}
      >
        <Keyboard />
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Keyboard and accessibility help</DialogTitle>
          <DialogDescription>Everything in the editor works without a mouse.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 text-sm">
          <section>
            <h3 className="mb-1 font-semibold">Working with blocks</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li><strong>Add:</strong> open Blocks, choose where new blocks go, then press the block&apos;s Add (+) button.</li>
              <li><strong>Select:</strong> Tab to a block on the canvas and press Enter, or pick it in Outline.</li>
              <li><strong>Move:</strong> use Move up / Move down in the block toolbar, or the shortcuts below.</li>
              <li><strong>Check:</strong> the Checks panel lists accessibility problems; choose one to select its block.</li>
            </ul>
          </section>

          <section>
            <h3 className="mb-1 font-semibold">Shortcuts</h3>
            <table className="w-full text-left">
              <thead className="sr-only">
                <tr>
                  <th scope="col">Keys</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {shortcuts.map(({ keys, action }) => (
                  <tr key={action} className="border-t">
                    <td className="py-1.5 pr-3 whitespace-nowrap">
                      {keys.map((key, i) => (
                        <span key={key}>
                          {i > 0 && " + "}
                          <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs">{key}</kbd>
                        </span>
                      ))}
                    </td>
                    <td className="py-1.5">{action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
