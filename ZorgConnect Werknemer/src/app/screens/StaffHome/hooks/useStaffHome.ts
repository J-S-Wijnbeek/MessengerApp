import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { mockLinkedClientsDetailed, mockSchedule } from "../../../data/mockData";

interface SOSAlert {
  id: string | number;
  clientName: string;
  timestamp: string;
  status: string;
  createdAt: string;
  location?: { lat: number; lng: number } | null;
}

interface DisplaySOSAlert extends SOSAlert {
  duration: string;
}

function computeDuration(createdAt: string): string {
  const diffMinutes = Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / 60000
  );
  if (diffMinutes < 1) return "Zojuist";
  return `${diffMinutes} min geleden`;
}

export function useStaffHome() {
  const navigate = useNavigate();
  const dbBaseUrl = import.meta.env.VITE_DATABASE_URL || "http://localhost:3001";
  const sosAlertsUrl = `${dbBaseUrl.replace(/\/$/, "")}/sosAlerts`;

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

  const [sosAlerts, setSOSAlerts] = useState<DisplaySOSAlert[]>([]);

  useEffect(() => {
    async function fetchSOSAlerts() {
      try {
        const res = await fetch(`${sosAlertsUrl}?status=Actief`);
        if (res.ok) {
          const data: SOSAlert[] = await res.json();
          setSOSAlerts(
            data.map((alert) => ({
              ...alert,
              duration: computeDuration(alert.createdAt),
            }))
          );
        }
      } catch (e) {
        console.warn("Kan noodmeldingen niet ophalen:", e);
      }
    }

    fetchSOSAlerts();
    const interval = setInterval(fetchSOSAlerts, 10000);
    return () => clearInterval(interval);
  }, [sosAlertsUrl]);

  return {
    navigate,
    staffName,
    currentShiftTime,
    status,
    isAchterwacht,
    linkedClients: mockLinkedClientsDetailed,
    sosAlerts,
  };
}
