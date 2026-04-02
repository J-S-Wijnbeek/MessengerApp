import { TealHeader } from "../../components/TealHeader";
import { ClientBottomNav } from "../../components/ClientBottomNav";
import { SectionBar } from "../../components/SectionBar";
import { ChevronRight } from "lucide-react";
import { ToggleRow } from "../../components/ToggleRow";
import { useClientInstellingen } from "./hooks/useClientInstellingen";
import type { ColorThemeId } from "../../hooks/useAccessibilityPreferences";

const THEME_CHOICES: { id: ColorThemeId; label: string; swatch: [string, string] }[] = [
  { id: "default", label: "Standaard", swatch: ["#F5A623", "#1DC6B4"] },
  { id: "ocean", label: "Oceaan", swatch: ["#2563eb", "#0891b2"] },
  { id: "forest", label: "Bos", swatch: ["#15803d", "#0d9488"] },
  { id: "sunset", label: "Zonsondergang", swatch: ["#ea580c", "#db2777"] },
  { id: "lavender", label: "Lavendel", swatch: ["#7c3aed", "#c026d3"] },
];

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
    colorTheme,
    setColorTheme,
    handleLogout,
    locatieDelen,
    toggleLocatieDelen,
  } = useClientInstellingen();

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
      {/* {locatieDelen} */}
      <ToggleRow
        label="Locatie delen"
        value={locatieDelen}
        onChange={toggleLocatieDelen}
      />

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
      <SectionBar title="Toegankelijkheid en uiterlijk" />
      <div className="px-4 py-4 border-b border-border">
        <div className="text-foreground font-medium zc-toggle-label mb-3">Themakleur</div>
        <p className="text-sm text-muted-foreground mb-3">
          Kies welke hoofd- en accentkleur de app gebruikt. Standaard is de oorspronkelijke ZorgConnect-stijl.
        </p>
        <div className="flex flex-wrap gap-2">
          {THEME_CHOICES.map(({ id, label, swatch }) => {
            const selected = colorTheme === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setColorTheme(id)}
                className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-2.5 py-2 min-w-[4.75rem] transition-colors ${
                  selected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                    : "border-border bg-background hover:bg-muted/60"
                }`}
              >
                <span className="flex gap-1">
                  <span
                    className="h-6 w-6 rounded-full border border-black/10 shadow-sm"
                    style={{ backgroundColor: swatch[0] }}
                    aria-hidden
                  />
                  <span
                    className="h-6 w-6 rounded-full border border-black/10 shadow-sm"
                    style={{ backgroundColor: swatch[1] }}
                    aria-hidden
                  />
                </span>
                <span className="text-xs font-medium text-center leading-tight text-foreground max-w-[5.5rem]">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
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

      {/* Privacy */}
      <SectionBar title="Privacy" />
      <div className="px-4 py-4 border-b border-border">
        <div className="text-foreground font-medium zc-toggle-label mb-2">Privacy-informatie</div>
        <p className="text-sm text-muted-foreground">
          We gaan zorgvuldig om met je gegevens. Je berichten en afspraken worden alleen gebruikt om de app goed te laten
          werken. Locatie delen is optioneel en kun je hierboven altijd aan- of uitzetten.
        </p>
      </div>


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
