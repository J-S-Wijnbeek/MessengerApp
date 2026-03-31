import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { mockCoupledCareWorkers } from "../../../data/mockData";
import { DB_URL } from "../../../config";

export interface Message {
  id: string;
  staff_id: number;
  text: string;
  sender: "client" | "staff";
  from_name: string | null;
  sent_at: string;
}

export function useBerichten() {
  const location = useLocation();
  const initialChatId = location.state?.chatId || null;
  // TODO: Replace with real logged-in user once auth/profile state exists.
  const currentUserName = "Peter Hendriks";

  const [selectedChat, setSelectedChat] = useState<number | null>(initialChatId);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showNewChatSheet, setShowNewChatSheet] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUnavailableAlert, setShowUnavailableAlert] = useState(true);

  const loadMessages = useCallback(
    async (staffId: number) => {
      try {
        const res = await fetch(`${DB_URL}?resource=messages&staff_id=${staffId}`);
        if (res.ok) {
          const data: Message[] = await res.json();
          setMessages(data);
        }
      } catch (e) {
        console.warn("Kan berichten niet ophalen:", e);
      }
    },
    []
  );

  // Load messages whenever the active chat changes
  useEffect(() => {
    if (selectedChat !== null) {
      loadMessages(selectedChat);
    } else {
      setMessages([]);
    }
  }, [selectedChat, loadMessages]);

  const sendMessage = async () => {
    if (!message.trim() || selectedChat === null) return;
    const text = message.trim();
    setMessage("");
    try {
      const res = await fetch(DB_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resource: "messages",
          action: "send",
          staff_id: selectedChat,
          text,
          sender: "client",
          from_name: currentUserName,
        }),
      });
      if (res.ok) {
        await loadMessages(selectedChat);
      }
    } catch (e) {
      console.warn("Kan bericht niet verzenden:", e);
      setMessage(text); // restore on failure so the user can retry
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      await fetch(DB_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resource: "messages", action: "delete", id }),
      });
      if (selectedChat !== null) {
        await loadMessages(selectedChat);
      }
    } catch (e) {
      console.warn("Kan bericht niet verwijderen:", e);
    }
  };

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

  return {
    selectedChat,
    message,
    setMessage,
    messages,
    sendMessage,
    deleteMessage,
    showNewChatSheet,
    searchQuery,
    setSearchQuery,
    showUnavailableAlert,
    setShowUnavailableAlert,
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
  };
}