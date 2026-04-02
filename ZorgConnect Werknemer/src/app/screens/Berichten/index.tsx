import { TealHeader } from "../../components/TealHeader";
import { StaffBottomNav } from "../../components/StaffBottomNav";
import { Search, MessageCircle, Plus, X, Users } from "lucide-react";
import { useBerichten } from "./hooks/useBerichten";
import { useGroupChatApprovals } from "./hooks/useGroupChatApprovals";

export default function Berichten() {
  const {
    searchQuery,
    setSearchQuery,
    showNewChat,
    openNewChat,
    closeNewChat,
    filteredConversations,
    filteredClients,
    navigateToChat,
    navigateToClientProfile,
  } = useBerichten();

  const { pendingForMe, approve } = useGroupChatApprovals();

  return (
    <div className="min-h-screen bg-white pb-20 max-w-[390px] mx-auto">
      <TealHeader title="Berichten" />

      {pendingForMe.length > 0 && (
        <div className="px-4 py-3 bg-amber-50 border-b border-amber-100">
          <div className="text-xs font-semibold text-amber-900 uppercase tracking-wide mb-2 flex items-center gap-1">
            <Users size={14} />
            Groepschat goedkeuren
          </div>
          <div className="space-y-2">
            {pendingForMe.map((gc) => (
              <div
                key={gc.id}
                className="flex items-start gap-2 p-3 bg-white rounded-xl border border-amber-100 shadow-sm"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm">{gc.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Cliënt vraagt een groepschat met {gc.memberIds.length} medewerkers. Keur het verzoek goed om de chat
                    vrij te geven.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => void approve(gc)}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-[#1DC6B4] text-white text-xs font-medium"
                >
                  Goedkeuren
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Zoek gesprekken..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1DC6B4] text-sm"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div>
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conv) => (
            <div
              key={conv.id}
              className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToClientProfile(conv.id);
                }}
                className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 hover:bg-gray-300 transition-colors"
              >
                <span className="text-gray-600 font-medium">{conv.initials}</span>
              </button>
              <button
                onClick={() => navigateToChat(conv.id)}
                className="flex-1 min-w-0 text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium text-gray-900">{conv.name}</div>
                  <div className="text-xs text-gray-500">{conv.timestamp}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 truncate">
                    {conv.lastMessage}
                  </div>
                  {conv.unread > 0 && (
                    <div className="ml-2 bg-[#F5A623] text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                      {conv.unread}
                    </div>
                  )}
                </div>
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <MessageCircle size={48} className="text-gray-300 mb-4" />
            <div className="text-gray-500 text-center">
              Geen gesprekken gevonden
            </div>
          </div>
        )}
      </div>

      {/* FAB - New Message */}
      <button
        onClick={openNewChat}
        className="fixed bottom-24 right-4 w-14 h-14 bg-[#F5A623] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#E09612] transition-colors z-10"
        style={{ maxWidth: "390px", right: "max(1rem, calc((100vw - 390px) / 2 + 1rem))" }}
      >
        <Plus size={24} />
      </button>

      {/* New Chat Overlay */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end max-w-[390px] mx-auto">
          <div className="bg-white w-full rounded-t-2xl max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Nieuw bericht</h3>
              <button
                onClick={closeNewChat}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Search */}
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Zoek client..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1DC6B4] text-sm"
                />
              </div>
            </div>

            {/* Client List */}
            <div className="flex-1 overflow-y-auto">
              {filteredClients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => navigateToChat(client.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 font-medium">
                      {client.initials}
                    </span>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900">{client.name}</div>
                    <div className="text-sm text-gray-500">
                      {client.primaryCareWorker}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <StaffBottomNav />
    </div>
  );
}
