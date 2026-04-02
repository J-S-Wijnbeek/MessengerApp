import { useEffect } from "react";

const LARGE_TEXT_KEY = "a11yLargeText";
const HIGH_CONTRAST_KEY = "a11yHighContrast";
const DARK_MODE_KEY = "uiDarkMode";
const COLOR_THEME_KEY = "uiColorTheme";
const A11Y_EVENT = "a11y-settings-changed";

export const COLOR_THEME_IDS = ["default", "ocean", "forest", "sunset", "lavender"] as const;
export type ColorThemeId = (typeof COLOR_THEME_IDS)[number];

function readBool(key: string, fallback: boolean) {
  if (typeof window === "undefined") return fallback;
  const stored = window.localStorage.getItem(key);
  if (stored === null) return fallback;
  return stored === "true";
}

export function applyA11yPrefsToDocument(prefs: {
  largeText: boolean;
  highContrast: boolean;
  darkMode?: boolean;
}) {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  el.classList.toggle("a11y-large-text", prefs.largeText);
  el.classList.toggle("a11y-high-contrast", prefs.highContrast);
  el.classList.toggle("dark", Boolean(prefs.darkMode));
}

export function readA11yPrefsFromStorage() {
  return {
    largeText: readBool(LARGE_TEXT_KEY, false),
    highContrast: readBool(HIGH_CONTRAST_KEY, false),
    darkMode: readBool(DARK_MODE_KEY, false),
  };
}

function isColorThemeId(value: string | null): value is ColorThemeId {
  return value !== null && (COLOR_THEME_IDS as readonly string[]).includes(value);
}

export function readColorThemeFromStorage(): ColorThemeId {
  if (typeof window === "undefined") return "default";
  const stored = window.localStorage.getItem(COLOR_THEME_KEY);
  if (stored && isColorThemeId(stored)) return stored;
  return "default";
}

export function applyColorThemeToDocument(themeId: ColorThemeId) {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  if (themeId === "default") {
    el.removeAttribute("data-color-theme");
  } else {
    el.setAttribute("data-color-theme", themeId);
  }
}

export function writeColorThemeToStorage(themeId: ColorThemeId) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COLOR_THEME_KEY, themeId);
  window.dispatchEvent(new Event(A11Y_EVENT));
}

export function writeA11yPrefToStorage(
  key: "largeText" | "highContrast" | "darkMode",
  value: boolean
) {
  if (typeof window === "undefined") return;
  const storageKey =
    key === "largeText" ? LARGE_TEXT_KEY : key === "highContrast" ? HIGH_CONTRAST_KEY : DARK_MODE_KEY;
  window.localStorage.setItem(storageKey, String(value));
  window.dispatchEvent(new Event(A11Y_EVENT));
}

export function useAccessibilityPreferences() {
  useEffect(() => {
    const apply = () => {
      applyA11yPrefsToDocument(readA11yPrefsFromStorage());
      applyColorThemeToDocument(readColorThemeFromStorage());
    };

    apply();

    window.addEventListener(A11Y_EVENT, apply);
    window.addEventListener("storage", apply);
    return () => {
      window.removeEventListener(A11Y_EVENT, apply);
      window.removeEventListener("storage", apply);
    };
  }, []);
}

