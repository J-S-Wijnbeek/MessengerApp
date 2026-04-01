import { useState } from "react";
import { useNavigate } from "react-router";
import { User, Bell, Shield, HelpCircle, FileText, LogOut } from "lucide-react";
import { useToggle } from "../../../hooks/useToggle";
import {
  applyA11yPrefsToDocument,
  readA11yPrefsFromStorage,
  writeA11yPrefToStorage,
} from "../../../hooks/useAccessibilityPreferences";

export function useClientInstellingen() {
  const navigate = useNavigate();
  const { value: berichtenNotif, toggle: toggleBerichtenNotif } = useToggle(true);
  const { value: afsprakenNotif, toggle: toggleAfsprakenNotif } = useToggle(true);
  const [sosBevestiging, setSosBevestiging] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const stored = window.localStorage.getItem("showSosButton");
    return stored === null ? true : stored === "true";
  });
  const { value: faceId, toggle: toggleFaceId } = useToggle(false);
  const [groteTekst, setGroteTekst] = useState<boolean>(() => readA11yPrefsFromStorage().largeText);
  const [hoogContrast, setHoogContrast] = useState<boolean>(() => readA11yPrefsFromStorage().highContrast);

  const toggleGroteTekst = (next: boolean) => {
    setGroteTekst(next);
    writeA11yPrefToStorage("largeText", next);
    applyA11yPrefsToDocument({ largeText: next, highContrast: hoogContrast });
  };

  const toggleHoogContrast = (next: boolean) => {
    setHoogContrast(next);
    writeA11yPrefToStorage("highContrast", next);
    applyA11yPrefsToDocument({ largeText: groteTekst, highContrast: next });
  };

  const handleLogout = () => {
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
    handleLogout,
    settingsOptions,
  };
}
