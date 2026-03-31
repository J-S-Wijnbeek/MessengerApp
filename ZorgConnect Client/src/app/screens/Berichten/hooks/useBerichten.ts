import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { mockCoupledCareWorkers } from "../../../data/mockData";

type ChatMessage = {
  id: string;
  chatId: number;
  senderId?: string | number;
  receiverId?: string | number;
  senderName?: string;
  receiverName?: string;
  text: string;
  sender: "client" | "staff";
  time: string;
  createdAt: string;
};

type ChatThread = {
  chatId: number;
  lastMessage: ChatMessage;
};

export function useBerichten() {
  const location = useLocation();
  const initialChatId = location.state?.chatId || null;

  // TODO: Replace with real logged-in user once auth/profile state exists.
  const currentClientId = "client-1";
  const currentClientName = "Peter Hendriks";

  const [selectedChat, setSelectedChat] = useState<number | null>(initialChatId);
  const [message, setMessage] = useState("");
  const [showNewChatSheet, setShowNewChatSheet] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUnavailableAlert, setShowUnavailableAlert] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [isThreadsLoading, setIsThreadsLoading] = useState(false);

  const apiBaseUrl = "http://localhost:3001";

  const filteredCareWorkers = mockCoupledCareWorkers.filter((worker) =>
    worker.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableStaff = mockCoupledCareWorkers.filter(
    (worker) => worker.status === "beschikbaar"
  );

  const selectedStaffMember = mockCoupledCareWorkers.find((c) => c.id === selectedChat);
  const isStaffUnavailable =
    selectedStaffMember?.status === "niet-beschikbaar" ||
    selectedStaffMember?.status === "achterwacht";
  const statusText =
    selectedStaffMember?.status === "achterwacht"
      ? "Deze zorgmedewerker is in achterwacht"
      : "Deze zorgmedewerker is momenteel niet beschikbaar";

  const refreshThreads = async () => {
    setIsThreadsLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/messages?_sort=createdAt&_order=desc`);
      const all = (await res.json()) as ChatMessage[];

      const latestByChatId = new Map<number, ChatMessage>();
      for (const m of all) {
        // Only include threads where client is participant (best-effort, backwards compatible)
        const senderId = m.senderId ?? (m.sender === "client" ? currentClientId : m.chatId);
        const receiverId = m.receiverId ?? (m.sender === "client" ? m.chatId : currentClientId);
        const isClientInvolved = senderId === currentClientId || receiverId === currentClientId;
        if (!isClientInvolved) continue;

        if (!latestByChatId.has(m.chatId)) latestByChatId.set(m.chatId, m);
      }

      const nextThreads = Array.from(latestByChatId.entries())
        .map(([chatId, lastMessage]) => ({ chatId, lastMessage }))
        .sort((a, b) => (a.lastMessage.createdAt < b.lastMessage.createdAt ? 1 : -1));

      setThreads(nextThreads);
    } catch (e) {
      console.warn("Failed to load threads:", e);
      setThreads([]);
    } finally {
      setIsThreadsLoading(false);
    }
  };

  useEffect(() => {
    refreshThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedChat) {
      setMessages([]);
      return;
    }

    (async () => {
      setIsMessagesLoading(true);
      try {
        const res = await fetch(
          `${apiBaseUrl}/messages?chatId=${selectedChat}&_sort=createdAt&_order=asc`
        );
        const data = (await res.json()) as ChatMessage[];
        setMessages(data);
      } catch (e) {
        console.warn("Failed to load messages:", e);
        setMessages([]);
      } finally {
        setIsMessagesLoading(false);
      }
    })();
  }, [selectedChat]);

  const openChat = (id: number) => {
    setSelectedChat(id);
    setShowUnavailableAlert(true);
  };

  const closeChat = () => {
    setSelectedChat(null);
    refreshThreads();
  };

  const openNewChatSheet = () => setShowNewChatSheet(true);
  const closeNewChatSheet = () => setShowNewChatSheet(false);

  const startChat = (id: number) => {
    setSelectedChat(id);
    setShowNewChatSheet(false);
    setSearchQuery("");
  };

  const sendMessage = async () => {
    if (!selectedChat) return;
    const text = message.trim();
    if (!text) return;

    setIsSending(true);
    try {
      const now = new Date();
      const receiverName =
        mockCoupledCareWorkers.find((w) => w.id === selectedChat)?.name ?? "Onbekend";

      const payload = {
        chatId: selectedChat,
        senderId: currentClientId,
        senderName: currentClientName,
        receiverId: selectedChat,
        receiverName,
        text,
        sender: "client" as const,
        time: now.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" }),
        createdAt: now.toISOString(),
      };

      const res = await fetch(`${apiBaseUrl}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const created = (await res.json()) as ChatMessage;

      setMessages((prev) => [...prev, created]);
      setThreads((prev) => {
        const without = prev.filter((t) => t.chatId !== created.chatId);
        return [{ chatId: created.chatId, lastMessage: created }, ...without];
      });
      setMessage("");
    } catch (e) {
      console.warn("Failed to send message:", e);
    } finally {
      setIsSending(false);
    }
  };

  return {
    selectedChat,
    message,
    setMessage,
    showNewChatSheet,
    searchQuery,
    setSearchQuery,
    showUnavailableAlert,
    setShowUnavailableAlert,
    messages,
    isMessagesLoading,
    isSending,
    threads,
    isThreadsLoading,
    filteredCareWorkers,
    availableStaff,
    selectedStaffMember,
    isStaffUnavailable,
    statusText,
    openChat,
    closeChat,
    openNewChatSheet,
    closeNewChatSheet,
    startChat,
    sendMessage,
  };
}
