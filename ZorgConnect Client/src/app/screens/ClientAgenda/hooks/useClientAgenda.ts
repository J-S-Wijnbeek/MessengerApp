import { useEffect, useMemo, useState } from "react";
import { mockAppointments } from "../../../data/mockData";

// Types
export interface Appointment {
  id: number;
  date: string;
  time: string;
  type: "call" | "meeting";
  staffName: string;
  isPast: boolean;
  isNow: boolean;
}

export interface AppointmentRequest {
  date: string;
  timeOfDay: "ochtend" | "middag" | "avond" | "geen-voorkeur";
  notes: string;
}

// Type guard for Appointment
function isAppointment(obj: any): obj is Appointment {
  return obj &&
    typeof obj.id === "number" &&
    typeof obj.date === "string" &&
    typeof obj.time === "string" &&
    (obj.type === "call" || obj.type === "meeting") &&
    typeof obj.staffName === "string" &&
    typeof obj.isPast === "boolean" &&
    typeof obj.isNow === "boolean";
}

type MockAppointment = (typeof mockAppointments)[number];

const mapMockAppointmentToAgendaAppointment = (a: MockAppointment): Appointment => ({
  id: a.id,
  date: a.date,
  time: a.time,
  type: a.type === "gesprek" ? "meeting" : "call",
  staffName: a.staffName,
  isPast: a.isPast,
  isNow: a.isNow,
});

export function useClientAgenda() {
  // TODO: Replace with real logged-in user once auth/profile state exists.
  const currentUserName = "Peter Hendriks";

  const [view, setView] = useState<string>("Aankomend");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isRequestSentOpen, setIsRequestSentOpen] = useState(false);
  const [lastRequest, setLastRequest] = useState<AppointmentRequest | null>(null);
  const appointments = useMemo(
    () => mockAppointments.map(mapMockAppointmentToAgendaAppointment),
    [],
  );

  // Keep writing to localStorage for potential later use, but don't read from it.
  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  // Filter afspraken voor vandaag, later en afgelopen
  const todayAppointments = appointments.filter(
    (a) => a.date === "Vandaag" && !a.isPast
  );
  const laterAppointments = appointments.filter(
    (a) => a.date !== "Vandaag" && !a.isPast
  );
  const pastAppointments = appointments.filter((a) => a.isPast);

  // Voeg nieuwe afspraak toe vanuit AppointmentRequestSheet
  const handleAppointmentRequest = (request: AppointmentRequest) => {
    console.log("Appointment request:", request);
    (async () => {
      try {
        await fetch("http://localhost:3001/appointmentRequests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...request,
            createdByName: currentUserName,
            createdAt: new Date().toISOString(),
          }),
        });
      } catch (e) {
        // Best-effort save; UI feedback still shown even if db is offline.
        console.warn("Failed to save appointment request:", e);
      } finally {
        setLastRequest(request);
        setIsRequestSentOpen(true);
      }
    })();
  };

  const openSheet = () => setIsSheetOpen(true);
  const closeSheet = () => setIsSheetOpen(false);

  return {
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
  };
}