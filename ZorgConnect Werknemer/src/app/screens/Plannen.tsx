import { useState } from "react";
import { TealHeader } from "../components/TealHeader";
import { StaffBottomNav } from "../components/StaffBottomNav";
import { SectionBar } from "../components/SectionBar";
import { PillToggle } from "../components/PillToggle";
import { mockSchedule, mockStaff } from "../data/mockData";
import { X } from "lucide-react";

export default function Plannen() {
  const [view, setView] = useState<string>("Ik");
  const [selectedShift, setSelectedShift] = useState<number | null>(null);

  const currentStaffName = "Sophie van der Berg";

  return (
    <div className="min-h-screen bg-white pb-20 max-w-[390px] mx-auto relative">
      <TealHeader title="Planning" />

      {/* Toggle */}
      <div className="p-4 flex justify-center">
        <PillToggle options={["Ik", "Iedereen"]} value={view} onChange={setView} />
      </div>

      {view === "Ik" ? (
        <>
          {/* Today's Shift */}
          <SectionBar title="Vandaag" />
          <div
            onClick={() => setSelectedShift(mockSchedule[0].id)}
            className="px-8 py-6 border-b border-gray-100 cursor-pointer hover:bg-gray-50 active:bg-gray-100"
          >
            <div className="text-5xl font-bold text-gray-900 text-center mb-1">
              {mockSchedule[0].startTime} — {mockSchedule[0].endTime}
            </div>
            <div className="text-center text-gray-600">Reguliere dienst</div>
          </div>

          {/* Upcoming Shifts */}
          <SectionBar title="Later" />
          {mockSchedule.slice(1).map((shift) => (
            <div
              key={shift.id}
              onClick={() => setSelectedShift(shift.id)}
              className="px-4 py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 active:bg-gray-100"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-gray-900">{shift.date}</div>
                {shift.isAchterwacht && (
                  <span className="px-3 py-1 bg-[#F5A623] text-white text-xs rounded-full">
                    Achterwacht
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {shift.startTime} — {shift.endTime}
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          {/* All Team Members Schedule */}
          <SectionBar title="Vandaag" />
          {mockStaff.map((staff) => (
            <div
              key={staff.id}
              onClick={() => setSelectedShift(staff.id)}
              className="px-4 py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 active:bg-gray-100"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 font-medium">
                    {staff.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{staff.name}</div>
                  <div className="text-sm text-gray-500">{staff.role}</div>
                </div>
              </div>
              <div className="text-xl font-bold text-gray-900">
                15:00 — 23:00
              </div>
            </div>
          ))}
        </>
      )}

      {/* Shift Detail Sheet */}
      {selectedShift && (
        <>
          <div
            onClick={() => setSelectedShift(null)}
            className="fixed inset-0 bg-black bg-opacity-30 z-20"
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-30 max-w-[390px] mx-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="font-bold text-lg">Dienst details</h2>
              <button
                onClick={() => setSelectedShift(null)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-1">Datum</div>
                <div className="font-medium text-gray-900">Vandaag, 30 Maart 2026</div>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-1">Tijd</div>
                <div className="font-medium text-gray-900">15:00 — 23:00</div>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-1">Type</div>
                <div className="font-medium text-gray-900">Reguliere dienst</div>
              </div>

              <div className="flex gap-3 mt-6">
                <button className="flex-1 bg-[#1DC6B4] text-white py-3 rounded-lg font-medium hover:bg-[#18B5A3]">
                  Bewerken
                </button>
                <button className="flex-1 border-2 border-[#D9534F] text-[#D9534F] py-3 rounded-lg font-medium hover:bg-red-50">
                  Verwijderen
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
