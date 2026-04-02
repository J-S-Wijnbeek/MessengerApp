
import { ArrowLeft, Send, Info, Check } from "lucide-react";
import { io } from "socket.io-client";
import { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { mockLinkedClientsDetailed } from "../../data/mockData";
import { useChatDetail } from "./hooks/useChatDetail";

// Socket URL constant (adjust if needed)
const SOCKET_URL = "http://localhost:3001";

// Remove pending urgent alert for a client from localStorage
function clearPendingUrgentAlert(clientId: string | number | undefined) {
  if (!clientId || typeof window === "undefined") return;
  const key = "pendingUrgentAlerts";
  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) return;
    const alerts = JSON.parse(stored);
    const filtered = Array.isArray(alerts)
      ? alerts.filter((item) => String(item.chatId) !== String(clientId))
      : [];
    window.localStorage.setItem(key, JSON.stringify(filtered));
  } catch {
    // ignore
  }
}


export default function ChatDetail() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef<any>(null);
  const [message, setMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [triggerWarning, setTriggerWarning] = useState<string | null>(null);
  const [urgentAlert, setUrgentAlert] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get navigation helpers from useChatDetail
  const { goBack, goToClientProfile } = useChatDetail();

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

    clearPendingUrgentAlert(clientId);

    let socket: any = null;

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
      socket.emit("join_staff");
    };

    const handleDisconnect = () => {
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

    const handleUrgentAlert = ({ chatId, matches, message }: any) => {
      const alertText = `Noodoproep voor chat ${chatId}: ${matches.join(", ")} – ${message}`;
      console.error(alertText);
      setUrgentAlert(alertText);
      setTimeout(() => setUrgentAlert(null), 10000);
    };

    const connectSocket = () => {
      socket = io(SOCKET_URL, {
        autoConnect: false,
        reconnection: false,
        timeout: 5000,
        transports: ["websocket", "polling"],
      });
      socketRef.current = socket;
      socket.open();

      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);
      socket.on("connect_error", handleError);
      socket.on("chat_history", handleHistory);
      socket.on("chat_message", handleIncoming);
      socket.on("trigger_warning", handleTriggerWarning);
      socket.on("urgent_alert", handleUrgentAlert);
    };

    connectSocket();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleError);
      socket.off("chat_history", handleHistory);
      socket.off("chat_message", handleIncoming);
      socket.off("trigger_warning", handleTriggerWarning);
      socket.off("urgent_alert", handleUrgentAlert);
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
      {urgentAlert && (
        <div className="bg-red-100 border border-red-300 text-red-900 px-4 py-3">
          {urgentAlert}
        </div>
      )}
      {triggerWarning && (
        <div className="bg-red-100 border border-red-300 text-red-900 px-4 py-3">
          {triggerWarning}
        </div>
      )}
      <div className="bg-[#1DC6B4] px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="text-white hover:opacity-80"
          >
            <ArrowLeft size={24} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToClientProfile();
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
          onClick={goToClientProfile}
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
