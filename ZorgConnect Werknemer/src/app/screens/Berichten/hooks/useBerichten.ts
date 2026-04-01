import { useState } from "react";
import { useNavigate } from "react-router";
import { mockLinkedClientsDetailed } from "../../../data/mockData";

export function useBerichten() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const navigate = useNavigate();

  const conversations = mockLinkedClientsDetailed.map((client) => ({
    id: client.id,
    name: client.name,
    initials: client.initials,
    lastMessage: "Nog geen berichten",
    timestamp: "",
    unread: 0,
  }));

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredClients = mockLinkedClientsDetailed.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openNewChat = () => setShowNewChat(true);
  const closeNewChat = () => setShowNewChat(false);

  const navigateToChat = (id: number) => {
    setShowNewChat(false);
    navigate(`/chat/${id}`);
  };

  const navigateToClientProfile = (id: number) => {
    navigate(`/client-profiel/${id}`);
  };

  return {
    searchQuery,
    setSearchQuery,
    showNewChat,
    openNewChat,
    closeNewChat,
    filteredConversations,
    filteredClients,
    navigateToChat,
    navigateToClientProfile,
  };
}
