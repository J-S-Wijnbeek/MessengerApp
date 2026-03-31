import { useState } from "react";
import { useLocation } from "react-router";
import { mockCoupledCareWorkers } from "../../../data/mockData";

export function useBerichten() {
  const location = useLocation();
  const initialChatId = location.state?.chatId || null;

  const [selectedChat, setSelectedChat] = useState<number | null>(initialChatId);
  const [message, setMessage] = useState("");
  const [showNewChatSheet, setShowNewChatSheet] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUnavailableAlert, setShowUnavailableAlert] = useState(true);

  const mockMessages = [
    { id: 1, text: "Hallo, hoe gaat het met je?", sender: "staff", time: "14:20" },
    { id: 2, text: "Het gaat goed, dank je!", sender: "client", time: "14:25" },
    { id: 3, text: "Fijn om te horen. Heb je nog vragen?", sender: "staff", time: "14:28" },
    { id: 4, text: "Dank je wel voor het gesprek vandaag", sender: "client", time: "14:30" },
  ];

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
  };
}
