"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

export type Keybind = {
  key: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
};

type KeybindTarget = Document | HTMLElement | Window | null | undefined;
type KeybindCallback = (event: KeyboardEvent, keybind: Keybind) => void;

function useStableTargetList<T>(values: readonly T[]) {
  const ref = useRef(values);

  if (ref.current.length !== values.length || ref.current.some((value, index) => value !== values[index])) {
    ref.current = values;
  }

  return ref.current;
}

function matchesKeybind(event: KeyboardEvent, keybind: Keybind) {
  return (
    event.key.toLowerCase() === keybind.key.toLowerCase() &&
    event.altKey === (keybind.altKey ?? false) &&
    event.ctrlKey === (keybind.ctrlKey ?? false) &&
    event.metaKey === (keybind.metaKey ?? false) &&
    event.shiftKey === (keybind.shiftKey ?? false)
  );
}

export function useKeybind(
  keybinds: readonly Keybind[],
  callback: KeybindCallback,
  targets: readonly KeybindTarget[] = [null],
  { capture = false, enabled = true }: { capture?: boolean; enabled?: boolean } = {},
) {
  const callbackRef = useRef(callback);
  const keybindsRef = useRef(keybinds);
  const stableTargets = useStableTargetList(targets);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useLayoutEffect(() => {
    keybindsRef.current = keybinds;
  }, [keybinds]);

  const handleKeydown = useCallback((event: KeyboardEvent) => {
    const matchedKeybind = keybindsRef.current.find((keybind) => matchesKeybind(event, keybind));

    if (!matchedKeybind) {
      return;
    }

    callbackRef.current(event, matchedKeybind);
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const fallbackTarget = typeof document === "undefined" ? null : document;
    const resolved = [...new Set(stableTargets.map((node) => node ?? fallbackTarget).filter(Boolean))] as EventTarget[];

    if (resolved.length === 0) {
      return;
    }

    resolved.forEach((node) => {
      node.addEventListener("keydown", handleKeydown as EventListener, capture);
    });

    return () => {
      resolved.forEach((node) => {
        node.removeEventListener("keydown", handleKeydown as EventListener, capture);
      });
    };
  }, [capture, enabled, handleKeydown, stableTargets]);
}
