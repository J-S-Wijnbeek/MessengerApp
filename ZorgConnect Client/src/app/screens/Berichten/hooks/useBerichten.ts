import { useMemo, useState } from "react";
import { useLocation } from "react-router";
import { mockCoupledCareWorkers } from "../../../data/mockData";

type ChatMessage = {
  id: string;
  text: string;
  sender: "staff" | "client";
  time: string;
};

const createId = () => {
  const c = (globalThis as unknown as { crypto?: { randomUUID?: () => string } }).crypto;
  if (c?.randomUUID) return c.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};

export function useBerichten() {
  const location = useLocation();
  const initialChatId = location.state?.chatId || null;

  const [selectedChat, setSelectedChat] = useState<number | null>(initialChatId);
  const [message, setMessage] = useState("");
  const [showNewChatSheet, setShowNewChatSheet] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUnavailableAlert, setShowUnavailableAlert] = useState(true);

  const [conversations, setConversations] = useState<Record<number, ChatMessage[]>>(() => ({
    1: [
      { id: "1-1", text: "Hallo, hoe gaat het met je?", sender: "staff", time: "14:20" },
      { id: "1-2", text: "Het gaat goed, dank je!", sender: "client", time: "14:25" },
      { id: "1-3", text: "Fijn om te horen. Heb je nog vragen?", sender: "staff", time: "14:28" },
      { id: "1-4", text: "Dank je wel voor het gesprek vandaag", sender: "client", time: "14:30" },
    ],
    2: [
      { id: "2-1", text: "Bedankt voor het gesprek!", sender: "client", time: "Gisteren" },
      { id: "2-2", text: "Graag gedaan. Laat maar weten als je iets nodig hebt.", sender: "staff", time: "Gisteren" },
    ],
    3: [
      { id: "3-1", text: "Tot morgen!", sender: "client", time: "Maandag" },
    ],
  }));

  const mockMessages: ChatMessage[] = useMemo(() => {
    if (!selectedChat) return [];
    return conversations[selectedChat] ?? [];
  }, [conversations, selectedChat]);

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

  const openChat = (id: number) => {
    setSelectedChat(id);
    setShowUnavailableAlert(true);
  };

  const closeChat = () => setSelectedChat(null);

  const openNewChatSheet = () => setShowNewChatSheet(true);
  const closeNewChatSheet = () => setShowNewChatSheet(false);

  const startChat = (id: number) => {
    setSelectedChat(id);
    setShowNewChatSheet(false);
    setSearchQuery("");
  };

  const sendMessage = () => {
    if (!selectedChat) return;
    const text = message.trim();
    if (!text) return;
    const newMsg: ChatMessage = {
      id: createId(),
      text,
      sender: "client",
      time: new Date().toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" }),
    };
    setConversations((prev) => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] ?? []), newMsg],
    }));
    setMessage("");
  };

  const getChatPreview = (chatId: number) => {
    const msgs = conversations[chatId] ?? [];
    const last = msgs[msgs.length - 1];
    return {
      text: last?.text ?? "",
      time: last?.time ?? "",
    };
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
    mockMessages,
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
    getChatPreview,
  };
}