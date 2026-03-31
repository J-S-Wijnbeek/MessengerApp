import { useState } from "react";
import { mockAppointments } from "../../../data/mockData";
import { AppointmentRequest } from "../../../components/AppointmentRequestSheet";

export function useClientAgenda() {
  const [view, setView] = useState<string>("Aankomend");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const todayAppointments = mockAppointments.filter((a) => a.date === "Vandaag");
  const laterAppointments = mockAppointments.filter((a) => a.date !== "Vandaag");
  const pastAppointments = mockAppointments.filter((a) => a.isPast);

  const handleAppointmentRequest = (request: AppointmentRequest) => {
    console.log("Appointment request:", request);
    alert(
      `Afspraakverzoek verstuurd!\nDatum: ${request.date}\nDagdeel: ${request.timeOfDay}\nNotities: ${request.notes || "Geen"}`
    );
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
