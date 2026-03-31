import { TealHeader } from "../../components/TealHeader";
import { ClientBottomNav } from "../../components/ClientBottomNav";
import { SectionBar } from "../../components/SectionBar";
import { mockCoupledCareWorkers } from "../../data/mockData";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ListRow, StatusType } from "../../components/ListRow";
import { useClientHome } from "./hooks/useClientHome";

export default function ClientHome() {
  const {
    showOtherStaff,
    setShowOtherStaff,
    fastestCareWorker,
    beschikbaarCoupled,
    achterwachtCoupled,
    nietBeschikbaarCoupled,
    beschikbaarOther,
    achterwachtOther,
    nietBeschikbaarOther,
    navigateToChat,
  } = useClientHome();

  return (
    <div className="min-h-screen bg-white pb-20 w-full mx-auto">
      <TealHeader title="ZorgConnect" />

      {/* Nearest Staff Highlight Card */}
      <div className="p-4">
        <div className="border-2 border-[#F5A623] rounded-lg p-4 bg-[#FFF4E0]">
          <div className="text-sm text-gray-600 mb-2">Snelst bereikbaar</div>
          <div className="font-bold text-lg mb-1">{fastestCareWorker.name}</div>
          <div className="text-sm text-gray-600 mb-3">{fastestCareWorker.role}</div>
          <button
            onClick={() => navigateToChat(fastestCareWorker.id)}
            className="bg-[#1DC6B4] text-white py-3 px-6 rounded-full font-medium hover:bg-[#18B5A3] transition-colors"
          >
            Neem contact op
          </button>
        </div>
      </div>

      {/* Mijn zorgteam Section */}
      <div className="px-4 mb-4">
        <div className="font-bold text-gray-900 mb-3">Mijn zorgteam</div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {mockCoupledCareWorkers.map((worker) => (
            <div
              key={worker.id}
              className="flex-shrink-0 w-20 flex flex-col items-center"
            >
              <div className="relative mb-2">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-xl font-medium">
                    {worker.name.charAt(0)}
                  </span>
                </div>
                <div
                  className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                    worker.status === "beschikbaar"
                      ? "bg-green-500"
                      : worker.status === "achterwacht"
                      ? "bg-[#F5A623]"
                      : "bg-gray-400"
                  }`}
                />
              </div>
              <div className="text-xs text-center text-gray-700">
                {worker.name.split(" ")[0]}
              </div>
              <div className="text-xs text-center text-gray-500">{worker.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Availability Section - Coupled Workers */}
      {beschikbaarCoupled.length > 0 && (
        <>
          <SectionBar title="Beschikbaar" />
          {beschikbaarCoupled.map((staff) => (
            <ListRow
              key={staff.id}
              name={staff.name}
              subtitle={staff.role}
              status={staff.status as StatusType}
            />
          ))}
        </>
      )}

      {achterwachtCoupled.length > 0 && (
        <>
          <SectionBar title="Achterwacht" />
          {achterwachtCoupled.map((staff) => (
            <ListRow
              key={staff.id}
              name={staff.name}
              subtitle={staff.role}
              status={staff.status as StatusType}
              badge="Achterwacht"
            />
          ))}
        </>
      )}

      {nietBeschikbaarCoupled.length > 0 && (
        <>
          <SectionBar title="Niet beschikbaar" />
          {nietBeschikbaarCoupled.map((staff) => (
            <ListRow
              key={staff.id}
              name={staff.name}
              subtitle={staff.role}
              status={staff.status as StatusType}
            />
          ))}
        </>
      )}

      {/* Collapsible Other Staff */}
      <button
        onClick={() => setShowOtherStaff(!showOtherStaff)}
        className="w-full px-4 py-3 border-b border-gray-100 flex items-center justify-between text-gray-600 hover:bg-gray-50"
      >
        <span>Overige medewerkers</span>
        {showOtherStaff ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {showOtherStaff && (
        <>
          {beschikbaarOther.length > 0 &&
            beschikbaarOther.map((staff) => (
              <ListRow
                key={staff.id}
                name={staff.name}
                subtitle={staff.role}
                status={staff.status as StatusType}
              />
            ))}

          {achterwachtOther.length > 0 &&
            achterwachtOther.map((staff) => (
              <ListRow
                key={staff.id}
                name={staff.name}
                subtitle={staff.role}
                status={staff.status as StatusType}
                badge="Achterwacht"
              />
            ))}

          {nietBeschikbaarOther.length > 0 &&
            nietBeschikbaarOther.map((staff) => (
              <ListRow
                key={staff.id}
                name={staff.name}
                subtitle={staff.role}
                status={staff.status as StatusType}
              />
            ))}
        </>
      )}

      <ClientBottomNav />
    </div>
  );
}
