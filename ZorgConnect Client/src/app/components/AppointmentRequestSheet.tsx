import React, { useState, useMemo } from "react";
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
}

type StaffStatus = "beschikbaar" | "achterwacht" | "niet-beschikbaar" | "onbekend";

const getStaffStatus = (name: string): StaffStatus => {
  const allStaff = [...mockStaff, ...mockCoupledCareWorkers, ...mockOtherStaff];
  const staffMember = allStaff.find((s) => s.name === name);
  return (staffMember?.status as StaffStatus) || "onbekend";
};

const getStatusColors = (status: StaffStatus) => {
  switch (status) {
    case "beschikbaar":
      return {
        dot: "bg-green-500",
        text: "text-green-700",
      };
    case "achterwacht":
      return {
        dot: "bg-orange-500",
        text: "text-orange-700",
      };
    case "niet-beschikbaar":
      return {
        dot: "bg-gray-400",
        text: "text-gray-500",
      };
    default:
      return {
        dot: "bg-gray-300",
        text: "text-gray-700",
      };
  }
};

type SlotCategory = "green" | "orange" | "gray";

const getSlotCategory = (
  availableCount: number,
  slot: "ochtend" | "middag" | "avond",
  selectedTimeOfDay: "ochtend" | "middag" | "avond" | "geen-voorkeur",
): SlotCategory => {
  if (availableCount <= 0) return "gray";

  if (selectedTimeOfDay === "geen-voorkeur") {
    // Geen voorkeur: alle blokken groen (als er beschikbaarheid is)
    return "green";
  }

  // Specifiek dagdeel: gekozen blok groen, rest oranje (als er beschikbaarheid is)
  return slot === selectedTimeOfDay ? "green" : "orange";
};

const getSlotCardColors = (category: SlotCategory) => {
  switch (category) {
    case "green":
      return {
        card: "bg-green-50 border-green-200",
        badge: "text-green-700",
      };
    case "orange":
      return {
        card: "bg-orange-50 border-orange-200",
        badge: "text-orange-700",
      };
    default:
      return {
        card: "bg-gray-50 border-gray-200",
        badge: "text-gray-500",
      };
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
  // Start the calendar on the current month, not a hardcoded month
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth());
  });

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
    // Use today at midnight so same-day dates are not marked as past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
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

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!date) {
      alert("Selecteer een datum");
      return;
    }
    onSubmit({ date, timeOfDay, notes });
    // Reset form
    setDate("");
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
        className="fixed inset-0 z-40"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        onClick={onClose}
      />

      {/* Bottom Sheet / Desktop Side Panel */}
      <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl self-center !h-fit z-50 w-full max-w-md mx-auto animate-slide-up max-h-[90vh] overflow-y-auto md:inset-y-0 md:right-0 md:left-auto md:top-0 md:h-full md:max-w-lg md:rounded-none md:rounded-l-2xl">
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
                }}
                className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                  timeOfDay === "ochtend"
                    ? "bg-[#F5A623] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Ochtend
              </button>
              <button
                onClick={() => {
                  setTimeOfDay("middag");
                  setDate("");
                }}
                className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                  timeOfDay === "middag"
                    ? "bg-[#F5A623] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Middag
              </button>
              <button
                onClick={() => {
                  setTimeOfDay("avond");
                  setDate("");
                }}
                className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                  timeOfDay === "avond"
                    ? "bg-[#F5A623] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Avond
              </button>
              <button
                onClick={() => {
                  setTimeOfDay("geen-voorkeur");
                  setDate("");
                }}
                className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                  timeOfDay === "geen-voorkeur"
                    ? "bg-[#F5A623] text-white"
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
              <div className="bg-[#F5A623] text-white p-3 flex items-center justify-between">
                <button
                  onClick={goToPreviousMonth}
                  className="p-1 hover:bg-[#E69510] rounded transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="font-medium">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </div>
                <button
                  onClick={goToNextMonth}
                  className="p-1 hover:bg-[#E69510] rounded transition-colors"
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
                    bgColor = "bg-[#F5A623]";
                    textColor = "text-white";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => {
                        if (!day.isPast && day.availability !== "none") {
                          setDate(day.dateStr);
                        }
                      }}
                      disabled={day.isPast || day.availability === "none"}
                      className={`aspect-square border-b border-r border-gray-200 flex items-center justify-center text-sm font-medium transition-colors ${bgColor} ${textColor} ${hoverClass} ${cursor} ${
                        isSelected ? "ring-2 ring-[#F5A623] ring-inset" : ""
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
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-900 mb-3">Beschikbaarheid op deze datum:</div>
              <div className="space-y-3">
                {/* Ochtend */}
                {(() => {
                  const slot = selectedDateAvailability.ochtend;
                  const category = getSlotCategory(slot.available, "ochtend", timeOfDay);
                  const colors = getSlotCardColors(category);
                  return (
                    <div
                      className={`p-3 rounded-lg border ${colors.card}`}
                    >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700 font-medium">Ochtend (08:00-12:00)</span>
                    <span className={`text-xs font-medium ${slot.available > 0 ? colors.badge : "text-gray-400"}`}>
                      {slot.available > 0
                        ? `${slot.available} beschikbaar`
                        : "Niet beschikbaar"}
                    </span>
                  </div>
                  {slot.available > 0 && (
                    <div className="ml-2 space-y-1">
                      {slot.staff.map((staffName, index) => {
                        const status = getStaffStatus(staffName);
                        const colors = getStatusColors(status);
                        return (
                          <div
                            key={index}
                            className={`flex items-center gap-2 text-xs ${colors.text}`}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                            <span>{staffName}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                    </div>
                  );
                })()}

                {/* Middag */}
                {(() => {
                  const slot = selectedDateAvailability.middag;
                  const category = getSlotCategory(slot.available, "middag", timeOfDay);
                  const colors = getSlotCardColors(category);
                  return (
                    <div
                      className={`p-3 rounded-lg border ${colors.card}`}
                    >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700 font-medium">Middag (12:00-18:00)</span>
                    <span className={`text-xs font-medium ${slot.available > 0 ? colors.badge : "text-gray-400"}`}>
                      {slot.available > 0
                        ? `${slot.available} beschikbaar`
                        : "Niet beschikbaar"}
                    </span>
                  </div>
                  {slot.available > 0 && (
                    <div className="ml-2 space-y-1">
                      {slot.staff.map((staffName, index) => {
                        const status = getStaffStatus(staffName);
                        const colors = getStatusColors(status);
                        return (
                          <div
                            key={index}
                            className={`flex items-center gap-2 text-xs ${colors.text}`}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                            <span>{staffName}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                    </div>
                  );
                })()}

                {/* Avond */}
                {(() => {
                  const slot = selectedDateAvailability.avond;
                  const category = getSlotCategory(slot.available, "avond", timeOfDay);
                  const colors = getSlotCardColors(category);
                  return (
                    <div
                      className={`p-3 rounded-lg border ${colors.card}`}
                    >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700 font-medium">Avond (18:00-22:00)</span>
                    <span className={`text-xs font-medium ${slot.available > 0 ? colors.badge : "text-gray-400"}`}>
                      {slot.available > 0
                        ? `${slot.available} beschikbaar`
                        : "Niet beschikbaar"}
                    </span>
                  </div>
                  {slot.available > 0 && (
                    <div className="ml-2 space-y-1">
                      {slot.staff.map((staffName, index) => {
                        const status = getStaffStatus(staffName);
                        const colors = getStatusColors(status);
                        return (
                          <div
                            key={index}
                            className={`flex items-center gap-2 text-xs ${colors.text}`}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                            <span>{staffName}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Notes Input */}
          <div className="mb-6">
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