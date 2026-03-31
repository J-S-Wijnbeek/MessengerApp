import { useNavigate, useLocation } from "react-router";
import { Home, MessageCircle, Calendar, AlertCircle, Settings } from "lucide-react";

export function ClientBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 max-w-[390px] mx-auto">
      <button
        onClick={() => navigate("/client-home")}
        className={`flex flex-col items-center gap-1 px-2 py-2 ${
          isActive("/client-home") ? "text-[#1DC6B4]" : "text-gray-400"
        }`}
      >
        <Home size={24} />
        <span className="text-xs">Home</span>
      </button>
      <button
        onClick={() => navigate("/berichten")}
        className={`flex flex-col items-center gap-1 px-2 py-2 ${
          isActive("/berichten") ? "text-[#1DC6B4]" : "text-gray-400"
        }`}
      >
        <MessageCircle size={24} />
        <span className="text-xs">Berichten</span>
      </button>
      <button
        onClick={() => navigate("/agenda")}
        className={`flex flex-col items-center gap-1 px-2 py-2 ${
          isActive("/agenda") ? "text-[#1DC6B4]" : "text-gray-400"
        }`}
      >
        <Calendar size={24} />
        <span className="text-xs">Agenda</span>
      </button>
      <button
        onClick={() => navigate("/sos")}
        className={`flex flex-col items-center gap-1 px-2 py-2 ${
          isActive("/sos") ? "text-[#D9534F]" : "text-gray-400"
        }`}
      >
        <AlertCircle size={24} />
        <span className="text-xs">SOS</span>
      </button>
      <button
        onClick={() => navigate("/client-instellingen")}
        className={`flex flex-col items-center gap-1 px-2 py-2 ${
          isActive("/client-instellingen") ? "text-[#1DC6B4]" : "text-gray-400"
        }`}
      >
        <Settings size={24} />
        <span className="text-xs">Instellingen</span>
      </button>
    </div>
  );
}