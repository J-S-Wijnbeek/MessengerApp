import { useEffect, useState } from "react";
import { useCurrentUserName } from "../../../hooks/useCurrentUserName";

// Types
export interface Appointment {
  id: string;
  date: string;
  timeOfDay: "ochtend" | "middag" | "avond" | "geen-voorkeur";
  notes: string;
  createdByName: string;
  createdAt: string;
}

export interface AppointmentRequest {
  date: string;
  timeOfDay: "ochtend" | "middag" | "avond" | "geen-voorkeur";
  notes: string;
}



export function useClientAgenda() {
  const currentUserName = useCurrentUserName();
  const dbBaseUrl = import.meta.env.VITE_DATABASE_URL || "http://localhost:3001";
  const appointmentRequestsUrl = `${dbBaseUrl.replace(/\/$/, "")}/appointmentRequests`;

  const [view, setView] = useState<string>("Aankomend");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isRequestSentOpen, setIsRequestSentOpen] = useState(false);
  const [lastRequest, setLastRequest] = useState<AppointmentRequest | null>(null);

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Ophalen van afspraken uit de backend
  useEffect(() => {
    async function fetchAppointments() {
      try {
        const res = await fetch(appointmentRequestsUrl, { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          setAppointments(data);
        }
      } catch (e) {
        console.warn('Kan afspraken niet ophalen:', e);
      }
    }
    fetchAppointments();
  }, [appointmentRequestsUrl]);

  // Filter afspraken voor vandaag, later en afgelopen

  // Simpele datumvergelijking (pas aan naar jouw logica)
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayAppointments = appointments.filter((a) => a.date === todayStr);
  const laterAppointments = appointments.filter((a) => a.date > todayStr);
  const pastAppointments = appointments.filter((a) => a.date < todayStr);

  // Voeg nieuwe afspraak toe vanuit AppointmentRequestSheet
  const handleAppointmentRequest = (request: AppointmentRequest) => {
    (async () => {
      try {
        const res = await fetch(appointmentRequestsUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: request.date,
            timeOfDay: request.timeOfDay,
            notes: request.notes,
            createdByName: currentUserName,
            createdAt: new Date().toISOString(),
          }),
        });
        if (res.ok) {
          // json-server returns the created object; add it optimistically
          const created = await res.json();
          setAppointments((prev) => [...prev, created]);
        }
      } catch (e) {
        console.warn('Failed to save appointment request:', e);
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