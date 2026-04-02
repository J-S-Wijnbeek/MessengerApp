import { useState } from "react";
import { useNavigate } from "react-router";
import { User, Bell, Shield, HelpCircle, FileText, LogOut } from "lucide-react";
import { useToggle } from "../../../hooks/useToggle";
import {
  applyA11yPrefsToDocument,
  readA11yPrefsFromStorage,
  writeA11yPrefToStorage,
  readColorThemeFromStorage,
  writeColorThemeToStorage,
  type ColorThemeId,
} from "../../../hooks/useAccessibilityPreferences";

const AUTH_STORAGE_KEY = "zorgconnect:client:isAuthed";

export type ClientInstellingenHook = {
  navigate: ReturnType<typeof useNavigate>;
  berichtenNotif: boolean;
  toggleBerichtenNotif: () => void;
  afsprakenNotif: boolean;
  toggleAfsprakenNotif: () => void;
  sosBevestiging: boolean;
  handleSosToggle: (next: boolean) => void;
  locatieDelen: boolean;
  toggleLocatieDelen: (next: boolean) => void;
  faceId: boolean;
  toggleFaceId: () => void;
  groteTekst: boolean;
  toggleGroteTekst: (next: boolean) => void;
  hoogContrast: boolean;
  toggleHoogContrast: (next: boolean) => void;
  darkMode: boolean;
  toggleDarkMode: (next: boolean) => void;
  colorTheme: ColorThemeId;
  setColorTheme: (theme: ColorThemeId) => void;
  handleLogout: () => void;
  settingsOptions: Array<{
    icon: any;
    label: string;
    action: () => void;
    isDestructive?: boolean;
  }>;
};

export function useClientInstellingen() {
  const navigate = useNavigate();
  const { value: berichtenNotif, toggle: toggleBerichtenNotif } = useToggle(true);
  const { value: afsprakenNotif, toggle: toggleAfsprakenNotif } = useToggle(true);
  const [sosBevestiging, setSosBevestiging] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const stored = window.localStorage.getItem("showSosButton");
    return stored === null ? true : stored === "true";
  });
  const [locatieDelen, setLocatieDelen] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem("zorgconnect:client:locatieDelen");
      return raw === "true";
    } catch {
      return false;
    }
  });

  // Sla locatieDelen op in localStorage en json-server
  const persistLocatieDelen = async (value: boolean) => {
    try {
      localStorage.setItem("zorgconnect:client:locatieDelen", String(value));
    } catch {}
    // Probeer ook op te slaan in json-server (data.json)
    try {
      await fetch("http://localhost:3001/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locatieDelen: value }),
      });
    } catch {
      // offline of json-server niet gestart
    }
  };

  const toggleLocatieDelen = (next: boolean) => {
    setLocatieDelen(next);
    persistLocatieDelen(next);
  };
  const { value: faceId, toggle: toggleFaceId } = useToggle(false);
  const [groteTekst, setGroteTekst] = useState<boolean>(() => readA11yPrefsFromStorage().largeText);
  const [hoogContrast, setHoogContrast] = useState<boolean>(() => readA11yPrefsFromStorage().highContrast);
  const [darkMode, setDarkMode] = useState<boolean>(() => readA11yPrefsFromStorage().darkMode);
  const [colorTheme, setColorThemeState] = useState<ColorThemeId>(() => readColorThemeFromStorage());

  const toggleGroteTekst = (next: boolean) => {
    setGroteTekst(next);
    writeA11yPrefToStorage("largeText", next);
    applyA11yPrefsToDocument({ largeText: next, highContrast: hoogContrast, darkMode });
  };

  const toggleHoogContrast = (next: boolean) => {
    setHoogContrast(next);
    writeA11yPrefToStorage("highContrast", next);
    applyA11yPrefsToDocument({ largeText: groteTekst, highContrast: next, darkMode });
  };

  const toggleDarkMode = (next: boolean) => {
    setDarkMode(next);
    writeA11yPrefToStorage("darkMode", next);
    applyA11yPrefsToDocument({ largeText: groteTekst, highContrast: hoogContrast, darkMode: next });
  };

  const setColorTheme = (theme: ColorThemeId) => {
    setColorThemeState(theme);
    writeColorThemeToStorage(theme);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
    navigate("/");
  };

  const handleSosToggle = (next: boolean) => {
    setSosBevestiging(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("showSosButton", String(next));
      window.dispatchEvent(new Event("sos-settings-changed"));
    }
  };

  const settingsOptions = [
    { icon: User, label: "Mijn Profiel", action: () => navigate("/profiel") },
    { icon: Bell, label: "Notificaties", action: () => {} },
    { icon: Shield, label: "Privacy & Veiligheid", action: () => {} },
    { icon: HelpCircle, label: "Help & Ondersteuning", action: () => {} },
    { icon: FileText, label: "Voorwaarden", action: () => {} },
    { icon: LogOut, label: "Uitloggen", action: handleLogout, isDestructive: true },
  ];

  return {
    navigate,
    berichtenNotif,
    toggleBerichtenNotif,
    afsprakenNotif,
    toggleAfsprakenNotif,
    sosBevestiging,
    handleSosToggle,
    faceId,
    toggleFaceId,
    groteTekst,
    toggleGroteTekst,
    hoogContrast,
    toggleHoogContrast,
    darkMode,
    toggleDarkMode,
    colorTheme,
    setColorTheme,
    handleLogout,
    settingsOptions,
    locatieDelen,
    toggleLocatieDelen,

  };
}
