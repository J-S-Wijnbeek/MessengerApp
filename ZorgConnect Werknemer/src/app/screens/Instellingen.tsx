import { useState } from "react";
import { useNavigate } from "react-router";
import { TealHeader } from "../components/TealHeader";
import { StaffBottomNav } from "../components/StaffBottomNav";
import { SectionBar } from "../components/SectionBar";
import { mockLinkedClientsDetailed, mockUnlinkedClients } from "../data/mockData";
import { Shield, X, AlertTriangle, Search } from "lucide-react";

export default function Instellingen() {
  const navigate = useNavigate();
  const [isOnDuty, setIsOnDuty] = useState(true);
  const [status, setStatus] = useState<"beschikbaar" | "achterwacht" | "niet-beschikbaar">(
    "beschikbaar"
  );
  const [receiveEmergencyCalls, setReceiveEmergencyCalls] = useState(true);
  const [showSOSAlert, setShowSOSAlert] = useState(false);
  const [linkedClients, setLinkedClients] = useState(mockLinkedClientsDetailed);
  const [showLinkSheet, setShowLinkSheet] = useState(false);
  const [showUnlinkConfirm, setShowUnlinkConfirm] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const maxClients = 10;
  const linkedClientsCount = linkedClients.length;
  const isAtCapacity = linkedClientsCount >= maxClients;
  const isNearCapacity = linkedClientsCount >= 9;

  const filteredUnlinkedClients = mockUnlinkedClients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUnlinkClient = (clientId: number) => {
    setLinkedClients(linkedClients.filter((c) => c.id !== clientId));
    setShowUnlinkConfirm(null);
  };

  const handleLinkClient = (newClient: typeof mockUnlinkedClients[0]) => {
    if (!isAtCapacity) {
      setLinkedClients([
        ...linkedClients,
        {
          ...newClient,
          lastContact: "Nooit",
          hasActiveSOS: false,
        },
      ]);
      setShowLinkSheet(false);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  if (showSOSAlert) {
    return (
      <div className="min-h-screen bg-white pb-20 max-w-[390px] mx-auto">
        <TealHeader title="Instellingen" />

        {/* SOS Alert Banner */}
        <div className="bg-[#D9534F] text-white px-4 py-3 flex items-center gap-3 animate-pulse">
          <AlertTriangle size={24} />
          <div className="flex-1 font-bold">🚨 NOODOPROEP — Peter Hendriks</div>
        </div>

        {/* Client Emergency Card */}
        <div className="p-4">
          <div className="border-2 border-[#D9534F] rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-xl font-medium">P</span>
              </div>
              <div>
                <div className="font-bold text-lg">Peter Hendriks</div>
                <div className="text-sm text-gray-600">Cliënt sinds 2024</div>
              </div>
            </div>

            <div className="text-sm text-gray-700 mb-3">
              📍 Hoofdstraat 123, 1234 AB Amsterdam
            </div>

            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <div className="text-center text-gray-600 mb-2">Route naar cliënt</div>
              <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500">🗺️ Kaart</span>
              </div>
              <div className="text-center font-bold text-gray-900 mt-2">
                2.3km / ~6 min
              </div>
            </div>

            <button className="w-full bg-green-500 text-white py-3 rounded-lg font-bold mb-3 hover:bg-green-600 transition-colors">
              ✓ Ik ga erheen
            </button>

            <button className="w-full border-2 border-[#1DC6B4] text-[#1DC6B4] py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Stuur door naar collega
            </button>
          </div>

          <button
            onClick={() => setShowSOSAlert(false)}
            className="w-full text-gray-500 text-sm py-2"
          >
            Sluiten
          </button>
        </div>

        <StaffBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20 max-w-[390px] mx-auto relative">
      <TealHeader title="Instellingen" />

      {/* Profile Section */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-xl font-medium">S</span>
        </div>
        <div className="flex-1">
          <div className="font-bold text-lg">Sophie van der Berg</div>
          <div className="text-sm text-gray-600">Begeleider</div>
        </div>
        <button className="text-[#F5A623] text-sm font-medium hover:underline">
          Bewerk
        </button>
      </div>

      {/* Availability Section */}
      <SectionBar title="Beschikbaarheid" />
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <span className="font-medium text-gray-900">In dienst</span>
          <button
            onClick={() => setIsOnDuty(!isOnDuty)}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              isOnDuty ? "bg-[#1DC6B4]" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                isOnDuty ? "right-1" : "left-1"
              }`}
            />
          </button>
        </div>

        {isOnDuty && (
          <div className="flex gap-2">
            <button
              onClick={() => setStatus("beschikbaar")}
              className={`flex-1 py-2 px-3 rounded-full text-sm font-medium transition-colors ${
                status === "beschikbaar"
                  ? "bg-[#1DC6B4] text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Beschikbaar
            </button>
            <button
              onClick={() => setStatus("achterwacht")}
              className={`flex-1 py-2 px-3 rounded-full text-sm font-medium transition-colors ${
                status === "achterwacht"
                  ? "bg-[#F5A623] text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Achterwacht
            </button>
            <button
              onClick={() => setStatus("niet-beschikbaar")}
              className={`flex-1 py-2 px-3 rounded-full text-sm font-medium transition-colors ${
                status === "niet-beschikbaar"
                  ? "bg-gray-400 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Niet beschikbaar
            </button>
          </div>
        )}
      </div>

      {/* Clients Section */}
      <SectionBar title="Gekoppelde Cliënten" />
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {linkedClientsCount} van {maxClients} cliënten gekoppeld
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all ${
                isAtCapacity
                  ? "bg-[#D9534F]"
                  : isNearCapacity
                  ? "bg-[#F5A623]"
                  : "bg-[#1DC6B4]"
              }`}
              style={{ width: `${(linkedClientsCount / maxClients) * 100}%` }}
            />
          </div>
          {isAtCapacity && (
            <div className="text-xs text-[#D9534F] font-medium mt-1">Maximum bereikt</div>
          )}
          {isNearCapacity && !isAtCapacity && (
            <div className="text-xs text-[#F5A623] font-medium mt-1">Bijna vol</div>
          )}
        </div>

        {/* Linked Clients List */}
        <div className="space-y-2 mb-4">
          {linkedClients.map((client) => (
            <div key={client.id} className="flex items-center gap-3 py-2 border-b border-gray-50">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-gray-500 font-medium">{client.initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900">{client.name}</div>
                <div className="text-xs text-gray-500">{client.address}</div>
              </div>
              <button
                onClick={() => setShowUnlinkConfirm(client.id)}
                className="px-3 py-1 border-2 border-[#D9534F] text-[#D9534F] text-sm rounded-lg hover:bg-red-50 flex items-center gap-1"
              >
                <X size={14} />
                Ontkoppel
              </button>
            </div>
          ))}
        </div>

        <button
          disabled={isAtCapacity}
          onClick={() => !isAtCapacity && setShowLinkSheet(true)}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            isAtCapacity
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-[#F5A623] text-white hover:bg-[#E69510]"
          }`}
        >
          {isAtCapacity ? "Maximum bereikt" : "+ Koppel nieuwe cliënt"}
        </button>
      </div>

      {/* Emergency Button Section */}
      <SectionBar title="Noodknop" />
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="border-2 border-[#D9534F] rounded-lg p-4">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={32} className="text-[#D9534F]" />
            <div className="flex-1">
              <div className="font-bold text-gray-900">Noodoproepen ontvangen</div>
              <div className="text-sm text-gray-600">
                Ontvang directe meldingen bij noodgevallen
              </div>
            </div>
            <button
              onClick={() => setReceiveEmergencyCalls(!receiveEmergencyCalls)}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                receiveEmergencyCalls ? "bg-[#D9534F]" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  receiveEmergencyCalls ? "right-1" : "left-1"
                }`}
              />
            </button>
          </div>

          {receiveEmergencyCalls && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bereikbaarheidsnummer
              </label>
              <input
                type="tel"
                placeholder="+31 6 12345678"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9534F]"
              />
            </div>
          )}
        </div>

        {/* Demo SOS Alert Button */}
        <button
          onClick={() => setShowSOSAlert(true)}
          className="w-full mt-4 bg-gray-100 text-gray-600 py-2 rounded text-sm hover:bg-gray-200 transition-colors"
        >
          Demo: SOS Noodoproep tonen
        </button>
      </div>

      {/* Logout */}
      <div className="px-4 py-8">
        <button
          onClick={handleLogout}
          className="text-[#D9534F] font-medium hover:underline"
        >
          Uitloggen
        </button>
      </div>

      {/* Link Client Bottom Sheet */}
      {showLinkSheet && (
        <>
          <div
            onClick={() => setShowLinkSheet(false)}
            className="fixed inset-0 bg-black bg-opacity-30 z-20"
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-30 max-w-[390px] mx-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="font-bold text-lg">Koppel nieuwe cliënt</h2>
              <button
                onClick={() => setShowLinkSheet(false)}
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
                  placeholder="Zoek cliënt..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1DC6B4]"
                />
              </div>
            </div>

            {/* Unlinked Clients List */}
            <div className="max-h-96 overflow-y-auto">
              {filteredUnlinkedClients.map((client) => (
                <div
                  key={client.id}
                  className="px-4 py-3 border-b border-gray-100 flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-lg font-medium">
                      {client.initials}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{client.name}</div>
                    <div className="text-sm text-gray-500">{client.address}</div>
                  </div>
                  <button
                    onClick={() => handleLinkClient(client)}
                    className="bg-[#F5A623] text-white px-4 py-1 rounded-lg text-sm font-medium hover:bg-[#E69510]"
                  >
                    Koppel
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Unlink Confirmation Dialog */}
      {showUnlinkConfirm && (
        <>
          <div
            onClick={() => setShowUnlinkConfirm(null)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 max-w-[340px] w-full mx-4">
            <div className="p-6">
              <h3 className="font-bold text-lg mb-2">Cliënt ontkoppelen?</h3>
              <p className="text-gray-600 text-sm mb-6">
                Weet je zeker dat je deze cliënt wilt ontkoppelen? Deze actie kan niet ongedaan worden gemaakt.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowUnlinkConfirm(null)}
                  className="flex-1 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  Annuleren
                </button>
                <button
                  onClick={() => handleUnlinkClient(showUnlinkConfirm)}
                  className="flex-1 py-2 bg-[#D9534F] text-white rounded-lg font-medium hover:bg-[#C9463F]"
                >
                  Ontkoppel
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <StaffBottomNav />
    </div>
  );
}