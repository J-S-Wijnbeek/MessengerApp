import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { io } from "socket.io-client";
import { TealHeader } from "../../components/TealHeader";
import { ClientBottomNav } from "../../components/ClientBottomNav";
import { mockCoupledCareWorkers } from "../../data/mockData";
import { Send, ArrowLeft, X, Plus, Search, AlertCircle, Check, Users } from "lucide-react";
import { useLocation } from "react-router";
import {
  type GroupChat,
  type GroupChatMessage,
  MAX_CLIENT_MESSAGES_BEFORE_APPROVAL,
  countClientMessagesInGroup,
  isGroupChatId,
  loadGroupChatsFromLocalStorage,
  collapseGroupChatsByThreadId,
  dedupeGroupChatsById,
  mergeGroupChatsById,
  saveGroupChatsToLocalStorage,
} from "../../lib/groupChats";
import {
  directChatRecency,
  groupChatRecency,
  sortMessagesOldestFirst,
} from "../../lib/chatSort";

const initialMockMessages = [
  { id: 1, message: "Hallo, hoe gaat het met je?", senderType: "staff", timestamp: "14:20", chatId: "1", read: true },
  { id: 2, message: "Het gaat goed, dank je!", senderType: "client", timestamp: "14:25", chatId: "1", read: false },
  { id: 3, message: "Fijn om te horen. Heb je nog vragen?", senderType: "staff", timestamp: "14:28", chatId: "1", read: true },
  { id: 4, message: "Dank je wel voor het gesprek vandaag", senderType: "client", timestamp: "14:30", chatId: "1", read: false },
];

const createMsgId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

export default function Berichten() {
  const location = useLocation();
  const rawInitial = location.state?.chatId;
  const initialChatId =
    rawInitial === undefined || rawInitial === null ? null : String(rawInitial);
  const socketRef = useRef<any>(null);
  const selectedChatRef = useRef<string | null>(initialChatId);

  const dbBaseUrl = import.meta.env.VITE_DATABASE_URL || "http://localhost:3001";
  const groupChatsUrl = `${dbBaseUrl.replace(/\/$/, "")}/groupChats`;

  const [selectedChatId, setSelectedChatId] = useState<string | null>(initialChatId);
  const currentChatId = selectedChatId ?? "";
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(initialMockMessages);
  const [showNewChatSheet, setShowNewChatSheet] = useState(false);
  const [newChatMode, setNewChatMode] = useState<"direct" | "group">("direct");
  const [selectedGroupMemberIds, setSelectedGroupMemberIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [groupChats, setGroupChats] = useState<GroupChat[]>(() => loadGroupChatsFromLocalStorage());
  const [showUnavailableAlert, setShowUnavailableAlert] = useState(true); // Demo: show on first load
  const [triggerWarning, setTriggerWarning] = useState<string | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const localTriggerWords = ["help", "emergency", "urgent", "suicide", "panic", "abuse", "danger", "angst", "stress"];


  const filteredCareWorkers = mockCoupledCareWorkers.filter((worker) =>
    worker.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    selectedChatRef.current = selectedChatId;
  }, [selectedChatId]);

  useEffect(() => {
    saveGroupChatsToLocalStorage(groupChats);
  }, [groupChats]);

  // Samenvoegen van dubbele json-server POSTs (zelfde g-thread, verschillende top-level id)
  useEffect(() => {
    const collapsed = collapseGroupChatsByThreadId(groupChats);
    if (collapsed.length !== groupChats.length) {
      setGroupChats(collapsed);
      saveGroupChatsToLocalStorage(collapsed);
    }
  }, [groupChats]);

  useEffect(() => {
    let cancelled = false;
    async function loadGroupChatsFromServer() {
      try {
        const res = await fetch(groupChatsUrl);
        if (res.status === 404) {
          if (!cancelled) {
            setGroupChats([]);
            saveGroupChatsToLocalStorage([]);
          }
          return;
        }
        if (!res.ok) return;
        const data = (await res.json()) as unknown;
        if (cancelled || !Array.isArray(data)) return;

        // Lege serverlijst (zoals in data.json) wist oude localStorage-demo-data.
        if (data.length === 0) {
          setGroupChats([]);
          saveGroupChatsToLocalStorage([]);
          return;
        }

        setGroupChats((prev) =>
          collapseGroupChatsByThreadId(
            dedupeGroupChatsById(mergeGroupChatsById(prev, data as GroupChat[])),
          ),
        );
      } catch {
        // Server niet bereikbaar: houd init uit localStorage
      }
    }
    loadGroupChatsFromServer();
    const poll = setInterval(loadGroupChatsFromServer, 8000);
    return () => {
      cancelled = true;
      clearInterval(poll);
    };
  }, [groupChatsUrl]);

  const persistGroupChatToServer = useCallback(
    async (gc: GroupChat, list: GroupChat[]) => {
      const idUrl = `${groupChatsUrl}/${encodeURIComponent(gc.id)}`;
      try {
        const put = await fetch(idUrl, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(gc),
        });
        if (put.ok) {
          saveGroupChatsToLocalStorage(list);
          return;
        }
        // Alleen POST als resource nog niet bestaat — voorkomt dubbele rijen bij elke mislukte PUT
        if (put.status === 404) {
          const post = await fetch(groupChatsUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(gc),
          });
          if (post.ok) {
            saveGroupChatsToLocalStorage(list);
          }
          return;
        }
      } catch {
        // alleen localStorage
      }
      saveGroupChatsToLocalStorage(list);
    },
    [groupChatsUrl],
  );

  useEffect(() => {
    const socket = io("http://localhost:3001");
    socketRef.current = socket;

    const handleHistory = ({ chatId, history }: any) => {
      if (String(chatId).startsWith("g-")) return;
      if (chatId !== currentChatId) return;
      setMessages(history);
    };

    const handleIncoming = (msg: any) => {
      const cid = String(msg.chatId);
      if (cid.startsWith("g-")) {
        setGroupChats((prev) =>
          prev.map((g) => {
            if (g.id !== cid) return g;
            if (g.messages.some((m) => String(m.id) === String(msg.id))) return g;
            const incoming: GroupChatMessage = {
              id: msg.id,
              chatId: cid,
              message: msg.message,
              senderType: msg.senderType === "client" ? "client" : "staff",
              timestamp: msg.timestamp,
              read: msg.read,
            };
            return { ...g, messages: [...g.messages, incoming] };
          }),
        );
        return;
      }
      if (msg.chatId !== currentChatId) return;
      setMessages((prev) =>
        prev.some((existing) => existing.id === msg.id) ? prev : [...prev, msg]
      );
    };

    const handleTriggerWarning = ({ chatId, matches, message }: any) => {
      if (chatId !== currentChatId) return;
      const warningText = `Trigger warning for chat ${chatId}: ${matches.join(", ")} - ${message}`;
      console.error(warningText);
      setTriggerWarning(warningText);
      setTimeout(() => setTriggerWarning(null), 10000);
    };

    const handleConnect = () => {
      console.log("Socket connected", socket.id);
      setSocketConnected(true);
      socket.emit("join_chat", currentChatId);
      socket.emit("read_chat", { chatId: currentChatId, readerType: "client" });
    };

    const handleDisconnect = (reason: any) => {
      console.log("Socket disconnected", reason);
      setSocketConnected(false);
    };

    const handleError = (error: any) => {
      console.error("Socket.IO error:", error);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleError);
    socket.on("chat_history", handleHistory);
    socket.on("chat_message", handleIncoming);
    socket.on("trigger_warning", handleTriggerWarning);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleError);
      socket.off("chat_history", handleHistory);
      socket.off("chat_message", handleIncoming);
      socket.off("trigger_warning", handleTriggerWarning);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!currentChatId) return;
    socketRef.current?.emit("join_chat", currentChatId);
    socketRef.current?.emit("read_chat", { chatId: currentChatId, readerType: "client" });
  }, [currentChatId]);

  const selectedGroup = useMemo(() => {
    if (!isGroupChatId(selectedChatId)) return null;
    return (
      groupChats.find((g) => g.id === selectedChatId) ??
      groupChats.find((g) => g.messages.some((m) => m.chatId === selectedChatId)) ??
      null
    );
  }, [groupChats, selectedChatId]);

  /* Chronologisch: oudste bovenaan, nieuwste onderaan (vast sorteerkey op tijd + id). */
  const activeMessages = useMemo(() => {
    if (isGroupChatId(selectedChatId) && selectedGroup) {
      return sortMessagesOldestFirst(selectedGroup.messages);
    }
    const filtered = messages.filter((msg) => msg.chatId === currentChatId);
    return sortMessagesOldestFirst(filtered);
  }, [selectedChatId, selectedGroup, messages, currentChatId]);

  const inboxRows = useMemo(() => {
    type Row =
      | { kind: "group"; gc: GroupChat; recency: number }
      | { kind: "direct"; worker: (typeof mockCoupledCareWorkers)[number]; recency: number };
    const rows: Row[] = [];
    for (const gc of collapseGroupChatsByThreadId(groupChats)) {
      if (gc.messages.length === 0) continue;
      rows.push({ kind: "group", gc, recency: groupChatRecency(gc) });
    }
    for (const worker of mockCoupledCareWorkers) {
      const hasMessages = messages.some((m) => m.chatId === String(worker.id));
      if (!hasMessages) continue;
      rows.push({
        kind: "direct",
        worker,
        recency: directChatRecency(String(worker.id), messages),
      });
    }
    rows.sort((a, b) => b.recency - a.recency);
    return rows;
  }, [groupChats, messages]);

  const clientBlockedOnGroup =
    selectedGroup &&
    selectedGroup.status === "pending" &&
    countClientMessagesInGroup(selectedGroup) >= MAX_CLIENT_MESSAGES_BEFORE_APPROVAL;

  const handleSend = () => {
    if (!message.trim() || selectedChatId === null) return;

    if (isGroupChatId(selectedChatId)) {
      const gc =
        groupChats.find((g) => g.id === selectedChatId) ??
        groupChats.find((g) => g.messages.some((m) => m.chatId === selectedChatId));
      if (!gc) return;
      if (gc.status === "pending" && countClientMessagesInGroup(gc) >= MAX_CLIENT_MESSAGES_BEFORE_APPROVAL) {
        return;
      }
      const threadId = gc.messages[0]?.chatId?.startsWith("g-")
        ? gc.messages[0].chatId
        : gc.id;
      const normalizedGc = gc.id === threadId ? gc : { ...gc, id: threadId };
      const msg: GroupChatMessage = {
        id: createMsgId(),
        chatId: threadId,
        senderType: "client",
        message: message.trim(),
        timestamp: new Date().toLocaleTimeString("nl-NL", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        read: false,
      };
      const lower = msg.message.toLowerCase();
      const localMatches = localTriggerWords.filter((word) => lower.includes(word));
      if (localMatches.length > 0) {
        const warningText = `Trigger word gedetecteerd: ${localMatches.join(", ")} in bericht "${msg.message}"`;
        setTriggerWarning(warningText);
        setTimeout(() => setTriggerWarning(null), 10000);
      }
      const nextGc: GroupChat = { ...normalizedGc, messages: [...normalizedGc.messages, msg] };
      setGroupChats((prev) => {
        const others = prev.filter((g) => {
          const t =
            g.messages.find((m) => m.chatId?.startsWith("g-"))?.chatId ??
            (g.id.startsWith("g-") ? g.id : "");
          return t !== threadId && g.id !== threadId;
        });
        const next = collapseGroupChatsByThreadId([...others, nextGc]);
        void persistGroupChatToServer(nextGc, next);
        return next;
      });
      socketRef.current?.emit("chat_message", { ...msg, id: msg.id });
      setMessage("");
      return;
    }

    const msg = {
      id: Date.now(),
      chatId: currentChatId,
      senderType: "client" as const,
      message: message.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      read: false,
    };

    const lower = msg.message.toLowerCase();
    const localMatches = localTriggerWords.filter((word) => lower.includes(word));
    if (localMatches.length > 0) {
      const warningText = `Local trigger word detected: ${localMatches.join(", ")} in message "${msg.message}"`;
      console.error(warningText);
      setTriggerWarning(warningText);
      setTimeout(() => setTriggerWarning(null), 10000);
    }

    setMessages((prev) => [...prev, msg]);
    socketRef.current?.emit("chat_message", msg);
    setMessage("");
  };

  // Get available staff members (both coupled and others)
  const availableStaff = mockCoupledCareWorkers.filter(
    (worker) => worker.status === "beschikbaar"
  );

  const selectedStaffMember = selectedChatId
    ? mockCoupledCareWorkers.find((worker) => String(worker.id) === selectedChatId) ?? null
    : null;
  const isStaffUnavailable = selectedStaffMember
    ? selectedStaffMember.status !== "beschikbaar"
    : false;
  const statusText = selectedStaffMember?.status === "achterwacht"
    ? "Deze medewerker reageert mogelijk later."
    : "Je bericht wordt later gelezen.";

  const openChat = (workerId: number) => {
    setSelectedChatId(String(workerId));
    setShowUnavailableAlert(true);
  };

  const openGroupChat = (groupId: string) => {
    setSelectedChatId(groupId);
    setShowUnavailableAlert(false);
  };

  const closeChat = () => {
    setSelectedChatId(null);
  };

  const openNewChatSheet = () => {
    setShowNewChatSheet(true);
    setNewChatMode("direct");
    setSelectedGroupMemberIds([]);
  };
  const closeNewChatSheet = () => {
    setShowNewChatSheet(false);
    setNewChatMode("direct");
    setSelectedGroupMemberIds([]);
  };
  const startChat = (workerId: number) => {
    setSelectedChatId(String(workerId));
    setShowNewChatSheet(false);
    setShowUnavailableAlert(true);
  };

  const toggleGroupMember = (id: number) => {
    setSelectedGroupMemberIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  const createGroupChat = () => {
    if (selectedGroupMemberIds.length < 2 || selectedGroupMemberIds.length > 4) return;
    const members = mockCoupledCareWorkers.filter((w) => selectedGroupMemberIds.includes(w.id));
    const title = `Groep (${members.map((m) => m.name.split(" ")[0]).join(", ")})`;
    const id = `g-${createMsgId()}`;
    const now = new Date().toISOString();
    const systemText =
      "Je mag maximaal 2 berichten sturen in deze groepschat. Alle gekozen medewerkers moeten dit groepsverzoek goedkeuren voordat de chat verder gaat. Tot die tijd kun je na die 2 berichten niets meer sturen.";
    const systemMsg: GroupChatMessage = {
      id: `sys-${createMsgId()}`,
      chatId: id,
      senderType: "system",
      message: systemText,
      timestamp: new Date().toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" }),
      read: true,
    };
    const memberApprovals: Record<string, boolean> = {};
    for (const mid of selectedGroupMemberIds) memberApprovals[String(mid)] = false;
    const newGc: GroupChat = {
      id,
      title,
      memberIds: [...selectedGroupMemberIds].sort((a, b) => a - b),
      status: "pending",
      memberApprovals,
      messages: [systemMsg],
      createdAt: now,
    };
    setGroupChats((prev) => {
      const next = dedupeGroupChatsById([...prev, newGc]);
      void persistGroupChatToServer(newGc, next);
      return next;
    });
    setSelectedChatId(id);
    closeNewChatSheet();
    setShowUnavailableAlert(false);
  };

  const getChatPreview = (workerId: number) => {
    const chatId = workerId.toString();
    const chatMessages = messages.filter((msg) => msg.chatId === chatId);
    const lastMessage = chatMessages[chatMessages.length - 1];

    return {
      text: lastMessage?.message || "",
      time: lastMessage?.timestamp || "",
    };
  };

  const getGroupPreview = (gc: GroupChat) => {
    const conversational = [...gc.messages].reverse().find((m) => m.senderType !== "system");
    const last = conversational ?? gc.messages[gc.messages.length - 1];
    const raw = (last?.message ?? "").trim();
    const text =
      raw.length > 72 ? `${raw.slice(0, 69).trimEnd()}…` : raw || "Groepschat";
    return {
      text,
      time: last?.timestamp || "",
    };
  };

  if (selectedChatId) {
    const chatSuggestions = [
      "Hoi, heb je even tijd om te bellen?",
      "Ik voel mij niet goed.",
      "Zou je me kunnen helpen met iets?",
    ];

    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col pb-20 w-full mx-auto">
        <div className="bg-primary text-primary-foreground text-center py-4 px-4 flex items-center justify-center relative">
          <button
            onClick={closeChat}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-1"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-bold text-lg px-10">
            {selectedGroup?.title ?? selectedStaffMember?.name ?? "Chat"}
          </h1>
        </div>

        {/* Unavailable Alert */}
        {isStaffUnavailable && !selectedGroup && showUnavailableAlert && (
          <div className="bg-secondary/10 border-b border-secondary p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-secondary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-medium text-foreground mb-1">
                  {statusText}
                </div>
                <div className="text-sm text-muted-foreground mb-3">
                  {selectedStaffMember?.status === "achterwacht"
                    ? "Deze medewerker reageert mogelijk later. Voor directe hulp, neem contact op met een beschikbare zorgmedewerker:"
                    : "Je bericht wordt later gelezen. Voor directe hulp, neem contact op met een beschikbare zorgmedewerker:"}
                </div>
                <div className="space-y-2">
                  {availableStaff.slice(0, 2).map((staff) => (
                    <button
                      key={staff.id}
                      onClick={() => {
                        openChat(staff.id);
                        setShowUnavailableAlert(false);
                      }}
                      className="w-full flex items-center gap-2 p-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                        {staff.name.charAt(0)}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium text-foreground">{staff.name}</div>
                        <div className="text-xs text-muted-foreground">{staff.role}</div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setShowUnavailableAlert(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Connection status */}
        <div className="px-4 py-3 text-xs text-muted-foreground">
          Socket status: {socketConnected ? "connected" : "disconnected"}
        </div>
        {/* Trigger Warning */}
        {triggerWarning && (
          <div className="bg-red-100 border border-red-300 text-red-900 rounded-xl px-4 py-3 mb-3">
            {triggerWarning}
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeMessages.map((msg) =>
            msg.senderType === "system" ? (
              <div key={msg.id} className="flex justify-center">
                <div className="max-w-[92%] rounded-xl px-3 py-2 bg-muted/70 text-center text-sm text-muted-foreground border border-border/60">
                  <div>{msg.message}</div>
                  <div className="mt-1 text-xs text-muted-foreground/80">{msg.timestamp}</div>
                </div>
              </div>
            ) : (
              <div
                key={msg.id}
                className={`flex ${msg.senderType === "client" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    msg.senderType === "client"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <div>{msg.message}</div>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span
                      className={
                        msg.senderType === "client" ? "text-primary-foreground/80" : "text-muted-foreground"
                      }
                    >
                      {msg.timestamp}
                    </span>
                    {msg.senderType === "client" && (
                      <span className="flex items-center gap-1 text-primary-foreground/60">
                        <Check size={12} />
                        {"read" in msg && msg.read ? "Gelezen" : "Verstuurd"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ),
          )}
        </div>

        {/* Input Bar */}
        <div className="border-t border-border p-4 bg-background">
          {clientBlockedOnGroup && (
            <p className="text-sm text-muted-foreground mb-3 text-center">
              Je hebt het maximum van {MAX_CLIENT_MESSAGES_BEFORE_APPROVAL} berichten bereikt. Wacht tot alle medewerkers
              het groepsverzoek hebben goedgekeurd.
            </p>
          )}
          {/* Suggestions */}
          {!clientBlockedOnGroup && (
            <div
              className="mb-3 -mx-1 overflow-x-auto [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div className="flex gap-2 px-1">
                {chatSuggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setMessage(s)}
                    className="shrink-0 rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/80 active:bg-muted transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                clientBlockedOnGroup ? "Even geduld — goedkeuring nodig" : "Typ een bericht..."
              }
              disabled={clientBlockedOnGroup}
              className="flex-1 px-4 py-2 border border-border bg-background rounded-full focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
            />
            <button
              onClick={handleSend}
              disabled={!message.trim() || clientBlockedOnGroup}
              className="w-10 h-10 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </div>

        <ClientBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 w-full mx-auto relative">
      <TealHeader title="Berichten" />

      {/* Chat List: alleen gesprekken met minstens één bericht; meest recente activiteit bovenaan */}
      <div>
        {inboxRows.map((row) => {
          if (row.kind === "group") {
            const { gc } = row;
            const preview = getGroupPreview(gc);
            const pending = gc.status === "pending";
            return (
              <div
                key={gc.id}
                onClick={() => openGroupChat(gc.id)}
                className="flex items-center gap-3 px-4 py-3 border-b border-border active:bg-muted cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 text-secondary">
                  <Users size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-secondary flex items-center gap-2">
                    {gc.title}
                    {pending && (
                      <span className="text-xs font-normal text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        Wacht op goedkeuring
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {preview.text || "Groepschat"}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground flex-shrink-0">{preview.time}</div>
              </div>
            );
          }
          const { worker } = row;
          const idx = mockCoupledCareWorkers.findIndex((w) => w.id === worker.id);
          const statusColors = ["bg-green-500", "bg-green-500", "bg-primary"];
          const statusColor = statusColors[idx] || "bg-gray-400";
          const preview = getChatPreview(worker.id);
          return (
            <div
              key={`direct-${worker.id}`}
              onClick={() => openChat(worker.id)}
              className="flex items-center gap-3 px-4 py-3 border-b border-border active:bg-muted cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0 relative">
                <span className="text-muted-foreground text-lg font-medium">
                  {worker.name.charAt(0)}
                </span>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-background rounded-full flex items-center justify-center">
                  <div className={`w-3 h-3 rounded-full ${statusColor}`} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-secondary">{worker.name}</div>
                <div className="text-sm text-muted-foreground truncate">{preview.text}</div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <div className="text-xs text-muted-foreground">{preview.time || ""}</div>
                {idx === 0 && (
                  <div className="w-5 h-5 bg-secondary text-secondary-foreground text-xs rounded-full flex items-center justify-center">
                    2
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* FAB for new message */}
      <button
        onClick={openNewChatSheet}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors z-10"
      >
        <Plus size={24} />
      </button>

      {/* Bottom Sheet for New Message */}
      {showNewChatSheet && (
        <>
          <div
            onClick={closeNewChatSheet}
            className="fixed inset-0 bg-black bg-opacity-30 z-20"
          />
          <div className="fixed bottom-0 left-0 right-0 bg-background text-foreground rounded-t-2xl shadow-2xl z-30 w-full mx-auto animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-bold text-lg">Nieuw bericht</h2>
              <button
                onClick={closeNewChatSheet}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex gap-2 px-4 pb-2">
              <button
                type="button"
                onClick={() => setNewChatMode("direct")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
                  newChatMode === "direct"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                1-op-1
              </button>
              <button
                type="button"
                onClick={() => setNewChatMode("group")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border flex items-center justify-center gap-1 ${
                  newChatMode === "group"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                <Users size={16} />
                Groepschat
              </button>
            </div>

            {newChatMode === "direct" ? (
              <>
                {/* Search Field */}
                <div className="p-4 pt-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Zoek zorgmedewerker..."
                      className="w-full pl-10 pr-4 py-2 border border-border bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                </div>

                {/* Care Workers List */}
                <div className="max-h-96 overflow-y-auto">
                  {filteredCareWorkers.map((worker) => (
                    <div
                      key={worker.id}
                      className="px-4 py-3 border-b border-border flex items-center gap-3"
                    >
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground text-lg font-medium">
                          {worker.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{worker.name}</div>
                        <div className="text-sm text-muted-foreground">{worker.role}</div>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          worker.status === "beschikbaar"
                            ? "bg-green-500"
                            : worker.status === "achterwacht"
                            ? "bg-primary"
                            : "bg-gray-400"
                        }`}
                      />
                      <button
                        onClick={() => startChat(worker.id)}
                        className="bg-secondary text-secondary-foreground px-4 py-1 rounded-lg text-sm font-medium hover:bg-secondary/90"
                      >
                        Start chat
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="px-4 pb-2 text-sm text-muted-foreground">
                  Selecteer 2 tot 4 gekoppelde medewerkers. Na aanmaken mag je maximaal 2 berichten sturen tot zij het
                  verzoek goedkeuren.
                </div>
                <div className="p-4 pt-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Zoek medewerker..."
                      className="w-full pl-10 pr-4 py-2 border border-border bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                </div>
                <div className="max-h-72 overflow-y-auto px-2">
                  {filteredCareWorkers.map((worker) => {
                    const checked = selectedGroupMemberIds.includes(worker.id);
                    return (
                      <button
                        key={worker.id}
                        type="button"
                        onClick={() => toggleGroupMember(worker.id)}
                        className="w-full px-2 py-3 border-b border-border flex items-center gap-3 text-left rounded-lg hover:bg-muted/60"
                      >
                        <input
                          type="checkbox"
                          readOnly
                          checked={checked}
                          className="h-4 w-4 rounded border-border accent-primary"
                        />
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                          <span className="text-muted-foreground font-medium">{worker.name.charAt(0)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground">{worker.name}</div>
                          <div className="text-xs text-muted-foreground">{worker.role}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="p-4 border-t border-border flex flex-col gap-2">
                  <div className="text-xs text-muted-foreground text-center">
                    Geselecteerd: {selectedGroupMemberIds.length} / 4 (minimaal 2)
                  </div>
                  <button
                    type="button"
                    onClick={createGroupChat}
                    disabled={selectedGroupMemberIds.length < 2 || selectedGroupMemberIds.length > 4}
                    className="w-full py-3 rounded-xl bg-secondary text-secondary-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Groepschat aanmaken
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}

      <ClientBottomNav />
    </div>
  );
}