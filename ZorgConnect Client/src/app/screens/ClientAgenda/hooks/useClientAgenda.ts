import { useEffect, useState } from "react";
import type { AppointmentRequest } from "../../../components/AppointmentRequestSheet";
import { DB_URL } from "../../../config";

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

  const [view, setView] = useState<string>("Aankomend");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isRequestSentOpen, setIsRequestSentOpen] = useState(false);
  const [lastRequest, setLastRequest] = useState<AppointmentRequest | null>(null);

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // DB_URL is a build-time constant derived from import.meta.env; it never
  // changes at runtime, so it is safe to omit from the dependency array.
  const fetchAppointments = async () => {
    try {
      const res = await fetch(DB_URL, { method: 'GET' });
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
  // DB_URL is a build-time constant; fetchAppointments is defined in this
  // scope and is recreated on every render – including it would cause an
  // infinite loop.  Disabling the rule here is intentional.
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
        const res = await fetch(DB_URL, {
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
      await fetch(DB_URL, {
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