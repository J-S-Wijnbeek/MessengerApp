import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import * as mockData from "../../../data/mockData";

type EmergencyContact = {
  id: string;
  name: string;
  relation: string;
  phone: string;
  updatedAt: string; // ISO string
};

type ClientSettings = {
  locatieDelen?: boolean;
  omgangPreferences?: string;
};

const localStorageSettingsKey = "zorgconnect:client:settings";
const defaultOmgangPreferences =
  "Bij onrust: rustig benaderen, 1-op-1 praten. Vermijd drukte. Overleg bij escalatie met begeleider.";

const createId = () => {
  const c = (globalThis as unknown as { crypto?: { randomUUID?: () => string } }).crypto;
  if (c?.randomUUID) return c.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};

const toMillis = (isoLike: string | undefined) => {
  if (!isoLike) return 0;
  const t = Date.parse(isoLike);
  return Number.isFinite(t) ? t : 0;
};

const mergeMostRecent = (a: EmergencyContact[], b: EmergencyContact[]) => {
  const byId = new Map<string, EmergencyContact>();
  const consider = (c: EmergencyContact) => {
    const prev = byId.get(c.id);
    if (!prev) {
      byId.set(c.id, c);
      return;
    }
    if (toMillis(c.updatedAt) >= toMillis(prev.updatedAt)) byId.set(c.id, c);
  };
  for (const c of a) consider(c);
  for (const c of b) consider(c);
  return Array.from(byId.values()).sort((x, y) => toMillis(y.updatedAt) - toMillis(x.updatedAt));
};

export function useClientProfiel() {
  const navigate = useNavigate();

  const goBack = () => navigate("/instellingen");

  const dbBaseUrl = import.meta.env.VITE_DATABASE_URL || "http://localhost:3001";
  const emergencyContactsUrl = useMemo(
    () => `${dbBaseUrl.replace(/\/$/, "")}/emergencyContacts`,
    [dbBaseUrl],
  );
  const settingsUrl = useMemo(() => `${dbBaseUrl.replace(/\/$/, "")}/settings`, [dbBaseUrl]);
  const localStorageKey = "zorgconnect:client:emergencyContacts";

  const mockEmergencyContacts = useMemo<EmergencyContact[]>(() => {
    const fromMock = (mockData as unknown as { mockEmergencyContacts?: unknown }).mockEmergencyContacts ?? [];
    return fromMock as EmergencyContact[];
  }, []);

  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(() => {
    try {
      const raw = localStorage.getItem(localStorageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as unknown;
      return Array.isArray(parsed) ? (parsed as EmergencyContact[]) : [];
    } catch {
      return [];
    }
  });

  const [omgangPreferences, setOmgangPreferences] = useState<string>(() => {
    try {
      const raw = localStorage.getItem(localStorageSettingsKey);
      if (!raw) return defaultOmgangPreferences;
      const parsed = JSON.parse(raw) as ClientSettings;
      const v = typeof parsed?.omgangPreferences === "string" ? parsed.omgangPreferences : "";
      return v.trim().length > 0 ? v : defaultOmgangPreferences;
    } catch {
      return defaultOmgangPreferences;
    }
  });

  const persistEmergencyContacts = (next: EmergencyContact[]) => {
    try {
      localStorage.setItem(localStorageKey, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const persistSettings = (patch: Partial<ClientSettings>) => {
    try {
      const prevRaw = localStorage.getItem(localStorageSettingsKey);
      const prev = prevRaw ? (JSON.parse(prevRaw) as ClientSettings) : ({} as ClientSettings);
      localStorage.setItem(localStorageSettingsKey, JSON.stringify({ ...prev, ...patch }));
    } catch {
      // ignore
    }
  };

  // Server ophalen (json-server). Meest recente per id wint.
  useEffect(() => {
    let cancelled = false;
    async function fetchEmergencyContacts() {
      try {
        const res = await fetch(emergencyContactsUrl, { method: "GET" });
        if (!res.ok) return;
        const data = (await res.json()) as EmergencyContact[];
        if (!cancelled && Array.isArray(data)) {
          setEmergencyContacts((prev) => {
            const merged = mergeMostRecent(prev, data);
            persistEmergencyContacts(merged);
            return merged;
          });
        }
      } catch {
        // ignore
      }
    }
    fetchEmergencyContacts();
    return () => {
      cancelled = true;
    };
  }, [emergencyContactsUrl]);

  // Settings ophalen (json-server). Alleen overnemen als er een waarde is.
  useEffect(() => {
    let cancelled = false;
    async function fetchSettings() {
      try {
        const res = await fetch(settingsUrl, { method: "GET" });
        if (!res.ok) return;
        const data = (await res.json()) as ClientSettings;
        const next = typeof data?.omgangPreferences === "string" ? data.omgangPreferences : "";
        if (!cancelled && next.trim().length > 0) {
          setOmgangPreferences(next);
          persistSettings({ omgangPreferences: next });
        }
      } catch {
        // ignore
      }
    }
    fetchSettings();
    return () => {
      cancelled = true;
    };
  }, [settingsUrl]);

  const saveOmgangPreferences = (nextRaw: string) => {
    const next = nextRaw.trim();
    setOmgangPreferences(next);
    persistSettings({ omgangPreferences: next });

    (async () => {
      try {
        await fetch(settingsUrl, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ omgangPreferences: next } satisfies Partial<ClientSettings>),
        });
      } catch {
        // ignore
      }
    })();
  };

  const mergedEmergencyContacts = useMemo(() => {
    return mergeMostRecent(mockEmergencyContacts, emergencyContacts);
  }, [mockEmergencyContacts, emergencyContacts]);

  const upsertEmergencyContact = (input: Omit<EmergencyContact, "updatedAt"> & { updatedAt?: string }) => {
    const nextItem: EmergencyContact = {
      ...input,
      id: input.id || createId(),
      updatedAt: input.updatedAt || new Date().toISOString(),
    };

    // Optimistic in UI + localStorage
    setEmergencyContacts((prev) => {
      const without = prev.filter((c) => c.id !== nextItem.id);
      const next = mergeMostRecent(without, [nextItem]);
      persistEmergencyContacts(next);
      return next;
    });

    // Sync naar json-server (POST als nieuw, anders PUT)
    (async () => {
      try {
        const isExisting = emergencyContacts.some((c) => c.id === nextItem.id);
        const url = isExisting ? `${emergencyContactsUrl}/${encodeURIComponent(nextItem.id)}` : emergencyContactsUrl;
        const method = isExisting ? "PUT" : "POST";
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nextItem),
        });
        if (!res.ok) return;
        const saved = (await res.json()) as EmergencyContact;
        setEmergencyContacts((prev) => {
          const without = prev.filter((c) => c.id !== saved.id);
          const next = mergeMostRecent(without, [saved]);
          persistEmergencyContacts(next);
          return next;
        });
      } catch {
        // ignore
      }
    })();
  };

  const deleteEmergencyContact = (id: string) => {
    setEmergencyContacts((prev) => {
      const next = prev.filter((c) => c.id !== id);
      persistEmergencyContacts(next);
      return next;
    });
    (async () => {
      try {
        await fetch(`${emergencyContactsUrl}/${encodeURIComponent(id)}`, { method: "DELETE" });
      } catch {
        // ignore
      }
    })();
  };

  return {
    goBack,
    emergencyContacts: mergedEmergencyContacts,
    upsertEmergencyContact,
    deleteEmergencyContact,
    omgangPreferences,
    saveOmgangPreferences,
  };
}
