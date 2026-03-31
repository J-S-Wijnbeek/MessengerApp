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
  const [appointments, setAppointments] = useState<Appointment[]>(getStoredAppointments());
  const [view, setView] = useState<string>("Aankomend");
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

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
    // Zet dagdeel om naar een tijd (voorbeeld: ochtend = 09:00, middag = 13:00, avond = 18:00)
    let time = "09:00";
    if (request.timeOfDay === "middag") time = "13:00";
    if (request.timeOfDay === "avond") time = "18:00";
    if (request.timeOfDay === "geen-voorkeur") time = "09:00";

    const newAppointment: Appointment = {
      id: Date.now(),
      date: request.date,
      time,
      type: "call", // default type, pas aan indien nodig
      staffName: "Onbekend", // default naam, pas aan indien nodig
      isPast: false,
      isNow: false,
    };
    setAppointments((prev) => [...prev, newAppointment]);
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
  };
}