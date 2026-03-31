import { useEffect, useState } from "react";

// Types
export interface Appointment {
  id: string;
  date: string;
  time_of_day: string;
  notes: string;
  created_by_name: string;
  created_at: string;
}

export interface AppointmentRequest {
  date: string;
  time_of_day: "ochtend" | "middag" | "avond" | "geen-voorkeur";
  notes: string;
}



export function useClientAgenda() {
  // TODO: Replace with real logged-in user once auth/profile state exists.
  const currentUserName = "Peter Hendriks";
  const dbUrl = import.meta.env.VITE_DATABASE_URL;

  const [view, setView] = useState<string>("Aankomend");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isRequestSentOpen, setIsRequestSentOpen] = useState(false);
  const [lastRequest, setLastRequest] = useState<AppointmentRequest | null>(null);

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Ophalen van afspraken uit de backend
  useEffect(() => {
    async function fetchAppointments() {
      try {
        const res = await fetch(dbUrl, { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          setAppointments(data);
        }
      } catch (e) {
        console.warn('Kan afspraken niet ophalen:', e);
      }
    }
    fetchAppointments();
  }, [dbUrl]);

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
        const res = await fetch(dbUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create',
            date: request.date,
            time_of_day: request.time_of_day,
            notes: request.notes,
            created_by_name: currentUserName,
          }),
        });
        if (res.ok) {
          // Herlaad afspraken na toevoegen
          const updated = await fetch(dbUrl, { method: 'GET' });
          if (updated.ok) {
            setAppointments(await updated.json());
          }
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