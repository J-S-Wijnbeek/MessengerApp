import { useState } from "react";
import { useNavigate } from "react-router";
import { TealHeader } from "../components/TealHeader";
import { ClientBottomNav } from "../components/ClientBottomNav";
import { SectionBar } from "../components/SectionBar";
import { ChevronRight } from "lucide-react";
import { User, Bell, Shield, HelpCircle, FileText, LogOut } from "lucide-react";

export default function ClientInstellingen() {
  const navigate = useNavigate();
  const [berichtenNotif, setBerichtenNotif] = useState(true);
  const [afsprakenNotif, setAfsprakenNotif] = useState(true);
  const [sosBevestiging, setSosBevestiging] = useState(true);
  const [faceId, setFaceId] = useState(false);
  const [groteTekst, setGroteTekst] = useState(false);
  const [hoogContrast, setHoogContrast] = useState(false);

  const handleLogout = () => {
    // Navigate back to login
    navigate("/");
  };

  const settingsOptions = [
    { icon: User, label: "Mijn Profiel", action: () => navigate("/profiel") },
    { icon: Bell, label: "Notificaties", action: () => {} },
    { icon: Shield, label: "Privacy & Veiligheid", action: () => {} },
    { icon: HelpCircle, label: "Help & Ondersteuning", action: () => {} },
    { icon: FileText, label: "Voorwaarden", action: () => {} },
    { icon: LogOut, label: "Uitloggen", action: handleLogout, isDestructive: true },
  ];

  return (
    <div className="min-h-screen bg-white pb-20 w-full mx-auto">
      <TealHeader title="Instellingen" />

      {/* Profile Section */}
      <div className="px-4 py-4 border-b border-gray-100 flex items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-2xl font-medium">PH</span>
        </div>
        <div className="flex-1">
          <div className="font-bold text-lg">Peter Hendriks</div>
          <div className="text-sm text-gray-600">demo@client.nl</div>
        </div>
        <button
          onClick={() => navigate("/profiel")}
          className="text-[#1DC6B4] font-medium text-sm"
        >
          Bekijk profiel
        </button>
      </div>

      {/* Notifications */}
      <SectionBar title="Meldingen" />
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="text-gray-900">Berichten</div>
        <button
          onClick={() => setBerichtenNotif(!berichtenNotif)}
          className={`w-12 h-7 rounded-full transition-colors ${
            berichtenNotif ? "bg-[#F5A623]" : "bg-gray-300"
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full transition-transform ${
              berichtenNotif ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="text-gray-900">Afspraken</div>
        <button
          onClick={() => setAfsprakenNotif(!afsprakenNotif)}
          className={`w-12 h-7 rounded-full transition-colors ${
            afsprakenNotif ? "bg-[#F5A623]" : "bg-gray-300"
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full transition-transform ${
              afsprakenNotif ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="text-gray-900">SOS bevestiging</div>
        <button
          onClick={() => setSosBevestiging(!sosBevestiging)}
          className={`w-12 h-7 rounded-full transition-colors ${
            sosBevestiging ? "bg-[#F5A623]" : "bg-gray-300"
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full transition-transform ${
              sosBevestiging ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Security */}
      <SectionBar title="Beveiliging" />
      <button className="w-full px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="text-gray-900">Wachtwoord wijzigen</div>
        <ChevronRight size={20} className="text-gray-400" />
      </button>
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="text-gray-900">Face ID / vingerafdruk</div>
        <button
          onClick={() => setFaceId(!faceId)}
          className={`w-12 h-7 rounded-full transition-colors ${
            faceId ? "bg-[#F5A623]" : "bg-gray-300"
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full transition-transform ${
              faceId ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Accessibility */}
      <SectionBar title="Toegankelijkheid" />
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="text-gray-900">Grote tekst</div>
        <button
          onClick={() => setGroteTekst(!groteTekst)}
          className={`w-12 h-7 rounded-full transition-colors ${
            groteTekst ? "bg-[#F5A623]" : "bg-gray-300"
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full transition-transform ${
              groteTekst ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="text-gray-900">Hoog contrast</div>
        <button
          onClick={() => setHoogContrast(!hoogContrast)}
          className={`w-12 h-7 rounded-full transition-colors ${
            hoogContrast ? "bg-[#F5A623]" : "bg-gray-300"
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full transition-transform ${
              hoogContrast ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Logout */}
      <div className="p-4 pt-8">
        <button
          onClick={handleLogout}
          className="w-full text-[#D9534F] font-medium text-center py-3"
        >
          Uitloggen
        </button>
      </div>

      <ClientBottomNav />
    </div>
  );
}