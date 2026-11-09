"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  applyDisplaySettings,
  clearDisplaySettings,
  defaultDisplaySettings,
  DISPLAY_SETTINGS_KEY,
  isSitePreviewPath,
  readStoredDisplaySettings,
  storeDisplaySettings,
  type DisplaySettings,
} from "@/lib/display-settings";

type DisplaySettingsContextValue = {
  settings: DisplaySettings;
  update: (changes: Partial<DisplaySettings>) => void;
  reset: () => void;
};

const DisplaySettingsContext = createContext<DisplaySettingsContextValue>({
  settings: defaultDisplaySettings,
  update: () => {},
  reset: () => {},
});

const OS_QUERIES = ["(prefers-color-scheme: dark)", "(prefers-contrast: more)"];

export function DisplaySettingsProvider({ children }: { children: ReactNode }) {
  // null until loaded, so we never overwrite what the pre-paint script applied with the defaults.
  const [settings, setSettings] = useState<DisplaySettings | null>(null);
  // Version previews show the page as visitors see it, so they keep the site's own look.
  const showsSite = isSitePreviewPath(usePathname());

  // Load once on the client; the inline script has already applied them before paint.
  useEffect(() => {
    if (showsSite || settings) return;
    setSettings(applyDisplaySettings(document.documentElement, readStoredDisplaySettings()));
  }, [showsSite, settings]);

  useEffect(() => {
    const root = document.documentElement;
    if (showsSite) {
      clearDisplaySettings(root);
      return;
    }
    if (!settings) return;
    applyDisplaySettings(root, settings);

    // "System" choices follow the OS live, e.g. when it switches to dark mode at sunset.
    const queries = OS_QUERIES.map((q) => window.matchMedia(q));
    const onOsChange = () => applyDisplaySettings(root, settings);
    queries.forEach((q) => q.addEventListener("change", onOsChange));

    // Keep other open CMS tabs in sync.
    const onStorage = (event: StorageEvent) => {
      if (event.key === DISPLAY_SETTINGS_KEY) setSettings(applyDisplaySettings(root, readStoredDisplaySettings()));
    };
    window.addEventListener("storage", onStorage);

    return () => {
      queries.forEach((q) => q.removeEventListener("change", onOsChange));
      window.removeEventListener("storage", onStorage);
    };
  }, [settings, showsSite]);

  // Leaving the CMS (e.g. client navigation to a published page) restores the site's own look.
  useEffect(() => () => clearDisplaySettings(document.documentElement), []);

  const update = useCallback((changes: Partial<DisplaySettings>) => {
    setSettings((previous) => {
      const next = { ...(previous ?? defaultDisplaySettings), ...changes };
      storeDisplaySettings(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    storeDisplaySettings(defaultDisplaySettings);
    setSettings(defaultDisplaySettings);
  }, []);

  return <DisplaySettingsContext value={{ settings: settings ?? defaultDisplaySettings, update, reset }}>{children}</DisplaySettingsContext>;
}

export function useDisplaySettings() {
  return useContext(DisplaySettingsContext);
}
