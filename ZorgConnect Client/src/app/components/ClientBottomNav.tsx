import { useNavigate, useLocation, Link } from "react-router";
import { Home, MessageCircle, Calendar, Settings } from "lucide-react";

export function ClientBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: MessageCircle, label: "Berichten", path: "/berichten" },
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