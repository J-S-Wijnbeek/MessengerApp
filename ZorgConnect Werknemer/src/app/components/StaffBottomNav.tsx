import { useNavigate, useLocation } from "react-router";
import { Home, Calendar, MessageCircle, Phone, Settings } from "lucide-react";

export function StaffBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 max-w-[390px] mx-auto">
      <button
        onClick={() => navigate("/staff-home")}
        className={`flex flex-col items-center gap-1 px-2 py-2 ${
          isActive("/staff-home") ? "text-[#1DC6B4]" : "text-gray-400"
        }`}
      >
        <Home size={20} />
        <span className="text-[10px]">Home</span>
      </button>
      <button
        onClick={() => navigate("/plannen")}
        className={`flex flex-col items-center gap-1 px-2 py-2 ${
          isActive("/plannen") ? "text-[#1DC6B4]" : "text-gray-400"
        }`}
      >
        <Calendar size={20} />
        <span className="text-[10px]">Plannen</span>
      </button>
      <button
        onClick={() => navigate("/berichten")}
        className={`flex flex-col items-center gap-1 px-2 py-2 ${
          isActive("/berichten") ? "text-[#1DC6B4]" : "text-gray-400"
        }`}
      >
        <MessageCircle size={20} />
        <span className="text-[10px]">Berichten</span>
      </button>
      <button
        onClick={() => navigate("/gesprekken")}
        className={`flex flex-col items-center gap-1 px-2 py-2 ${
          isActive("/gesprekken") ? "text-[#1DC6B4]" : "text-gray-400"
        }`}
      >
        <Phone size={20} />
        <span className="text-[10px]">Gesprekken</span>
      </button>
      <button
        onClick={() => navigate("/instellingen")}
        className={`flex flex-col items-center gap-1 px-2 py-2 ${
          isActive("/instellingen") ? "text-[#1DC6B4]" : "text-gray-400"
        }`}
      >
        <Settings size={20} />
        <span className="text-[10px]">Instellingen</span>
      </button>
    </div>
  );
}