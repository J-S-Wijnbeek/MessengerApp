import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { mockLinkedClientsDetailed, mockChatMessages } from "../../../data/mockData";

export function useChatDetail() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const client = mockLinkedClientsDetailed.find(
    (c) => c.id === Number(clientId)
  );
  const messages = mockChatMessages[Number(clientId) || 0] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  const handleSend = () => {
    if (message.trim()) {
      setMessage("");
    }
  };

  const goBack = () => navigate("/berichten");
  const goToClientProfile = () => navigate(`/client-profiel/${client?.id}`);

  return {
    client,
    messages,
    message,
    setMessage,
    messagesEndRef,
    handleSend,
    goBack,
    goToClientProfile,
  };
}
