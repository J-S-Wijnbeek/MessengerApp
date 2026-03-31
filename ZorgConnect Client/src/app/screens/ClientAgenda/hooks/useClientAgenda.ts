import { useState } from "react";
import { mockAppointments } from "../../../data/mockData";
import { AppointmentRequest } from "../../../components/AppointmentRequestSheet";

export function useClientAgenda() {
  // TODO: Replace with real logged-in user once auth/profile state exists.
  const currentUserName = "Peter Hendriks";

  const [view, setView] = useState<string>("Aankomend");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isRequestSentOpen, setIsRequestSentOpen] = useState(false);
  const [lastRequest, setLastRequest] = useState<AppointmentRequest | null>(null);

  const todayAppointments = mockAppointments.filter((a) => a.date === "Vandaag");
  const laterAppointments = mockAppointments.filter((a) => a.date !== "Vandaag");
  const pastAppointments = mockAppointments.filter((a) => a.isPast);

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
