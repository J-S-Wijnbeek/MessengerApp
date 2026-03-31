import { TealHeader } from "../../components/TealHeader";
import { StaffBottomNav } from "../../components/StaffBottomNav";
import { SectionBar } from "../../components/SectionBar";
import { PillToggle } from "../../components/PillToggle";
import { FAB } from "../../components/FAB";
import { Search, Phone, Play, CheckSquare, Shield, CheckCircle, Clock } from "lucide-react";
import { useGesprekken } from "./hooks/useGesprekken";

export default function Gesprekken() {
  const { view, setView, filteredCalls, sosHistory } = useGesprekken();

  return (
    <div className="min-h-screen bg-white pb-20 max-w-[390px] mx-auto">
      <TealHeader
        title="Gesprekken"
        rightIcon={<Search size={20} className="text-white" />}
      />

      {/* Toggle */}
      <div className="p-4 flex justify-center">
        <PillToggle
          options={["Alles", "Gemist"]}
          value={view}
          onChange={setView}
        />
      </div>

      {/* SOS Section */}
      {view === "Alles" && (
        <>
          <div className="bg-[#D9534F] text-white text-center py-2 px-4 font-bold text-sm">
            Noodoproepen
          </div>
          {sosHistory.length > 0 ? (
            sosHistory.map((sos) => (
              <div
                key={sos.id}
                className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 bg-red-50"
              >
                <Shield size={20} className="text-[#D9534F] flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-bold text-[#F5A623]">{sos.clientInitials}</div>
                  <div className="text-xs text-gray-500 mt-1">{sos.timestamp}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Opgepakt door: {sos.handledByInitials}
                  </div>
                </div>
                {sos.status === "resolved" ? (
                  <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                ) : (
                  <Clock size={20} className="text-[#F5A623] flex-shrink-0" />
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500 text-sm">
              Geen noodoproepen geregistreerd
            </div>
          )}
        </>
      )}

      {/* Today's Calls */}
      <SectionBar title="Vandaag" />
      {view === "Alles" && (
        <div className="px-4 py-2 text-xs text-gray-500">
          Alleen jouw eigen gesprekken
        </div>
      )}
      {filteredCalls.map((call) => (
        <div
          key={call.id}
          className={`flex items-center gap-3 px-4 py-3 border-b border-gray-100 ${
            view === "Gemist" && call.type === "gemist" ? "bg-[#FFF4E0]" : ""
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <span className="text-gray-500 text-sm font-medium">
              {call.clientName.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-[#F5A623]">{call.clientName}</div>
            <div className="flex items-center gap-2 mt-1">
              <Phone
                size={14}
                className={
                  call.type === "beantwoord" ? "text-green-500" : "text-[#F5A623]"
                }
              />
              <span className="text-xs text-gray-500">{call.timestamp}</span>
            </div>
            <div
              className={`text-xs mt-1 ${
                call.status === "Nog af te handelen"
                  ? "text-[#D9534F] font-medium"
                  : "text-gray-500"
              }`}
            >
              {call.status}
            </div>
            {view === "Gemist" && call.type === "gemist" && (
              <div className="text-xs text-gray-500 mt-1">Gekoppeld aan jou</div>
            )}
          </div>
          {call.type === "gemist" && (
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Play size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <CheckSquare size={20} className="text-gray-400" />
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Empty State for Gemist */}
      {view === "Gemist" && filteredCalls.length === 1 && (
        <div className="text-center py-12 text-gray-500">
          {filteredCalls.length} gemiste oproep gevonden
        </div>
      )}

      <FAB />
      <StaffBottomNav />
    </div>
  );
}
