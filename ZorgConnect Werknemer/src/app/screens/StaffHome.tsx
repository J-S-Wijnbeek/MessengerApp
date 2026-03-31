import { useNavigate } from "react-router";
import { TealHeader } from "../components/TealHeader";
import { StaffBottomNav } from "../components/StaffBottomNav";
import { SectionBar } from "../components/SectionBar";
import { MessageCircle, Phone } from "lucide-react";
import { mockLinkedClientsDetailed, mockSOSAlerts, mockSchedule } from "../data/mockData";

export default function StaffHome() {
  const navigate = useNavigate();

  const staffName = "Sophie van der Berg";
  
  // Get current shift from mockSchedule
  const currentShift = mockSchedule.find((shift) => shift.date === "Vandaag");
  const currentShiftTime = currentShift ? `${currentShift.startTime} — ${currentShift.endTime}` : "Geen dienst";
  
  // Determine status automatically from shift schedule
  const status: "beschikbaar" | "achterwacht" | "niet-beschikbaar" = currentShift
    ? currentShift.isAchterwacht
      ? "achterwacht"
      : "beschikbaar"
    : "niet-beschikbaar";

  const isAchterwacht = status === "achterwacht";

  return (
    <div className="min-h-screen bg-white pb-20 max-w-[390px] mx-auto">
      <TealHeader title="TeamTelefoon" subtitle={`Goedemiddag, ${staffName.split(" ")[0]}`} />

      {/* Status Card */}
      <div className="px-4 py-4">
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Huidige status</div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              status === "beschikbaar"
                ? "bg-green-500 text-white"
                : status === "achterwacht"
                ? "bg-[#F5A623] text-white"
                : "bg-gray-500 text-white"
            }`}>
              {status === "beschikbaar" ? "Beschikbaar" : status === "achterwacht" ? "Achterwacht" : "Niet beschikbaar"}
            </div>
          </div>
        </div>
      </div>

      {/* SOS Alerts (only shown if active) */}
      {mockSOSAlerts.length > 0 && (
        <>
          <div className="bg-[#D9534F] text-white text-center py-2 px-4 font-bold text-sm">
            Noodoproepen actief
          </div>
          {mockSOSAlerts.map((alert) => (
            <div
              key={alert.id}
              className="px-4 py-3 border-b border-gray-100 bg-red-50 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-bold text-gray-900 mb-1">{alert.clientName}</div>
                  <div className="text-sm text-gray-600">{alert.timestamp}</div>
                  <div className="text-xs text-gray-500 mt-1">{alert.duration}</div>
                </div>
                <button className="bg-[#D9534F] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#C9463F]">
                  Bekijk
                </button>
              </div>
            </div>
          ))}
        </>
      )}

      {/* My Clients */}
      <SectionBar title="Mijn Cliënten" />
      {mockLinkedClientsDetailed.map((client) => (
        <div key={client.id} className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 font-medium">{client.initials}</span>
            </div>
            <div className="flex-1">
              <div className="font-bold text-gray-900 flex items-center gap-2">
                {client.name}
                {client.hasActiveSOS && (
                  <span className="bg-[#D9534F] text-white text-xs px-2 py-0.5 rounded-full">
                    SOS
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Laatste contact: {client.lastContact}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-[#1DC6B4] hover:bg-gray-100 rounded-full">
                <MessageCircle size={20} />
              </button>
              <button className="p-2 text-[#1DC6B4] hover:bg-gray-100 rounded-full">
                <Phone size={20} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* My Shift */}
      <SectionBar title="Mijn Dienst" />
      <div className="px-4 py-4">
        <div className="text-3xl font-bold text-gray-900 mb-2">{currentShiftTime}</div>
        <div className="text-sm text-gray-600">Vandaag</div>
        {isAchterwacht && (
          <div className="mt-2 inline-block bg-[#F5A623] text-white px-3 py-1 rounded-full text-xs font-medium">
            Achterwacht
          </div>
        )}
      </div>

      <StaffBottomNav />
    </div>
  );
}