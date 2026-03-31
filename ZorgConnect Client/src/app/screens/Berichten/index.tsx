import * as React from "react";
import { TealHeader } from "../../components/TealHeader";
import { ClientBottomNav } from "../../components/ClientBottomNav";
import { mockCoupledCareWorkers } from "../../data/mockData";
import { Send, ArrowLeft, X, Plus, Search, AlertCircle } from "lucide-react";
import { useBerichten } from "./hooks/useBerichten";

const formatTime = (sent_at: string) =>
  new Date(sent_at).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });

export default function Berichten() {
  const {
    selectedChat,
    message,
    setMessage,
    messages,
    sendMessage,
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
  } = useBerichten();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  if (selectedChat) {
    const chatSuggestions = [
      "Hoi, heb je even tijd om te bellen?",
      "Ik voel mij niet goed.",
      "Zou je me kunnen helpen met iets?",
    ];

    return (
      <div className="min-h-screen bg-white flex flex-col pb-20 w-full mx-auto">
        <div className="bg-[#F5A623] text-white text-center py-4 px-4 flex items-center justify-center relative">
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
          <div className="bg-[#F0FFFE] border-b border-[#1DC6B4] p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-[#1DC6B4] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-medium text-gray-900 mb-1">
                  {statusText}
                </div>
                <div className="text-sm text-gray-700 mb-3">
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
                      className="w-full flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                        {staff.name.charAt(0)}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                        <div className="text-xs text-gray-500">{staff.role}</div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setShowUnavailableAlert(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              Nog geen berichten. Stuur een bericht om te beginnen.
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "client" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    msg.sender === "client"
                      ? "bg-[#F5A623] text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  <div>{msg.text}</div>
                  <div
                    className={`text-xs mt-1 ${
                      msg.sender === "client" ? "text-white/80" : "text-gray-500"
                    }`}
                  >
                    {formatTime(msg.sent_at)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Bar */}
        <div className="border-t border-gray-200 p-4 bg-white">
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
                  className="shrink-0 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors"
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
              onKeyDown={handleKeyDown}
              placeholder="Typ een bericht..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F5A623]"
            />
            <button
              onClick={sendMessage}
              className="w-10 h-10 bg-[#1DC6B4] text-white rounded-full flex items-center justify-center hover:bg-[#18B5A3] transition-colors"
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
    <div className="min-h-screen bg-white pb-20 w-full mx-auto relative">
      <TealHeader title="Berichten" />

      {/* Chat List */}
      <div>
        {mockCoupledCareWorkers.map((worker, index) => {
          const statusColors = ["bg-green-500", "bg-green-500", "bg-[#F5A623]"];
          const statusColor = statusColors[index] || "bg-gray-400";

          return (
            <div
              key={worker.id}
              onClick={() => openChat(worker.id)}
              className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 active:bg-gray-50 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 relative">
                <span className="text-gray-500 text-lg font-medium">
                  {worker.name.charAt(0)}
                </span>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <div className={`w-3 h-3 rounded-full ${statusColor}`} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-[#1DC6B4]">{worker.name}</div>
                <div className="text-sm text-gray-500 truncate">
                  {index === 0 ? "Hallo, hoe gaat het?" : index === 1 ? "Bedankt voor het gesprek!" : "Tot morgen!"}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <div className="text-xs text-gray-500">{index === 0 ? "14:30" : index === 1 ? "Gisteren" : "Maandag"}</div>
                {index === 0 && (
                  <div className="w-5 h-5 bg-[#1DC6B4] text-white text-xs rounded-full flex items-center justify-center">
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
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#F5A623] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#E69510] transition-colors z-10"
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
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-30 w-full mx-auto animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="font-bold text-lg">Nieuw bericht</h2>
              <button
                onClick={closeNewChatSheet}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {/* Search Field */}
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Zoek zorgmedewerker..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1DC6B4]"
                />
              </div>
            </div>

            {/* Care Workers List */}
            <div className="max-h-96 overflow-y-auto">
              {filteredCareWorkers.map((worker) => (
                <div
                  key={worker.id}
                  className="px-4 py-3 border-b border-gray-100 flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-lg font-medium">
                      {worker.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{worker.name}</div>
                    <div className="text-sm text-gray-500">{worker.role}</div>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      worker.status === "beschikbaar"
                        ? "bg-green-500"
                        : worker.status === "achterwacht"
                        ? "bg-[#F5A623]"
                        : "bg-gray-400"
                    }`}
                  />
                  <button
                    onClick={() => startChat(worker.id)}
                    className="bg-[#1DC6B4] text-white px-4 py-1 rounded-lg text-sm font-medium hover:bg-[#18B5A3]"
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