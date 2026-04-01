import { ArrowLeft, Send, Info } from "lucide-react";
import { useChatDetail } from "./hooks/useChatDetail";

export default function ChatDetail() {
  const {
    client,
    messages,
    message,
    setMessage,
    messagesEndRef,
    handleSend,
    goBack,
    goToClientProfile,
  } = useChatDetail();

  if (!client) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center max-w-[390px] mx-auto">
        <div className="text-gray-500">Client niet gevonden</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[390px] mx-auto h-screen">
      {/* Header */}
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
                {msg.timestamp}
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
