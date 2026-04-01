import { ClientBottomNav } from "../../components/ClientBottomNav";
import { Shield, CheckCircle } from "lucide-react";
import { useSOSScreen } from "./hooks/useSOSScreen";

export default function SOSScreen() {
  const {
    isPressing,
    progress,
    isEmergencySent,
    showVerification,
    startPressing,
    stopPressing,
    confirmEmergency,
    cancelVerification,
    closeEmergency,
    cancelSOS,
  } = useSOSScreen();

  if (isEmergencySent) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col pb-20 w-full mx-auto">
        {/* Red Header */}
        <div className="bg-[#D9534F] text-white text-center py-4 px-4">
          <h1 className="font-bold text-lg">Noodmelding</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-8">
          {/* Success Icon */}
          <CheckCircle size={80} className="text-green-500 my-4" />

          <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
            Noodmelding verstuurd!
          </h2>

          {/* Staff Response Card */}
          <div className="w-full border-2 border-primary rounded-lg p-4 mb-6">
            <div className="text-sm text-muted-foreground mb-3">Hulp onderweg</div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-lg font-medium">S</span>
              </div>
              <div>
                <div className="font-bold">Sophie van der Berg</div>
                <div className="text-sm text-muted-foreground">Begeleider</div>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-4 mb-2">
              <div className="text-center text-muted-foreground mb-2">📍 Locatie tracking actief</div>
              <div className="h-32 bg-background/50 rounded flex items-center justify-center">
                <span className="text-muted-foreground">🗺️ Kaart</span>
              </div>
            </div>
            <div className="text-center font-bold text-secondary text-lg">
              ~8 min onderweg
            </div>
          </div>

          <button
            onClick={closeEmergency}
            className="w-fit border-2 border-border text-foreground py-3 px-4 rounded-lg font-medium hover:bg-muted transition-colors"
          >
            Sluiten
          </button>
        </div>

        {/* Footer */}
        <div className="text-center font-bold text-md text-muted-foreground px-8 py-4">
          Bij levensgevaar: bel 112
        </div>

        <ClientBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-20 w-full mx-auto">
      {/* Red Header */}
      <div className="bg-[#D9534F] text-white text-center py-4 px-4">
        <h1 className="font-bold text-lg">Noodmelding</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Shield Icon */}
        <Shield size={80} className="text-[#D9534F] my-4" />

        <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
          Noodmelding versturen?
        </h2>

        <p className="text-muted-foreground text-center mb-6">
          Houd de knop 3 seconden ingedrukt om een noodmelding te starten. Daarna vragen we je nog één keer om te bevestigen.
        </p>

        {/* Verificatiekaart nadat lang genoeg is ingedrukt */}
        {showVerification && (
          <div className="w-full max-w-md border-2 border-primary rounded-lg p-4 mb-6 bg-primary/10">
            <h3 className="font-bold text-lg text-foreground mb-2 text-center">
              Bevestig noodmelding
            </h3>
            <p className="text-sm text-foreground/90 mb-4 text-center">
              Weet je zeker dat je een noodmelding wilt versturen naar je zorgteam?
            </p>
            <div className="flex flex-col gap-3 items-center">
              <button
                onClick={confirmEmergency}
                className="w-full bg-[#D9534F] text-white py-3 rounded-lg font-semibold hover:bg-[#C64541] transition-colors"
              >
                Ja, verstuur noodmelding
              </button>
              <button
                onClick={cancelVerification}
                className="w-fit border-2 border-border text-foreground py-3 px-4 rounded-lg font-medium hover:bg-muted dark:hover:bg-muted/70 transition-colors"
              >
                Nee, annuleren
              </button>
            </div>
          </div>
        )}

        {/* Ingedrukt-houden knop */}
        <div className="relative mb-6">
          <button
            onMouseDown={startPressing}
            onMouseUp={stopPressing}
            onMouseLeave={stopPressing}
            onTouchStart={startPressing}
            onTouchEnd={stopPressing}
            className="w-64 bg-primary text-primary-foreground py-6 rounded-lg font-bold text-lg hover:bg-primary/90 transition-colors relative overflow-hidden"
          >
            <div
              className="absolute inset-0 bg-[#D9534F] transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
            <span className="relative z-10 flex items-center justify-center gap-2">
              🚨 Houd ingedrukt
            </span>
          </button>
          {isPressing && (
            <div className="absolute -top-2 -left-2 -right-2 -bottom-2 border-4 border-primary rounded-lg animate-pulse" />
          )}
        </div>

        <button
          onClick={cancelSOS}
          className="w-fit border-2 border-border text-foreground py-3 px-4 rounded-lg font-medium hover:bg-muted dark:hover:bg-muted/70 transition-colors"
        >
          Annuleren
        </button>
      </div>

      {/* Footer */}
      <div className="text-center font-bold text-md text-muted-foreground px-8 py-4">
        Bij levensgevaar: bel 112
      </div>

      <ClientBottomNav />
    </div>
  );
}
