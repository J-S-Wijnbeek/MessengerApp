import { useNavigate } from "react-router";

export function AppGuide() {
  const navigate = useNavigate();

  return (
    <div className="fixed top-4 right-4 z-50 max-w-xs">
      <div className="bg-white rounded-lg shadow-xl border-2 border-[#1DC6B4] p-4">
        <h3 className="font-bold text-[#1DC6B4] mb-2">🧭 ZorgConnect Navigatie</h3>
        <div className="text-sm space-y-2">
          <button
            onClick={() => navigate("/")}
            className="block w-full text-left text-gray-700 hover:text-[#1DC6B4]"
          >
            → Login (start hier)
          </button>
          <div className="text-xs text-gray-500 pl-4">
            <div>Client flow: Home → Berichten → SOS</div>
            <div>Staff flow: Team → Plannen → Gesprekken → Instellingen</div>
          </div>
        </div>
      </div>
    </div>
  );
}
