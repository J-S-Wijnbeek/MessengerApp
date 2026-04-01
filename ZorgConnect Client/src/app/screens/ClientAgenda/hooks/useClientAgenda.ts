import { useEffect, useMemo, useState } from "react";
import { useCurrentUserName } from "../../../hooks/useCurrentUserName";
import * as mockData from "../../../data/mockData";

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

const createId = () => {
  const c = (globalThis as unknown as { crypto?: { randomUUID?: () => string } }).crypto;
  if (c?.randomUUID) return c.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};



export function useClientAgenda() {
  const currentUserName = useCurrentUserName();
  const dbBaseUrl = import.meta.env.VITE_DATABASE_URL || "http://localhost:3001";
  const appointmentRequestsUrl = useMemo(
    () => `${dbBaseUrl.replace(/\/$/, "")}/appointmentRequests`,
    [dbBaseUrl],
  );
  const localStorageKey = "zorgconnect:client:appointmentRequests";

  const [view, setView] = useState<string>("Aankomend");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isRequestSentOpen, setIsRequestSentOpen] = useState(false);
  const [lastRequest, setLastRequest] = useState<AppointmentRequest | null>(null);

  const mockAppointments = useMemo<Appointment[]>(() => {
    const fromMock = (mockData as unknown as { mockAppointmentRequests?: unknown }).mockAppointmentRequests ?? [];
    return fromMock as Appointment[];
  }, []);

  const plannedMockAppointments = useMemo(() => {
    return (mockData as unknown as { mockAppointments?: unknown }).mockAppointments ?? [];
  }, []);

  const [requestedAppointments, setRequestedAppointments] = useState<Appointment[]>(() => {
    try {
      const raw = localStorage.getItem(localStorageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as unknown;
      return Array.isArray(parsed) ? (parsed as Appointment[]) : [];
    } catch {
      return [];
    }
  });

  const persistRequestedAppointments = (next: Appointment[]) => {
    try {
      localStorage.setItem(localStorageKey, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  // Ophalen van afspraken uit de backend (json-server). Als dat faalt: laat mockdata staan.
  useEffect(() => {
    let cancelled = false;
    async function fetchAppointments() {
      try {
        const res = await fetch(appointmentRequestsUrl, { method: "GET" });
        if (!res.ok) return;
        const data = (await res.json()) as Appointment[];
        if (!cancelled && Array.isArray(data)) {
          setRequestedAppointments((prev) => {
            const byId = new Map<string, Appointment>();
            // keep local first (optimistic / offline), then overlay server items (same id wins)
            for (const a of prev) byId.set(a.id, a);
            for (const a of data) byId.set(a.id, a);
            const merged = Array.from(byId.values());
            persistRequestedAppointments(merged);
            return merged;
          });
        }
      } catch {
        // ignore: offline / json-server niet gestart
      }
    }
    fetchAppointments();
    return () => {
      cancelled = true;
    };
  }, [appointmentRequestsUrl]);

  // Filter afspraken voor vandaag, later en afgelopen

  // Simpele datumvergelijking (pas aan naar jouw logica)
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayMockAppointments = mockAppointments.filter((a) => a.date === todayStr);
  const laterMockAppointments = mockAppointments.filter((a) => a.date > todayStr);
  const pastMockAppointments = mockAppointments.filter((a) => a.date < todayStr);

  const todayRequestedAppointments = requestedAppointments.filter((a) => a.date === todayStr);
  const laterRequestedAppointments = requestedAppointments.filter((a) => a.date > todayStr);
  const pastRequestedAppointments = requestedAppointments.filter((a) => a.date < todayStr);

  // Voeg nieuwe afspraak toe vanuit AppointmentRequestSheet
  const handleAppointmentRequest = (request: AppointmentRequest) => {
    const optimistic: Appointment = {
      id: createId(),
      date: request.date,
      timeOfDay: request.timeOfDay,
      notes: request.notes,
      createdByName: currentUserName,
      createdAt: new Date().toISOString(),
    };

    // Toon meteen in UI
    setRequestedAppointments((prev) => {
      const next = [...prev, optimistic];
      persistRequestedAppointments(next);
      return next;
    });
    setLastRequest(request);
    setIsRequestSentOpen(true);

    // Probeer ook op te slaan in json-server, zodat `src/Database/data.json` wordt bijgewerkt.
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
            createdAt: optimistic.createdAt,
          } satisfies Omit<Appointment, "id">),
        });
        if (!res.ok) return;
        const created = (await res.json()) as Appointment;
        // Vervang optimistic met server-item (id komt uit json-server)
        setRequestedAppointments((prev) => {
          const next = prev.map((a) => (a.id === optimistic.id ? created : a));
          persistRequestedAppointments(next);
          return next;
        });
      } catch {
        // ignore: offline / json-server niet gestart
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
    // Legacy: mock appointment-requests (kept in case it's used elsewhere)
    todayMockAppointments,
    laterMockAppointments,
    pastMockAppointments,
    // Planned mock appointments (from mockData.ts `mockAppointments`)
    plannedMockAppointments,
    todayRequestedAppointments,
    laterRequestedAppointments,
    pastRequestedAppointments,
    handleAppointmentRequest,
    isRequestSentOpen,
    setIsRequestSentOpen,
    lastRequest,
  };
}
