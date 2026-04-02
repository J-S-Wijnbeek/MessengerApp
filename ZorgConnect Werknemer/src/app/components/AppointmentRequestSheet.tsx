import { useState, useMemo } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { mockAvailability, mockStaff, mockCoupledCareWorkers, mockOtherStaff } from "../data/mockData";

interface AppointmentRequestSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: AppointmentRequest) => void;
}

export interface AppointmentRequest {
  date: string;
  timeOfDay: "ochtend" | "middag" | "avond" | "geen-voorkeur";
  notes: string;
  chosenWorker: string;
}

type StaffStatus = "beschikbaar" | "achterwacht" | "niet-beschikbaar" | "onbekend";

const getStaffStatus = (name: string): StaffStatus => {
  const allStaff = [...mockStaff, ...mockCoupledCareWorkers, ...mockOtherStaff];
  const staffMember = allStaff.find((s) => s.name === name);
  return (staffMember?.status as StaffStatus) || "onbekend";
};

const getStatusLabel = (status: StaffStatus) => {
  switch (status) {
    case "beschikbaar":
      return "Beschikbaar";
    case "achterwacht":
      return "Achterwacht";
    case "niet-beschikbaar":
      return "Niet beschikbaar";
    default:
      return "Onbekend";
  }
};

export function AppointmentRequestSheet({
  isOpen,
  onClose,
  onSubmit,
}: AppointmentRequestSheetProps) {
  const [timeOfDay, setTimeOfDay] = useState<"ochtend" | "middag" | "avond" | "geen-voorkeur">("geen-voorkeur");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [chosenWorker, setChosenWorker] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2)); // March 2026

  // Get availability status for a date
  const getDateAvailability = (dateStr: string) => {
    const availability = mockAvailability[dateStr];
    if (!availability) return "none";

    if (timeOfDay === "geen-voorkeur") {
      const total = availability.ochtend.available + availability.middag.available + availability.avond.available;
      if (total >= 5) return "high"; // Green
      if (total >= 1) return "limited"; // Orange
      return "none"; // Grey
    } else {
      const slotAvailability = availability[timeOfDay]?.available || 0;
      if (slotAvailability >= 3) return "high";
      if (slotAvailability >= 1) return "limited";
      return "none";
    }
  };

  // Generate calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Monday = 0
    const daysInMonth = lastDay.getDate();

    const days: Array<{
      date: number;
      dateStr: string;
      isCurrentMonth: boolean;
      isPast: boolean;
      availability: "high" | "limited" | "none";
    }> = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({
        date: 0,
        dateStr: "",
        isCurrentMonth: false,
        isPast: false,
        availability: "none",
      });
    }

    // Add days of the month
    const today = new Date(2026, 2, 30); // March 30, 2026
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isPast = currentDate < today;

      days.push({
        date: day,
        dateStr,
        isCurrentMonth: true,
        isPast,
        availability: isPast ? "none" : getDateAvailability(dateStr),
      });
    }

    return days;
  }, [currentMonth, timeOfDay]);

  const selectedDateAvailability = date ? mockAvailability[date] : null;

  // Collect available workers for the selected date and time
  const availableWorkers = useMemo(() => {
    if (!date || !selectedDateAvailability) return [];
    if (timeOfDay === "geen-voorkeur") {
      const ochtend = selectedDateAvailability.ochtend?.staff || [];
      const middag = selectedDateAvailability.middag?.staff || [];
      const avond = selectedDateAvailability.avond?.staff || [];
      return Array.from(new Set([...ochtend, ...middag, ...avond]));
    }
    return selectedDateAvailability[timeOfDay]?.staff || [];
  }, [date, timeOfDay, selectedDateAvailability]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!date) {
      alert("Selecteer een datum");
      return;
    }
    const availability = getDateAvailability(date);
    if (availability === "none") {
      alert("Deze datum heeft geen beschikbaarheid voor het gekozen dagdeel");
      return;
    }
    if (!chosenWorker) {
      alert("Selecteer een verzorger");
      return;
    }
    onSubmit({ date, timeOfDay, notes, chosenWorker });
    // Reset form
    setDate("");
    setChosenWorker("");
    setTimeOfDay("geen-voorkeur");
    setNotes("");
    onClose();
  };

  const monthNames = [
    "Januari", "Februari", "Maart", "April", "Mei", "Juni",
    "Juli", "Augustus", "September", "Oktober", "November", "December"
  ];

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-w-[390px] mx-auto animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Afspraak aanvragen</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Time of Day Selection - First */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dagdeel voorkeur
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setTimeOfDay("ochtend");
                  setDate(""); // Reset date when changing time preference
                  setChosenWorker("");
                }}
                className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                  timeOfDay === "ochtend"
                    ? "bg-[#1DC6B4] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Ochtend
              </button>
              <button
                onClick={() => {
                  setTimeOfDay("middag");
                  setDate("");
                  setChosenWorker("");
                }}
                className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                  timeOfDay === "middag"
                    ? "bg-[#1DC6B4] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Middag
              </button>
              <button
                onClick={() => {
                  setTimeOfDay("avond");
                  setDate("");
                  setChosenWorker("");
                }}
                className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                  timeOfDay === "avond"
                    ? "bg-[#1DC6B4] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Avond
              </button>
              <button
                onClick={() => {
                  setTimeOfDay("geen-voorkeur");
                  setDate("");
                  setChosenWorker("");
                }}
                className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                  timeOfDay === "geen-voorkeur"
                    ? "bg-[#1DC6B4] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Geen voorkeur
              </button>
            </div>
          </div>

          {/* Calendar */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kies een datum
            </label>
            
            {/* Calendar Header */}
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-[#1DC6B4] text-white p-3 flex items-center justify-between">
                <button
                  onClick={goToPreviousMonth}
                  className="p-1 hover:bg-[#18B5A3] rounded transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="font-medium">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </div>
                <button
                  onClick={goToNextMonth}
                  className="p-1 hover:bg-[#18B5A3] rounded transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Day names */}
              <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7">
                {calendarDays.map((day, index) => {
                  if (!day.isCurrentMonth) {
                    return <div key={index} className="aspect-square" />;
                  }

                  const isSelected = day.dateStr === date;
                  
                  let bgColor = "bg-white";
                  let textColor = "text-gray-900";
                  let hoverClass = "hover:bg-gray-50";
                  let cursor = "cursor-pointer";
                  
                  if (day.isPast) {
                    bgColor = "bg-gray-100";
                    textColor = "text-gray-300";
                    cursor = "cursor-not-allowed";
                    hoverClass = "";
                  } else if (day.availability === "high") {
                    bgColor = "bg-green-100";
                    textColor = "text-green-900";
                    hoverClass = "hover:bg-green-200";
                  } else if (day.availability === "limited") {
                    bgColor = "bg-orange-100";
                    textColor = "text-orange-900";
                    hoverClass = "hover:bg-orange-200";
                  } else if (day.availability === "none") {
                    bgColor = "bg-gray-100";
                    textColor = "text-gray-400";
                    cursor = "cursor-not-allowed";
                    hoverClass = "";
                  }

                  if (isSelected) {
                    bgColor = "bg-[#1DC6B4]";
                    textColor = "text-white";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => {
                        if (!day.isPast && day.availability !== "none") {
                          setDate(day.dateStr);
                          setChosenWorker("");
                        }
                      }}
                      disabled={day.isPast || day.availability === "none"}
                      className={`aspect-square border-b border-r border-gray-200 flex items-center justify-center text-sm font-medium transition-colors ${bgColor} ${textColor} ${hoverClass} ${cursor} ${
                        isSelected ? "ring-2 ring-[#1DC6B4] ring-inset" : ""
                      }`}
                    >
                      {day.date}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <div className="text-xs font-medium text-gray-700 mb-2">Legenda:</div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded" />
                  <span className="text-gray-600">Goed beschikbaar</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded" />
                  <span className="text-gray-600">Beperkt</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded" />
                  <span className="text-gray-600">Niet beschikbaar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Availability Display for Selected Date */}
          {selectedDateAvailability && date && (
            <div className="mb-4 p-3 bg-[#F0FFFE] border border-[#1DC6B4] rounded-lg">
              <div className="text-sm font-medium text-gray-900 mb-3">Beschikbaarheid op deze datum:</div>
              <div className="space-y-3">
                {/* Ochtend */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700 font-medium">Ochtend (08:00-12:00)</span>
                    <span className={`text-xs font-medium ${
                      selectedDateAvailability.ochtend.available > 0 ? "text-green-600" : "text-gray-400"
                    }`}>
                      {selectedDateAvailability.ochtend.available > 0 
                        ? `${selectedDateAvailability.ochtend.available} beschikbaar` 
                        : "Niet beschikbaar"}
                    </span>
                  </div>
                  {selectedDateAvailability.ochtend.available > 0 && (
                    <div className="ml-2 space-y-1">
                      {selectedDateAvailability.ochtend.staff.map((staffName, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          <span>{staffName}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Middag */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700 font-medium">Middag (12:00-18:00)</span>
                    <span className={`text-xs font-medium ${
                      selectedDateAvailability.middag.available > 0 ? "text-green-600" : "text-gray-400"
                    }`}>
                      {selectedDateAvailability.middag.available > 0 
                        ? `${selectedDateAvailability.middag.available} beschikbaar` 
                        : "Niet beschikbaar"}
                    </span>
                  </div>
                  {selectedDateAvailability.middag.available > 0 && (
                    <div className="ml-2 space-y-1">
                      {selectedDateAvailability.middag.staff.map((staffName, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          <span>{staffName}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Avond */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700 font-medium">Avond (18:00-22:00)</span>
                    <span className={`text-xs font-medium ${
                      selectedDateAvailability.avond.available > 0 ? "text-green-600" : "text-gray-400"
                    }`}>
                      {selectedDateAvailability.avond.available > 0 
                        ? `${selectedDateAvailability.avond.available} beschikbaar` 
                        : "Niet beschikbaar"}
                    </span>
                  </div>
                  {selectedDateAvailability.avond.available > 0 && (
                    <div className="ml-2 space-y-1">
                      {selectedDateAvailability.avond.staff.map((staffName, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          <span>{staffName}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Notes Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notities (optioneel)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Voeg een notitie toe..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1DC6B4] resize-none"
            />
          </div>

          {/* Verzorger Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kies een verzorger
            </label>
            <select
              value={chosenWorker}
              onChange={(e) => setChosenWorker(e.target.value)}
              disabled={availableWorkers.length === 0}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1DC6B4] bg-white disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">-- Kies een verzorger --</option>
              {availableWorkers.map((worker) => {
                const status = getStaffStatus(worker);
                return (
                  <option key={worker} value={worker}>
                    {worker} ({getStatusLabel(status)})
                  </option>
                );
              })}
            </select>
            {availableWorkers.length === 0 && date && (
              <div className="text-xs text-gray-500 mt-1">
                Geen verzorgers beschikbaar voor dit moment.
              </div>
            )}
            {!date && (
              <div className="text-xs text-gray-500 mt-1">
                Selecteer eerst een datum om beschikbare verzorgers te zien.
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Annuleren
            </button>
            <button
              onClick={handleSubmit}
              disabled={!date || getDateAvailability(date) === "none"}
              className="flex-1 py-3 px-4 bg-[#F5A623] text-white rounded-lg font-medium hover:bg-[#E69510] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Versturen
            </button>
          </div>
        </div>
      </div>
    </>
  );
}