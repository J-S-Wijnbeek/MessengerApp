import { useCallback, useEffect, useMemo, useState } from "react";
import { DEMO_LOGGED_IN_STAFF_ID } from "../../../data/mockData";

export type StaffGroupChat = {
  id: string;
  title: string;
  memberIds: number[];
  status: "pending" | "approved";
  memberApprovals: Record<string, boolean>;
  messages: unknown[];
  createdAt: string;
};

export function useGroupChatApprovals() {
  const dbBaseUrl = import.meta.env.VITE_DATABASE_URL || "http://localhost:3001";
  const groupChatsUrl = `${dbBaseUrl.replace(/\/$/, "")}/groupChats`;

  const [groupChats, setGroupChats] = useState<StaffGroupChat[]>([]);

  const load = useCallback(async () => {
    try {
      const res = await fetch(groupChatsUrl);
      if (!res.ok) return;
      const data = (await res.json()) as unknown;
      if (Array.isArray(data)) setGroupChats(data as StaffGroupChat[]);
    } catch {
      // json-server niet bereikbaar
    }
  }, [groupChatsUrl]);

  useEffect(() => {
    void load();
    const poll = setInterval(() => void load(), 8000);
    return () => clearInterval(poll);
  }, [load]);

  const pendingForMe = useMemo(() => {
    const sid = String(DEMO_LOGGED_IN_STAFF_ID);
    return groupChats.filter(
      (gc) =>
        gc.status === "pending" &&
        gc.memberIds.includes(DEMO_LOGGED_IN_STAFF_ID) &&
        gc.memberApprovals[sid] !== true,
    );
  }, [groupChats]);

  const approve = async (gc: StaffGroupChat) => {
    const sid = String(DEMO_LOGGED_IN_STAFF_ID);
    const nextApprovals = { ...gc.memberApprovals, [sid]: true };
    const allApproved = gc.memberIds.every((id) => nextApprovals[String(id)] === true);
    const next: StaffGroupChat = {
      ...gc,
      memberApprovals: nextApprovals,
      status: allApproved ? "approved" : "pending",
    };
    try {
      const put = await fetch(`${groupChatsUrl}/${encodeURIComponent(gc.id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!put.ok) {
        await fetch(groupChatsUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(next),
        });
      }
    } catch {
      // ignore
    }
    setGroupChats((prev) => prev.map((g) => (g.id === gc.id ? next : g)));
  };

  return { pendingForMe, approve };
}
