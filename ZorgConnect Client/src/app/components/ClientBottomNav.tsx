import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { Home, MessageCircle, Calendar, Settings, Siren } from "lucide-react";

export function ClientBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSosButton, setShowSosButton] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const stored = window.localStorage.getItem("showSosButton");
    return stored === null ? true : stored === "true";
  });

  useEffect(() => {
    const handleChange = () => {
      const stored = window.localStorage.getItem("showSosButton");
      setShowSosButton(stored === null ? true : stored === "true");
    };
    window.addEventListener("sos-settings-changed", handleChange);
    return () => window.removeEventListener("sos-settings-changed", handleChange);
  }, []);

  const navItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: MessageCircle, label: "Berichten", path: "/berichten" },
    ...(showSosButton ? [{ icon: Siren, label: "SOS", path: "/sos" as const }] : []),
    { icon: Calendar, label: "Agenda", path: "/agenda" },
    { icon: Settings, label: "Meer", path: "/instellingen" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 w-full mx-auto">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex flex-col items-center gap-1 px-2 py-2 ${
            isActive(item.path) ? "text-[#F5A623]" : "text-gray-400"
          }`}
        >
          <item.icon size={24} />
          <span className="text-xs">{item.label}</span>
        </Link>
      ))}
    </div>
  );
}