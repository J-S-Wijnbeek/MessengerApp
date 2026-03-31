import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Send, Info, Check } from "lucide-react";
import { io } from "socket.io-client";
import { mockLinkedClientsDetailed, mockChatMessages } from "../data/mockData";

export default function ChatDetail() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef<any>(null);
  const [message, setMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [messages, setMessages] = useState(
    () => mockChatMessages[Number(clientId) || 0] || []
  );
  const [triggerWarning, setTriggerWarning] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const client = mockLinkedClientsDetailed.find(
    (c) => c.id === Number(clientId)
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!clientId) return;

    const socket = io("http://localhost:3001");
    socketRef.current = socket;

    const handleHistory = ({ chatId, history }: any) => {
      if (chatId !== clientId) return;
      setMessages((prev) => (history.length > 0 ? history : prev));
    };

    const handleIncoming = (msg: any) => {
      if (msg.chatId !== clientId) return;
      setMessages((prev) =>
        prev.some((existing) => existing.id === msg.id) ? prev : [...prev, msg]
      );
    };

    const handleConnect = () => {
      console.log("Socket connected", socket.id, "for chat", clientId);
      setSocketConnected(true);
      socket.emit("join_chat", clientId);
      socket.emit("read_chat", { chatId: clientId, readerType: "staff" });
    };

    const handleDisconnect = (reason: any) => {
      console.log("Socket disconnected", reason);
      setSocketConnected(false);
    };

    const handleError = (error: any) => {
      console.error("Socket.IO error:", error);
    };

    const handleTriggerWarning = ({ chatId, matches, message }: any) => {
      if (chatId !== clientId) return;
      const warningText = `Trigger warning for chat ${chatId}: ${matches.join(", ")} - ${message}`;
      console.error(warningText);
      setTriggerWarning(warningText);
      setTimeout(() => setTriggerWarning(null), 10000);
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
  }, [clientId]);

  if (!client) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center max-w-[390px] mx-auto">
        <div className="text-gray-500">Client niet gevonden</div>
      </div>
    );
  }

  const handleSend = () => {
    if (message.trim()) {
      const msg = {
        id: Date.now(),
        chatId: clientId || "unknown",
        senderId: 0,
        senderType: "staff" as const,
        message: message.trim(),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        read: false,
      };
      setMessages((prev) => [...prev, msg]);
      socketRef.current?.emit("chat_message", msg);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[390px] mx-auto h-screen">
      {/* Header */}
      <div className="px-4 py-2 text-xs text-gray-100">
        Socket status: {socketConnected ? "connected" : "disconnected"}
      </div>
      {triggerWarning && (
        <div className="bg-red-100 border border-red-300 text-red-900 px-4 py-3">
          {triggerWarning}
        </div>
      )}
      <div className="bg-[#1DC6B4] px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/berichten")}
            className="text-white hover:opacity-80"
          >
            <ArrowLeft size={24} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/client-profiel/${client.id}`);
            }}
            className="flex items-center gap-3 hover:opacity-90"
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-medium text-sm">
                {client.initials}
              </span>
            </div>
            <div className="text-left">
              <div className="text-white font-medium">{client.name}</div>
              <div className="text-white/80 text-xs">Online</div>
            </div>
          </button>
        </div>
        <button
          onClick={() => navigate(`/client-profiel/${client.id}`)}
          className="text-white hover:opacity-80"
        >
          <Info size={22} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.senderType === "staff" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                msg.senderType === "staff"
                  ? "bg-[#1DC6B4] text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <div className="text-sm">{msg.message}</div>
              <div
                className={`text-xs mt-1 ${
                  msg.senderType === "staff"
                    ? "text-white/70"
                    : "text-gray-500"
                }`}
              >
                {msg.timestamp || (msg as any).time}
                {msg.senderType === "staff" && (
                  <div className="text-[10px] mt-1 flex items-center gap-1 text-white/60">
                    <Check size={12} />
                    {msg.read ? "Gelezen" : "Verstuurd"}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 px-4 py-3 bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Typ een bericht..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1DC6B4] text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="w-10 h-10 bg-[#1DC6B4] text-white rounded-full flex items-center justify-center hover:bg-[#1AB39F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
