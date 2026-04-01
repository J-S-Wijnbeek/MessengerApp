import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { TealHeader } from "../../components/TealHeader";
import { ClientBottomNav } from "../../components/ClientBottomNav";
import { FAB } from "../../components/FAB";
import { mockClients, mockCoupledCareWorkers } from "../../data/mockData";
import { Send, ArrowLeft, X, Plus, Search, AlertCircle, Check } from "lucide-react";
import { useLocation } from "react-router";

const initialMockMessages = [
  { id: 1, message: "Hallo, hoe gaat het met je?", senderType: "staff", timestamp: "14:20", chatId: "1", read: true },
  { id: 2, message: "Het gaat goed, dank je!", senderType: "client", timestamp: "14:25", chatId: "1", read: false },
  { id: 3, message: "Fijn om te horen. Heb je nog vragen?", senderType: "staff", timestamp: "14:28", chatId: "1", read: true },
  { id: 4, message: "Dank je wel voor het gesprek vandaag", senderType: "client", timestamp: "14:30", chatId: "1", read: false },
];

export default function Berichten() {
  const location = useLocation();
  const initialChatId = location.state?.chatId || null;
  const socketRef = useRef<any>(null);
  const selectedChatRef = useRef<number | null>(initialChatId);

  const [selectedChat, setSelectedChat] = useState<number | null>(initialChatId);
  const currentChatId = selectedChat ? selectedChat.toString() : "";
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(initialMockMessages);
  const [showNewChatSheet, setShowNewChatSheet] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUnavailableAlert, setShowUnavailableAlert] = useState(true); // Demo: show on first load
  const [triggerWarning, setTriggerWarning] = useState<string | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const localTriggerWords = ["help", "emergency", "urgent", "suicide", "panic", "abuse", "danger", "angst", "stress"];


  const filteredCareWorkers = mockCoupledCareWorkers.filter((worker) =>
    worker.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    const socket = io("http://localhost:3001");
    socketRef.current = socket;

    const handleHistory = ({ chatId, history }: any) => {
      if (chatId !== currentChatId) return;
      setMessages(history);
    };

    const handleIncoming = (msg: any) => {
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

  const activeMessages = messages.filter((msg) => msg.chatId === currentChatId);

  const handleSend = () => {
    if (!message.trim() || selectedChat === null) return;

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
      const warningText = `Trigger word gedetecteerd: ${localMatches.join(", ")} in bericht "${msg.message}"`;
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

  const selectedStaffMember = selectedChat
    ? mockCoupledCareWorkers.find((worker) => worker.id === selectedChat) ?? null
    : null;
  const isStaffUnavailable = selectedStaffMember
    ? selectedStaffMember.status !== "beschikbaar"
    : false;
  const statusText = selectedStaffMember?.status === "achterwacht"
    ? "Deze medewerker reageert mogelijk later."
    : "Je bericht wordt later gelezen.";

  const openChat = (workerId: number) => {
    setSelectedChat(workerId);
    setShowUnavailableAlert(true);
  };

  const closeChat = () => {
    setSelectedChat(null);
  };

  const openNewChatSheet = () => setShowNewChatSheet(true);
  const closeNewChatSheet = () => setShowNewChatSheet(false);
  const startChat = (workerId: number) => {
    setSelectedChat(workerId);
    setShowNewChatSheet(false);
    setShowUnavailableAlert(true);
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

  if (selectedChat) {
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
          <h1 className="font-bold text-lg">{selectedStaffMember?.name || "Chat"}</h1>
        </div>

        {/* Unavailable Alert */}
        {isStaffUnavailable && showUnavailableAlert && (
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
          {activeMessages.map((msg) => (
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
                  <span className={msg.senderType === "client" ? "text-primary-foreground/80" : "text-muted-foreground"}>
                    {msg.timestamp}
                  </span>
                  {msg.senderType === "client" && (
                    <span className="flex items-center gap-1 text-primary-foreground/60">
                      <Check size={12} />
                      {msg.read ? "Gelezen" : "Verstuurd"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="border-t border-border p-4 bg-background">
          {/* Suggestions */}
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

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Typ een bericht..."
              className="flex-1 px-4 py-2 border border-border bg-background rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
            onClick={handleSend}
            disabled={!message.trim()}
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

      {/* Chat List */}
      <div>
        {mockCoupledCareWorkers.map((worker, index) => {
          const statusColors = ["bg-green-500", "bg-green-500", "bg-primary"];
          const statusColor = statusColors[index] || "bg-gray-400";
          const preview = getChatPreview(worker.id);

          return (
            <div
              key={worker.id}
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
                <div className="text-sm text-muted-foreground truncate">
                  {preview.text || "Nog geen berichten"}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <div className="text-xs text-muted-foreground">{preview.time || ""}</div>
                {index === 0 && (
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

            {/* Search Field */}
            <div className="p-4">
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
          </div>
        </>
      )}

      <ClientBottomNav />
    </div>
  );
}