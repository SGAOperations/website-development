// Per-browser display preferences for the CMS (dashboard and editor). Published pages
// never read these, so the public site keeps SGA's own colors and follows only OS settings.

export const DISPLAY_SETTINGS_KEY = "sga-cms-display-settings";

export const themeOptions = ["system", "light", "dark"] as const;
export const contrastOptions = ["system", "standard", "more"] as const;
export const motionOptions = ["system", "full", "reduce"] as const;
export const textSizeOptions = ["87.5", "100", "112.5", "125", "150", "175", "200"] as const;

export type DisplaySettings = {
  theme: (typeof themeOptions)[number];
  contrast: (typeof contrastOptions)[number];
  motion: (typeof motionOptions)[number];
  /** Percentage of the browser's default text size. */
  textSize: (typeof textSizeOptions)[number];
};

export const defaultDisplaySettings: DisplaySettings = {
  theme: "system",
  contrast: "system",
  motion: "system",
  textSize: "100",
};

/**
 * Validate stored settings and write them onto <html> as data attributes:
 * data-theme="light|dark" and data-contrast="standard|more" (with "system" resolved from the OS),
 * data-motion="full|reduce" (absent for "system"; CSS reads the OS setting) and data-text-size.
 *
 * Self-contained on purpose: it is also serialized into an inline script that runs before
 * first paint (see displaySettingsScript), so it must not reference anything outside itself.
 */
export function applyDisplaySettings(root: HTMLElement, stored: unknown): DisplaySettings {
  const raw = (typeof stored === "object" && stored !== null ? stored : {}) as Record<string, unknown>;
  const pick = <T extends string>(value: unknown, allowed: readonly T[], fallback: T): T =>
    allowed.includes(value as T) ? (value as T) : fallback;
  const prefers = (query: string) => window.matchMedia(query).matches;

  const settings: DisplaySettings = {
    theme: pick(raw.theme, ["system", "light", "dark"], "system"),
    contrast: pick(raw.contrast, ["system", "standard", "more"], "system"),
    motion: pick(raw.motion, ["system", "full", "reduce"], "system"),
    textSize: pick(raw.textSize, ["87.5", "100", "112.5", "125", "150", "175", "200"], "100"),
  };

  root.dataset.theme =
    settings.theme === "system" ? (prefers("(prefers-color-scheme: dark)") ? "dark" : "light") : settings.theme;
  root.dataset.contrast =
    settings.contrast === "system" ? (prefers("(prefers-contrast: more)") ? "more" : "standard") : settings.contrast;
  if (settings.motion === "system") delete root.dataset.motion;
  else root.dataset.motion = settings.motion;
  root.dataset.textSize = settings.textSize;

  return settings;
}

/**
 * Editor routes that show a version the way visitors see it (/editor/:id/:slug[/:versionId]/preview).
 * Like published pages, they keep SGA's own look. Self-contained: it is serialized into displaySettingsScript.
 */
export function isSitePreviewPath(pathname: string): boolean {
  return /^\/editor\/[^/]+\/[^/]+(\/\d+)?\/preview\/?$/.test(pathname);
}

export function clearDisplaySettings(root: HTMLElement) {
  for (const key of ["theme", "contrast", "motion", "textSize"]) delete root.dataset[key];
}

export function readStoredDisplaySettings(): unknown {
  try {
    return JSON.parse(window.localStorage.getItem(DISPLAY_SETTINGS_KEY) ?? "null");
  } catch {
    return null;
  }
}

export function storeDisplaySettings(settings: DisplaySettings) {
  try {
    window.localStorage.setItem(DISPLAY_SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Storage can be blocked (private mode, policies); settings still apply for this visit.
  }
}

/** Inline <script> body that applies saved settings before the CMS first paints (no flash of light theme). */
export const displaySettingsScript = `(function(){try{if((${isSitePreviewPath.toString()})(location.pathname))return;var s=JSON.parse(localStorage.getItem(${JSON.stringify(
  DISPLAY_SETTINGS_KEY,
)})||"null");(${applyDisplaySettings.toString()})(document.documentElement,s)}catch(e){}})();`;
