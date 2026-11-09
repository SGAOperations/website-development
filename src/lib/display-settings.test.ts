import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  applyDisplaySettings,
  clearDisplaySettings,
  DISPLAY_SETTINGS_KEY,
  displaySettingsScript,
  isSitePreviewPath,
} from "./display-settings";

function fakeRoot() {
  return { dataset: {} as Record<string, string | undefined> } as unknown as HTMLElement;
}

function mockOs({ dark = false, moreContrast = false } = {}) {
  vi.stubGlobal("window", {
    matchMedia: (query: string) => ({
      matches:
        (query === "(prefers-color-scheme: dark)" && dark) ||
        (query === "(prefers-contrast: more)" && moreContrast),
    }),
  });
}

describe("applyDisplaySettings", () => {
  beforeEach(() => mockOs());
  afterEach(() => vi.unstubAllGlobals());

  it("defaults everything to the OS and 100% text", () => {
    const root = fakeRoot();
    expect(applyDisplaySettings(root, null)).toEqual({ theme: "system", contrast: "system", motion: "system", textSize: "100" });
    expect(root.dataset).toEqual({ theme: "light", contrast: "standard", textSize: "100" });
  });

  it("resolves system theme and contrast from the OS", () => {
    mockOs({ dark: true, moreContrast: true });
    const root = fakeRoot();
    applyDisplaySettings(root, {});
    expect(root.dataset).toMatchObject({ theme: "dark", contrast: "more" });
  });

  it("lets explicit choices override the OS", () => {
    mockOs({ dark: true });
    const root = fakeRoot();
    applyDisplaySettings(root, { theme: "light", contrast: "more", motion: "reduce", textSize: "150" });
    expect(root.dataset).toEqual({ theme: "light", contrast: "more", motion: "reduce", textSize: "150" });
  });

  it("ignores invalid stored values", () => {
    const root = fakeRoot();
    expect(applyDisplaySettings(root, { theme: "purple", textSize: "999", motion: 3 })).toMatchObject({
      theme: "system",
      motion: "system",
      textSize: "100",
    });
  });

  it("drops data-motion when switching back to system, and clears everything", () => {
    const root = fakeRoot();
    applyDisplaySettings(root, { motion: "full" });
    expect(root.dataset.motion).toBe("full");
    applyDisplaySettings(root, { motion: "system" });
    expect(root.dataset.motion).toBeUndefined();
    clearDisplaySettings(root);
    expect(root.dataset).toEqual({});
  });
});

describe("displaySettingsScript", () => {
  afterEach(() => vi.unstubAllGlobals());

  function runScript(pathname: string) {
    const root = fakeRoot();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => (key === DISPLAY_SETTINGS_KEY ? JSON.stringify({ theme: "dark", textSize: "125" }) : null),
    });
    vi.stubGlobal("document", { documentElement: root });
    vi.stubGlobal("location", { pathname });
    mockOs();

    new Function(displaySettingsScript)();
    return root.dataset;
  }

  it("applies saved settings on its own, before React loads", () => {
    expect(runScript("/editor/1/home")).toEqual({ theme: "dark", contrast: "standard", textSize: "125" });
  });

  it("leaves version previews with the site's own look", () => {
    expect(runScript("/editor/1/home/preview")).toEqual({});
    expect(runScript("/editor/1/home/7/preview")).toEqual({});
  });

  it("never throws, even when storage is unavailable", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("blocked");
      },
    });
    expect(() => new Function(displaySettingsScript)()).not.toThrow();
  });
});

describe("isSitePreviewPath", () => {
  it("matches only preview routes", () => {
    expect(isSitePreviewPath("/editor/1/home/preview")).toBe(true);
    expect(isSitePreviewPath("/editor/1/home/7/preview/")).toBe(true);
    expect(isSitePreviewPath("/editor")).toBe(false);
    expect(isSitePreviewPath("/editor/1/preview-page")).toBe(false);
    // A document whose slug is "preview" is still edited with the CMS look.
    expect(isSitePreviewPath("/editor/1/preview")).toBe(false);
    expect(isSitePreviewPath("/editor/1/preview/preview")).toBe(true);
  });
});
