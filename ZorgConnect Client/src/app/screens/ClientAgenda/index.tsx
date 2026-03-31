import { Trash2 } from "lucide-react";
import { TealHeader } from "../../components/TealHeader";
import { ClientBottomNav } from "../../components/ClientBottomNav";
import { PillToggle } from "../../components/PillToggle";
import { SectionBar } from "../../components/SectionBar";
import { FAB } from "../../components/FAB";
import { AppointmentRequestSheet } from "../../components/AppointmentRequestSheet";
import { useClientAgenda } from "./hooks/useClientAgenda";
import type { Appointment } from "./hooks/useClientAgenda";
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
    deleteAppointment,
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
        return tod ?? "—";
    }
  };

  const AppointmentCard = ({ apt, showDate }: { apt: Appointment; showDate?: boolean }) => (
    <div className="px-4 py-3 border-b border-gray-100">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          {showDate && (
            <div className="text-xs text-gray-500 mb-1">{apt.date}</div>
          )}
          <div className="font-bold text-lg mb-1">{formatTimeOfDay(apt.time_of_day)}</div>
          {apt.notes ? (
            <div className="text-sm text-gray-700 mb-1 italic">"{apt.notes}"</div>
          ) : null}
          <div className="text-xs text-gray-400">Verzoek van {apt.created_by_name}</div>
        </div>
        <button
          onClick={() => deleteAppointment(apt.id)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
          title="Verwijder afspraak"
        >
          <Trash2 size={18} />
        </button>
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
                <AppointmentCard key={apt.id} apt={apt} />
              ))}
            </>
          ) : null}

          {laterAppointments.length > 0 ? (
            <>
              <SectionBar title="Later" />
              {laterAppointments.map((apt) => (
                <AppointmentCard key={apt.id} apt={apt} showDate />
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
              <AppointmentCard key={apt.id} apt={apt} showDate />
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
