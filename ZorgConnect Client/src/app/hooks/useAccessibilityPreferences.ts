import { useEffect } from "react";

const LARGE_TEXT_KEY = "a11yLargeText";
const HIGH_CONTRAST_KEY = "a11yHighContrast";
const A11Y_EVENT = "a11y-settings-changed";

function readBool(key: string, fallback: boolean) {
  if (typeof window === "undefined") return fallback;
  const stored = window.localStorage.getItem(key);
  if (stored === null) return fallback;
  return stored === "true";
}

export function applyA11yPrefsToDocument(prefs: {
  largeText: boolean;
  highContrast: boolean;
}) {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  el.classList.toggle("a11y-large-text", prefs.largeText);
  el.classList.toggle("a11y-high-contrast", prefs.highContrast);
}

export function readA11yPrefsFromStorage() {
  return {
    largeText: readBool(LARGE_TEXT_KEY, false),
    highContrast: readBool(HIGH_CONTRAST_KEY, false),
  };
}

export function writeA11yPrefToStorage(key: "largeText" | "highContrast", value: boolean) {
  if (typeof window === "undefined") return;
  const storageKey = key === "largeText" ? LARGE_TEXT_KEY : HIGH_CONTRAST_KEY;
  window.localStorage.setItem(storageKey, String(value));
  window.dispatchEvent(new Event(A11Y_EVENT));
}

export function useAccessibilityPreferences() {
  useEffect(() => {
    const apply = () => applyA11yPrefsToDocument(readA11yPrefsFromStorage());

    apply();

    window.addEventListener(A11Y_EVENT, apply);
    window.addEventListener("storage", apply);
    return () => {
      window.removeEventListener(A11Y_EVENT, apply);
      window.removeEventListener("storage", apply);
    };
  }, []);
}

