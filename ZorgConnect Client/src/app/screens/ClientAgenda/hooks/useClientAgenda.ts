import { useEffect, useState } from "react";
import type { AppointmentRequest } from "../../../components/AppointmentRequestSheet";

// Type for an appointment record returned from the database
export interface Appointment {
  id: string;
  date: string;
  time_of_day: string;
  notes: string;
  created_by_name: string;
  created_at: string;
}

export function useClientAgenda() {
  // TODO: Replace with real logged-in user once auth/profile state exists.
  const currentUserName = "Peter Hendriks";
  // Default to the Netlify function path so the app works when VITE_DATABASE_URL
  // is not explicitly set as a Netlify build-time environment variable.
  const dbUrl = import.meta.env.VITE_DATABASE_URL ?? '/.netlify/functions/database';

  const [view, setView] = useState<string>("Aankomend");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isRequestSentOpen, setIsRequestSentOpen] = useState(false);
  const [lastRequest, setLastRequest] = useState<AppointmentRequest | null>(null);

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const fetchAppointments = async () => {
    try {
      const res = await fetch(dbUrl, { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch (e) {
      console.warn('Kan afspraken niet ophalen:', e);
    }
  };

  // Ophalen van afspraken uit de backend
  useEffect(() => {
    fetchAppointments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter afspraken voor vandaag, later en afgelopen
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
            // Use the camelCase field from AppointmentRequestSheet
            time_of_day: request.timeOfDay,
            notes: request.notes,
            created_by_name: currentUserName,
          }),
        });
        if (res.ok) {
          await fetchAppointments();
        }
      } catch (e) {
        console.warn('Failed to save appointment request:', e);
      } finally {
        setLastRequest(request);
        setIsRequestSentOpen(true);
      }
    })();
  };

  const deleteAppointment = async (id: string) => {
    try {
      await fetch(dbUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      });
      await fetchAppointments();
    } catch (e) {
      console.warn('Failed to delete appointment:', e);
    }
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
    deleteAppointment,
    isRequestSentOpen,
    setIsRequestSentOpen,
    lastRequest,
  };
}