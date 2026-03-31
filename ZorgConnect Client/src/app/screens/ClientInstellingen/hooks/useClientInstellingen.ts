import { useState } from "react";
import { useNavigate } from "react-router";
import { User, Bell, Shield, HelpCircle, FileText, LogOut } from "lucide-react";
import { useToggle } from "../../../hooks/useToggle";

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
  const { value: groteTekst, toggle: toggleGroteTekst } = useToggle(false);
  const { value: hoogContrast, toggle: toggleHoogContrast } = useToggle(false);

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
