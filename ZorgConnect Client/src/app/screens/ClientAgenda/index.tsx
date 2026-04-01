import { TealHeader } from "../../components/TealHeader";
import { ClientBottomNav } from "../../components/ClientBottomNav";
import { PillToggle } from "../../components/PillToggle";
import { SectionBar } from "../../components/SectionBar";
import { FAB } from "../../components/FAB";
import { AppointmentRequestSheet } from "../../components/AppointmentRequestSheet";
import { useClientAgenda } from "./hooks/useClientAgenda";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";

export default function ClientAgenda() {
  const {
    view,
    setView,
    isSheetOpen,
    openSheet,
    closeSheet,
    todayAppointments,
    laterAppointments,
    pastAppointments,
    handleAppointmentRequest,
    isRequestSentOpen,
    setIsRequestSentOpen,
    lastRequest,
  } = useClientAgenda();

  const formatTimeOfDay = (tod: string) => {
    switch (tod) {
      case "ochtend":
        return "Ochtend";
      case "middag":
        return "Middag";
      case "avond":
        return "Avond";
      case "geen-voorkeur":
        return "Geen voorkeur";
      default:
        return tod;
    }
  };

  const formatDateNL = (isoDate: string) => {
    // isoDate: YYYY-MM-DD
    const [y, m, d] = isoDate.split("-").map(Number);
    if (!y || !m || !d) return isoDate;
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString("nl-NL", { weekday: "long", day: "2-digit", month: "long" });
  };

  const AppointmentRow = ({
    apt,
    showDate,
  }: {
    apt: {
      id: string;
      date: string;
      timeOfDay: string;
      notes: string;
      createdByName: string;
    };
    showDate?: boolean;
  }) => (
    <div key={apt.id} className="px-4 py-3 border-b border-gray-100">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          {showDate && <div className="text-xs text-gray-500 mb-1">{formatDateNL(apt.date)}</div>}
          <div className="font-bold text-lg mb-1">{formatTimeOfDay(apt.timeOfDay)}</div>
          <div className="text-sm text-gray-700 mb-1">
            Aangevraagd door <span className="font-medium">{apt.createdByName}</span>
          </div>
          {apt.notes?.trim() ? (
            <div className="text-sm text-gray-600">{apt.notes}</div>
          ) : (
            <div className="text-sm text-gray-400">Geen notities</div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20 w-full mx-auto">
      <TealHeader title="Mijn Agenda" />

      {/* Pill Toggle */}
      <div className="p-4 flex justify-center">
        <PillToggle
          options={["Aankomend", "Afgelopen"]}
          value={view}
          onChange={setView}
        />
      </div>

      {view === "Aankomend" ? (
        <>
          {todayAppointments.length > 0 ? (
            <>
              <SectionBar title="Vandaag" />
              {todayAppointments.map((apt) => (
                <AppointmentRow key={apt.id} apt={apt} />
              ))}
            </>
          ) : null}

          {laterAppointments.length > 0 ? (
            <>
              <SectionBar title="Later" />
              {laterAppointments.map((apt) => (
                <AppointmentRow key={apt.id} apt={apt} showDate />
              ))}
            </>
          ) : null}

          {todayAppointments.length === 0 && laterAppointments.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              Geen geplande afspraken
            </div>
          )}
        </>
      ) : (
        <>
          {pastAppointments.length > 0 ? (
            pastAppointments.map((apt) => (
              <AppointmentRow key={apt.id} apt={apt} showDate />
            ))
          ) : (
            <div className="text-center text-gray-400 py-12">
              Geen afgelopen afspraken
            </div>
          )}
        </>
      )}

      <FAB onClick={openSheet} />
      <AppointmentRequestSheet
        isOpen={isSheetOpen}
        onClose={closeSheet}
        onSubmit={handleAppointmentRequest}
      />
      <AlertDialog open={isRequestSentOpen} onOpenChange={setIsRequestSentOpen}>
        <AlertDialogContent className="border-0 p-0 overflow-hidden">
          <div className="bg-[#1DC6B4] text-white px-6 py-5">
            <AlertDialogHeader className="text-left">
              <AlertDialogTitle className="text-white">Afspraakverzoek verstuurd</AlertDialogTitle>
              <AlertDialogDescription className="text-white/90">
                We hebben je aanvraag ontvangen en nemen dit zo snel mogelijk in behandeling.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>

          <div className="px-6 py-5">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-500">Datum</span>
                <span className="font-medium text-gray-900">{lastRequest?.date ?? "-"}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-500">Dagdeel</span>
                <span className="font-medium text-gray-900">
                  {lastRequest ? formatTimeOfDay(lastRequest.timeOfDay) : "-"}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <div className="text-gray-500 mb-1">Notities</div>
                <div className="text-gray-900">
                  {lastRequest?.notes?.trim() ? lastRequest.notes : "Geen"}
                </div>
              </div>
            </div>

            <AlertDialogFooter className="mt-5">
              <AlertDialogAction className="w-full bg-[#1DC6B4] hover:bg-[#18B5A3] text-white">
                Oké
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      <ClientBottomNav />
    </div>
  );
}
