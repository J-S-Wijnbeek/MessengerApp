import { useNavigate } from "react-router";
import { mockLinkedClientsDetailed, mockSOSAlerts, mockSchedule } from "../../../data/mockData";

export function useStaffHome() {
  const navigate = useNavigate();

  const staffName = "Sophie van der Berg";

  const currentShift = mockSchedule.find((shift) => shift.date === "Vandaag");
  const currentShiftTime = currentShift
    ? `${currentShift.startTime} — ${currentShift.endTime}`
    : "Geen dienst";

  const status: "beschikbaar" | "achterwacht" | "niet-beschikbaar" = currentShift
    ? currentShift.isAchterwacht
      ? "achterwacht"
      : "beschikbaar"
    : "niet-beschikbaar";

  const isAchterwacht = status === "achterwacht";

  return {
    navigate,
    staffName,
    currentShiftTime,
    status,
    isAchterwacht,
    linkedClients: mockLinkedClientsDetailed,
    sosAlerts: mockSOSAlerts,
  };
}
