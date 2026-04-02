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
    plannedMockAppointments,
    todayRequestedAppointments,
    laterRequestedAppointments,
    pastRequestedAppointments,
    handleAppointmentRequest,
    isRequestSentOpen,
    setIsRequestSentOpen,
    lastRequest,
    requestedAppointments,
  } = useClientAgenda();

  const todayStr = new Date().toISOString().slice(0, 10);
  const plannedAll = (plannedMockAppointments || []) as any[];
  const plannedToday = plannedAll.filter((a) => a?.isoDate === todayStr);
  const plannedLater = plannedAll.filter((a) => a?.isoDate > todayStr);
  const plannedPast = plannedAll.filter((a) => a?.isoDate < todayStr);

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
      chosenWorker?: string;
      contactType?: string;
    };
    showDate?: boolean;
  }) => (
    <div key={apt.id} className="px-4 py-3 border-b border-border">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          {showDate && <div className="text-xs text-muted-foreground mb-1">{formatDateNL(apt.date)}</div>}
          <div className="font-bold text-lg mb-1">{formatTimeOfDay(apt.timeOfDay)}</div>
          <div className="text-sm text-muted-foreground mb-1">
            Aangevraagd door <span className="font-medium">{apt.createdByName}</span>
          </div>
          {apt.chosenWorker?.trim() ? (
            <div className="text-sm text-muted-foreground mb-1">
              Verzorger: <span className="font-medium">{apt.chosenWorker}</span>
            </div>
          ) : null}
          {apt.contactType ? (
            <div className="text-sm text-muted-foreground mb-1">
              Type: <span className="font-medium">{apt.contactType === "telefoongesprek" ? "📞 Telefoongesprek" : "📅 Afspraak"}</span>
            </div>
          ) : null}
          {apt.notes?.trim() ? (
            <div className="text-sm text-muted-foreground">{apt.notes}</div>
          ) : (
            <div className="text-sm text-muted-foreground/70">Geen notities</div>
          )}
        </div>
      </div>
    </div>
  );

  const PlannedAppointmentRow = ({
    apt,
    showDate,
  }: {
    apt: {
      id: number | string;
      isoDate: string;
      time: string;
      title: string;
      location?: string;
      staffName?: string;
      isNow?: boolean;
    };
    showDate?: boolean;
  }) => (
    <div key={apt.id} className="px-4 py-3 border-b border-border">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          {showDate && (
            <div className="text-xs text-muted-foreground mb-1">
              {apt.isoDate === todayStr ? "Vandaag" : formatDateNL(apt.isoDate)}
            </div>
          )}
          <div className="flex items-baseline justify-between gap-3">
            <div className="font-semibold text-lg">{apt.title}</div>
            <div className="text-sm font-medium text-muted-foreground">{apt.time}</div>
          </div>
          {(apt.staffName || apt.location) ? (
            <div className="text-sm text-muted-foreground mt-1">
              {apt.staffName ? <span className="font-medium">{apt.staffName}</span> : null}
              {apt.staffName && apt.location ? <span className="text-muted-foreground/70"> • </span> : null}
              {apt.location ? <span className="text-muted-foreground">{apt.location}</span> : null}
            </div>
          ) : null}
          {apt.isNow ? (
            <div className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              Nu bezig
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 w-full mx-auto">
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
          {plannedToday.length > 0 ? (
            <>
              <SectionBar title="Vandaag" />
              {plannedToday.map((apt) => (
                <PlannedAppointmentRow key={apt.id} apt={apt} />
              ))}
            </>
          ) : null}

          {plannedLater.length > 0 ? (
            <>
              <SectionBar title="Later" />
              {plannedLater.map((apt) => (
                <PlannedAppointmentRow key={apt.id} apt={apt} showDate />
              ))}
            </>
          ) : null}

          {(plannedToday.length === 0 && plannedLater.length === 0) ? (
            <div className="text-center text-muted-foreground/70 py-12">
              Geen geplande afspraken
            </div>
          ) : null}

          {/* Requested (json-server) */}
          {(todayRequestedAppointments.length > 0 || laterRequestedAppointments.length > 0) ? (
            <>
              <SectionBar title="Aangevraagde afspraken" />
              {todayRequestedAppointments.map((apt) => (
                <AppointmentRow key={apt.id} apt={apt} />
              ))}
              {laterRequestedAppointments.map((apt) => (
                <AppointmentRow key={apt.id} apt={apt} showDate />
              ))}
            </>
          ) : null}
        </>
      ) : (
        <>
          {plannedPast.length > 0 ? (
            plannedPast.map((apt) => (
              <PlannedAppointmentRow key={apt.id} apt={apt} showDate />
            ))
          ) : (
            <div className="text-center text-muted-foreground/70 py-12">
              Geen afgelopen afspraken
            </div>
          )}

          {/* Requested (json-server) */}
          {pastRequestedAppointments.length > 0 ? (
            <>
              <SectionBar title="Aangevraagde afspraken" />
              {pastRequestedAppointments.map((apt) => (
                <AppointmentRow key={apt.id} apt={apt} showDate />
              ))}
            </>
          ) : null}
        </>
      )}

      <FAB onClick={openSheet} />

      <AppointmentRequestSheet
        isOpen={isSheetOpen}
        onClose={closeSheet}
        onSubmit={handleAppointmentRequest}
        bookedAppointments={{
          requested: requestedAppointments,
          planned: plannedMockAppointments,
        }}
      />

      <AlertDialog open={isRequestSentOpen} onOpenChange={setIsRequestSentOpen}>
        <AlertDialogContent>
          <div className="bg-secondary text-secondary-foreground px-6 py-5">
            <AlertDialogHeader className="text-left">
              <AlertDialogTitle className="text-secondary-foreground">Afspraakverzoek verstuurd</AlertDialogTitle>
              <AlertDialogDescription className="text-secondary-foreground/90">
                We hebben je aanvraag ontvangen en nemen dit zo snel mogelijk in behandeling.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>

          <div className="px-6 py-5">
            <div className="rounded-lg border border-border bg-muted p-4 space-y-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Datum</span>
                <span className="font-medium text-foreground">{lastRequest?.date ?? "-"}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Dagdeel</span>
                <span className="font-medium text-foreground">
                  {lastRequest ? formatTimeOfDay(lastRequest.timeOfDay) : "-"}
                </span>
              </div>
              {lastRequest?.chosenWorker?.trim() ? (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Verzorger</span>
                  <span className="font-medium text-foreground">{lastRequest.chosenWorker}</span>
                </div>
              ) : null}
              {lastRequest?.contactType ? (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Type contact</span>
                  <span className="font-medium text-foreground">
                    {lastRequest.contactType === "telefoongesprek" ? "📞 Telefoongesprek" : "📅 Afspraak"}
                  </span>
                </div>
              ) : null}
              <div className="pt-2 border-t border-border">
                <div className="text-muted-foreground mb-1">Notities</div>
                <div className="text-foreground">
                  {lastRequest?.notes?.trim() ? lastRequest.notes : "Geen"}
                </div>
              </div>
            </div>

            <AlertDialogFooter className="mt-5">
              <AlertDialogAction className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
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
