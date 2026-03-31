import { useEffect, useState } from "react";
import agendaData from "../../../../Database/data.json";

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

// Haal afspraken uit localStorage, of uit data.json als localStorage leeg is
function getStoredAppointments(): Appointment[] {
  const stored = localStorage.getItem("appointments");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.every(isAppointment)) return parsed;
      if (parsed && Array.isArray(parsed.appointments) && parsed.appointments.every(isAppointment)) return parsed.appointments;
    } catch {
      // fallback op data.json
    }
  }
  // Always return a valid array
  return Array.isArray(agendaData.appointments) && agendaData.appointments.every(isAppointment)
    ? agendaData.appointments
    : [];
}

export function useClientAgenda() {
  // TODO: Replace with real logged-in user once auth/profile state exists.
  const currentUserName = "Peter Hendriks";

  const [view, setView] = useState<string>("Aankomend");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isRequestSentOpen, setIsRequestSentOpen] = useState(false);
  const [lastRequest, setLastRequest] = useState<AppointmentRequest | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>(getStoredAppointments());

  // Sla afspraken op in localStorage bij elke wijziging
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