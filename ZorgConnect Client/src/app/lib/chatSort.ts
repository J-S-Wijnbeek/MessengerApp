import type { GroupChat, GroupChatMessage } from "./groupChats";

/** Vergelijkbaar getal: hoger = recenter (voor inbox-sortering). */
export function parseTimestampOrder(ts: string): number {
  const s = ts.trim();
  const hm = s.match(/^(\d{1,2}):(\d{2})$/);
  if (hm) return 10_000 + parseInt(hm[1], 10) * 60 + parseInt(hm[2], 10);
  if (/gisteren/i.test(s)) return 8_000;
  if (/^(maandag|dinsdag|woensdag|donderdag|vrijdag|zaterdag|zondag)/i.test(s)) return 5_000;
  return 0;
}

/** In de thread: oudste eerst (bovenaan), nieuwste onderaan — gangbare chatvolgorde. */
export function sortMessagesOldestFirst<T extends { timestamp: string; id: string | number }>(
  messages: T[],
): T[] {
  return [...messages].sort((a, b) => {
    const d = parseTimestampOrder(a.timestamp) - parseTimestampOrder(b.timestamp);
    if (d !== 0) return d;
    return String(a.id).localeCompare(String(b.id), undefined, { numeric: true });
  });
}

/** Nieuwste bericht bovenaan, oudste onderaan (afnemende tijd). */
export function sortMessagesNewestFirst<T extends { timestamp: string; id: string | number }>(
  messages: T[],
): T[] {
  return sortMessagesOldestFirst(messages).reverse();
}

/**
 * Milliseconden voor “laatste activiteit” op basis van mock-timestamps (HH:mm, Gisteren, …)
 * en een referentiedatum (createdAt van thread of vaste demo-dag).
 */
export function lastActivityUtcMs(timestamp: string, referenceIsoDate: string): number {
  const ts = timestamp.trim();
  const fb = new Date(referenceIsoDate);
  const y = fb.getUTCFullYear();
  const mo = fb.getUTCMonth();
  const d = fb.getUTCDate();

  const hm = ts.match(/^(\d{1,2}):(\d{2})$/);
  if (hm) {
    const h = parseInt(hm[1], 10);
    const min = parseInt(hm[2], 10);
    return Date.UTC(y, mo, d, h, min, 0, 0);
  }
  if (/gisteren/i.test(ts)) {
    return Date.UTC(y, mo, d - 1, 23, 0, 0, 0);
  }
  if (/^(maandag|dinsdag|woensdag|donderdag|vrijdag|zaterdag|zondag)/i.test(ts)) {
    return Date.UTC(y, mo, d - 3, 12, 0, 0, 0);
  }
  return fb.getTime();
}

export function groupChatRecency(gc: GroupChat): number {
  if (gc.messages.length === 0) return 0;
  const sorted = sortMessagesOldestFirst(gc.messages as GroupChatMessage[]);
  const last = sorted[sorted.length - 1];
  const base = lastActivityUtcMs(last.timestamp, gc.createdAt);
  const tie = typeof last.id === "string" ? last.id.length : Number(last.id) || 0;
  return base + tie * 1e-6;
}

/** 1-op-1: laatste bericht op vaste demo-dag (zelfde schaal als groupChatRecency). */
const DIRECT_FALLBACK_DAY = "2026-04-01T12:00:00.000Z";

export function directChatRecency(
  chatId: string,
  messages: Array<{ id: number | string; timestamp: string; chatId: string }>,
): number {
  const msgs = messages.filter((m) => m.chatId === chatId);
  if (msgs.length === 0) return 0;
  const sorted = sortMessagesOldestFirst(msgs);
  const last = sorted[sorted.length - 1];
  const base = lastActivityUtcMs(last.timestamp, DIRECT_FALLBACK_DAY);
  const tie = typeof last.id === "number" ? last.id : 0;
  return base + tie * 1e-6;
}
