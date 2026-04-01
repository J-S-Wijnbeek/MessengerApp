import { TealHeader } from "../../components/TealHeader";
import { ClientBottomNav } from "../../components/ClientBottomNav";
import { SectionBar } from "../../components/SectionBar";
import { ChevronRight } from "lucide-react";
import { ToggleRow } from "../../components/ToggleRow";
import { useClientInstellingen } from "./hooks/useClientInstellingen";

export default function ClientInstellingen() {
  const {
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
    locatieDelen,
    toggleLocatieDelen,
  } = useClientInstellingen();

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
      <ToggleRow
        label="Berichten"
        value={berichtenNotif}
        onChange={toggleBerichtenNotif}
      />
      <ToggleRow
        label="Afspraken"
        value={afsprakenNotif}
        onChange={toggleAfsprakenNotif}
      />
      <ToggleRow
        label="SOS-knop tonen"
        description="Schakel de SOS-snelknop in de navigatiebalk onderin aan of uit. Als deze optie uit staat, vind je de SOS-pagina alleen nog via de knop hieronder."
        value={sosBevestiging}
        onChange={handleSosToggle}
      />

      {/* Alt. SOS-toegang vanuit instellingen (alleen zichtbaar als knop onderin uitstaat) */}
      {!sosBevestiging && (
        <div className="px-4 py-4 border-b border-gray-100">
          <button
            onClick={() => navigate("/sos")}
            className="w-full bg-[#D9534F] text-white py-3 rounded-lg font-semibold text-center hover:bg-[#C64541] transition-colors"
          >
            Open SOS-pagina
          </button>
        </div>
      )}
      {/* {locatieDelen} */}
      <ToggleRow
        label="Locatie delen"
        value={locatieDelen}
        onChange={toggleLocatieDelen}
      />

      {/* Security */}
      <SectionBar title="Beveiliging" />
      <button className="w-full px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="text-gray-900">Wachtwoord wijzigen</div>
        <ChevronRight size={20} className="text-gray-400" />
      </button>
      <ToggleRow
        label="Face ID / vingerafdruk"
        value={faceId}
        onChange={toggleFaceId}
      />

      {/* Accessibility */}
      <SectionBar title="Toegankelijkheid" />
      <ToggleRow
        label="Grote tekst"
        value={groteTekst}
        onChange={toggleGroteTekst}
      />
      <ToggleRow
        label="Hoog contrast"
        value={hoogContrast}
        onChange={toggleHoogContrast}
      />

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
