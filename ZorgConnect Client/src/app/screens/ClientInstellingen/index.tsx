import { TealHeader } from "../../components/TealHeader";
import { ClientBottomNav } from "../../components/ClientBottomNav";
import { SectionBar } from "../../components/SectionBar";
import { ChevronRight } from "lucide-react";
import { ToggleRow } from "../../components/ToggleRow";
import { useClientInstellingen, type ClientInstellingenHook } from "./hooks/useClientInstellingen";

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
    darkMode,
    toggleDarkMode,
    handleLogout,
  } = useClientInstellingen() as ClientInstellingenHook;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 w-full mx-auto">
      <TealHeader title="Instellingen" />

      {/* Profile Section */}
      <div className="px-4 py-4 border-b border-border flex items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <span className="text-muted-foreground text-2xl font-medium">PH</span>
        </div>
        <div className="flex-1">
          <div className="font-bold text-lg">Peter Hendriks</div>
          <div className="text-sm text-muted-foreground">demo@client.nl</div>
        </div>
        <button onClick={() => navigate("/profiel")} className="text-secondary font-medium text-sm">
          Bekijk profiel
        </button>
      </div>

      {/* Medicatie */}
      <SectionBar title="Medicatie"/>
        <button className="w-full px-4 py-3 border-b border-border flex items-center justify-between">
          <div className="text-foreground font-normal zc-toggle-label">Medicatie</div>
          <ChevronRight size={20} className="text-muted-foreground" onClick={() => navigate("/medicatie")}/>
        </button>
      

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
        <div className="px-4 py-4 border-b border-border">
          <button
            onClick={() => navigate("/sos")}
            className="w-full bg-[#D9534F] text-white py-3 rounded-lg font-semibold text-center hover:bg-[#C64541] transition-colors"
          >
            Open SOS-pagina
          </button>
        </div>
      )}

      {/* Security */}
      {/* <SectionBar title="Beveiliging" />
      <button className="w-full px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="text-foreground">Wachtwoord wijzigen</div>
        <ChevronRight size={20} className="text-muted-foreground" />
      </button>
      <ToggleRow
        label="Face ID / vingerafdruk"
        value={faceId}
        onChange={toggleFaceId}
      /> */}

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
      <ToggleRow
        label="Donkere modus"
        value={darkMode}
        onChange={toggleDarkMode}
      />


      {/* Logout */}
      <div className="p-4 pt-8 flex justify-center">
        <button
          onClick={handleLogout}
          className="w-fit bg-destructive text-destructive-foreground font-medium text-center py-3 px-4 rounded-lg hover:opacity-90 active:opacity-80 transition-opacity"
        >
          Uitloggen
        </button>
      </div>

      <ClientBottomNav />
    </div>
  );
}
