export const MAX_CLIENT_MESSAGES_BEFORE_APPROVAL = 2;

export type GroupChatMessage = {
  id: number | string;
  chatId: string;
  message: string;
  senderType: "client" | "staff" | "system";
  timestamp: string;
  read?: boolean;
};

export type GroupChat = {
  id: string;
  title: string;
  memberIds: number[];
  status: "pending" | "approved";
  memberApprovals: Record<string, boolean>;
  messages: GroupChatMessage[];
  createdAt: string;
};

const localStorageKey = "zorgconnect:client:groupChats";

export function loadGroupChatsFromLocalStorage(): GroupChat[] {
  try {
    const raw = localStorage.getItem(localStorageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as GroupChat[]) : [];
  } catch {
    return [];
  }
}

export function saveGroupChatsToLocalStorage(next: GroupChat[]) {
  try {
    localStorage.setItem(localStorageKey, JSON.stringify(next));
  } catch {
    // ignore
  }
}

/** Laatste item wint bij dezelfde id (handig om duplicaten uit de array te halen). */
export function dedupeGroupChatsById(list: GroupChat[]): GroupChat[] {
  return mergeGroupChatsById(list, []);
}

function mergeMessagesUnique(a: GroupChatMessage[], b: GroupChatMessage[]): GroupChatMessage[] {
  const seen = new Set<string>();
  const out: GroupChatMessage[] = [];
  for (const m of [...a, ...b]) {
    const key = String(m.id);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(m);
  }
  return out;
}

function mergeTwoGroupChatsSameThread(a: GroupChat, b: GroupChat, threadId: string): GroupChat {
  const messages = mergeMessagesUnique(a.messages, b.messages).map((m) => ({
    ...m,
    chatId: threadId,
  }));
  const status: GroupChat["status"] =
    a.status === "approved" || b.status === "approved" ? "approved" : "pending";
  const memberApprovals = { ...a.memberApprovals };
  for (const [k, v] of Object.entries(b.memberApprovals)) {
    if (v) memberApprovals[k] = true;
  }
  const memberIds = a.memberIds.length >= b.memberIds.length ? a.memberIds : b.memberIds;
  return {
    ...a,
    id: threadId,
    title: a.title || b.title,
    memberIds,
    messages,
    status,
    memberApprovals,
    createdAt: a.createdAt <= b.createdAt ? a.createdAt : b.createdAt,
  };
}

/**
 * Voegt records samen die bij dezelfde thread horen (zelfde g-... in berichten),
 * bv. na meerdere POSTs naar json-server met verschillende top-level id.
 */
export function collapseGroupChatsByThreadId(list: GroupChat[]): GroupChat[] {
  const byThread = new Map<string, GroupChat[]>();
  for (const gc of list) {
    const threadId =
      gc.messages.find((m) => m.chatId?.startsWith("g-"))?.chatId ??
      (gc.id.startsWith("g-") ? gc.id : null) ??
      gc.id;
    const arr = byThread.get(threadId) ?? [];
    arr.push(gc);
    byThread.set(threadId, arr);
  }
  const out: GroupChat[] = [];
  for (const [threadId, group] of byThread) {
    if (group.length === 1) {
      const g0 = group[0];
      out.push(
        g0.id === threadId
          ? g0
          : { ...g0, id: threadId, messages: g0.messages.map((m) => ({ ...m, chatId: threadId })) },
      );
      continue;
    }
    let merged = group[0];
    for (let i = 1; i < group.length; i++) {
      merged = mergeTwoGroupChatsSameThread(merged, group[i], threadId);
    }
    out.push(merged);
  }
  return out.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}

export function mergeGroupChatsById(a: GroupChat[], b: GroupChat[]): GroupChat[] {
  const map = new Map<string, GroupChat>();
  for (const g of a) map.set(g.id, g);
  for (const g of b) {
    const existing = map.get(g.id);
    if (!existing) {
      map.set(g.id, g);
      continue;
    }
    const messages =
      g.messages.length > existing.messages.length ? g.messages : existing.messages;
    const status: GroupChat["status"] =
      g.status === "approved" || existing.status === "approved" ? "approved" : "pending";
    const memberApprovals = { ...existing.memberApprovals };
    for (const [k, v] of Object.entries(g.memberApprovals)) {
      if (v) memberApprovals[k] = true;
    }
    map.set(g.id, {
      ...existing,
      ...g,
      messages,
      status,
      memberApprovals,
    });
  }
  return Array.from(map.values());
}

export function countClientMessagesInGroup(gc: GroupChat): number {
  return gc.messages.filter((m) => m.senderType === "client").length;
}

export function isGroupChatId(id: string | null): id is string {
  return id !== null && id.startsWith("g-");
}
