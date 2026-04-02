import React, { useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { mockAvailability, mockStaff, mockCoupledCareWorkers, mockOtherStaff } from "../data/mockData";
import { Appointment } from "../screens/ClientAgenda/hooks/useClientAgenda";

interface AppointmentRequestSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: AppointmentRequest) => void;
  bookedAppointments: {
    requested: Appointment[];
    planned: Appointment[];
  };
}

export interface AppointmentRequest {
  date: string;
  timeOfDay: "ochtend" | "middag" | "avond" | "geen-voorkeur";
  notes: string;
  chosenWorker: string;
  contactType: "telefoongesprek" | "afspraak";
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
        text: "text-green-700 dark:text-green-200",
      };
    case "achterwacht":
      return {
        dot: "bg-orange-500",
        text: "text-orange-700 dark:text-orange-200",
      };
    case "niet-beschikbaar":
      return {
        dot: "bg-gray-400",
        text: "text-gray-500 dark:text-gray-300",
      };
    default:
      return {
        dot: "bg-gray-300",
        text: "text-gray-700 dark:text-gray-200",
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
        card: "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800",
        badge: "text-green-700 dark:text-green-200",
      };
    case "orange":
      return {
        card: "bg-orange-50 border-orange-200 dark:bg-orange-950/25 dark:border-orange-800",
        badge: "text-orange-700 dark:text-orange-200",
      };
    default:
      return {
        card: "bg-muted border-border",
        badge: "text-muted-foreground",
      };
  }
};

function AppointmentRequestSheetInternal({
  isOpen,
  onClose,
  onSubmit,
  bookedAppointments,
}: AppointmentRequestSheetProps) {
  const [timeOfDay, setTimeOfDay] = useState<"ochtend" | "middag" | "avond" | "geen-voorkeur">("geen-voorkeur");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [chosenWorker, setChosenWorker] = useState("");
  const [contactType, setContactType] = useState<"telefoongesprek" | "afspraak">("afspraak");
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const minBookableDate = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 2); // 48+ hours in advance (today + 2 days)
    return d;
  }, []);

  const isBeforeMinBookable = (d: Date) => d.getTime() < minBookableDate.getTime();

  const toISODate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Get availability status for a date
  const getDateAvailability = (dateStr: string) => {
    const availability = mockAvailability[dateStr];
    if (!availability) return "unknown";

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
      isDisabled: boolean;
      availability: "high" | "limited" | "none" | "unknown";
    }> = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({
        date: 0,
        dateStr: "",
        isCurrentMonth: false,
        isDisabled: true,
        availability: "none",
      });
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dateStr = toISODate(currentDate);
      const isDisabled = isBeforeMinBookable(currentDate);

      days.push({
        date: day,
        dateStr,
        isCurrentMonth: true,
        isDisabled,
        availability: isDisabled ? "none" : getDateAvailability(dateStr),
      });
    }

    return days;
  }, [currentMonth, timeOfDay, minBookableDate]);

  const selectedDateAvailability = date ? mockAvailability[date] : null;

  // All caretakers with "beschikbaar" status across all staff lists
  const allAvailableCaretakers = useMemo(() => {
    const allStaff = [...mockStaff, ...mockCoupledCareWorkers, ...mockOtherStaff];
    const seen = new Set<string>();
    const result: string[] = [];
    for (const s of allStaff) {
      if (s.status === "beschikbaar" && !seen.has(s.name)) {
        seen.add(s.name);
        result.push(s.name);
      }
    }
    return result;
  }, []);

  // Exclude workers already booked for this date and time
  const availableWorkers = useMemo(() => {
    const allAppointments = [...(bookedAppointments.requested || []), ...(bookedAppointments.planned || [])];
    const bookedWorkers = allAppointments
      .filter(a => a.date === date && (timeOfDay === "geen-voorkeur" || a.timeOfDay === timeOfDay))
      .map(a => a.chosenWorker)
      .filter(Boolean);

    if (!date) return [];

    // If schedule data exists for this date/slot, use it; otherwise fall back to all beschikbaar caretakers
    if (selectedDateAvailability) {
      let slotStaff: string[] = [];
      if (timeOfDay === "geen-voorkeur") {
        const ochtend = selectedDateAvailability.ochtend?.staff || [];
        const middag = selectedDateAvailability.middag?.staff || [];
        const avond = selectedDateAvailability.avond?.staff || [];
        slotStaff = Array.from(new Set([...ochtend, ...middag, ...avond]));
      } else {
        slotStaff = selectedDateAvailability[timeOfDay]?.staff || [];
      }
      // Also include beschikbaar caretakers not listed in the schedule
      const combined = Array.from(new Set([...slotStaff, ...allAvailableCaretakers]));
      return combined.filter(worker => !bookedWorkers.includes(worker as any));
    }

    // No schedule data — show all beschikbaar caretakers
    return allAvailableCaretakers.filter(worker => !bookedWorkers.includes(worker as any));
  }, [date, timeOfDay, selectedDateAvailability, bookedAppointments, allAvailableCaretakers]);

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
      alert("Selecteer een medewerker");
      return;
    }
    onSubmit({ date, timeOfDay, notes, chosenWorker, contactType });
    // Reset form
    setDate("");
    setTimeOfDay("geen-voorkeur");
    setNotes("");
    setChosenWorker("");
    setContactType("afspraak");
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
      <div className="fixed inset-x-0 bottom-0 bg-background text-foreground rounded-t-2xl self-center !h-fit z-50 w-full max-w-md mx-auto animate-slide-up max-h-[90vh] overflow-y-auto md:inset-y-0 md:right-0 md:left-auto md:top-0 md:h-full md:max-w-lg md:rounded-none md:rounded-l-2xl">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Afspraak aanvragen</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X size={24} className="text-muted-foreground" />
            </button>
          </div>

          {/* Contact Type Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Type contact
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setContactType("afspraak")}
                className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                  contactType === "afspraak"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                📅 Afspraak
              </button>
              <button
                onClick={() => setContactType("telefoongesprek")}
                className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                  contactType === "telefoongesprek"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                📞 Telefoongesprek
              </button>
            </div>
          </div>

          {/* Time of Day Selection - First */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
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
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
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
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
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
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
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
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                Geen voorkeur
              </button>
            </div>
          </div>

          {/* Calendar */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Kies een datum
            </label>
            
            {/* Calendar Header */}
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="bg-primary text-primary-foreground p-3 flex items-center justify-between">
                <button
                  onClick={goToPreviousMonth}
                  className="p-1 hover:bg-primary/90 rounded transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="font-medium">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </div>
                <button
                  onClick={goToNextMonth}
                  className="p-1 hover:bg-primary/90 rounded transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Day names */}
              <div className="grid grid-cols-7 bg-muted border-b border-border">
                {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
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
                  
                  let bgColor = "bg-background";
                  let textColor = "text-foreground";
                  let hoverClass = "hover:bg-muted";
                  let cursor = "cursor-pointer";
                  
                  if (day.isDisabled) {
                    bgColor = "bg-muted";
                    textColor = "text-muted-foreground/50";
                    cursor = "cursor-not-allowed";
                    hoverClass = "";
                  } else if (day.availability === "high") {
                    bgColor = "bg-green-100 dark:bg-green-950/25";
                    textColor = "text-green-700 dark:text-green-200";
                    hoverClass = "hover:bg-green-200 dark:hover:bg-green-950/35";
                  } else if (day.availability === "limited") {
                    bgColor = "bg-orange-100 dark:bg-orange-950/22";
                    textColor = "text-orange-700 dark:text-orange-200";
                    hoverClass = "hover:bg-orange-200 dark:hover:bg-orange-950/30";
                  } else if (day.availability === "unknown") {
                    bgColor = "bg-amber-100 dark:bg-amber-950/18";
                    textColor = "text-amber-800 dark:text-amber-200";
                    hoverClass = "hover:bg-amber-200 dark:hover:bg-amber-950/28";
                  } else if (day.availability === "none") {
                    bgColor = "bg-muted";
                    textColor = "text-muted-foreground/70";
                    cursor = "cursor-not-allowed";
                    hoverClass = "";
                  }

                  if (isSelected) {
                    bgColor = "bg-primary";
                    textColor = "text-primary-foreground";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => {
                        if (!day.isDisabled && day.availability !== "none") {
                          setDate(day.dateStr);
                        }
                      }}
                      disabled={day.isDisabled || day.availability === "none"}
                      className={`aspect-square border-b border-r border-border flex items-center justify-center text-sm font-medium transition-colors ${bgColor} ${textColor} ${hoverClass} ${cursor} ${
                        isSelected ? "ring-2 ring-primary ring-inset" : ""
                      }`}
                    >
                      {day.date}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-3 p-3 bg-muted rounded-lg">
              <div className="text-xs font-medium text-foreground mb-2">Legenda:</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 dark:bg-green-950/35 dark:border-green-800 rounded" />
                  <span className="text-green-700 dark:text-green-200">Goed beschikbaar</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-orange-100 border border-orange-300 dark:bg-orange-950/30 dark:border-orange-800 rounded" />
                  <span className="text-orange-700 dark:text-orange-200">Beperkt</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-amber-100 border border-amber-300 dark:bg-amber-950/18 dark:border-amber-800 rounded" />
                  <span className="text-amber-800 dark:text-amber-200">Rooster onbekend</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-muted border border-border rounded" />
                  <span className="text-muted-foreground">Niet beschikbaar / te vroeg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Availability Display for Selected Date */}
          {date && !selectedDateAvailability && (
            <div className="mb-4">
              <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/18">
                <div className="text-sm font-medium text-amber-900 dark:text-amber-100">Rooster onbekend</div>
                <div className="text-xs text-amber-800 dark:text-amber-200 mt-1">
                  Je kunt deze datum wel aanvragen. We bevestigen de afspraak zodra het rooster bekend is.
                </div>
              </div>
            </div>
          )}

          {selectedDateAvailability && date && (
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-3">Beschikbaarheid op deze datum:</div>
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
                    <span className="text-sm text-muted-foreground font-medium">Ochtend</span>
                    <span className={`text-xs font-medium ${slot.available > 0 ? colors.badge : "text-muted-foreground/70"}`}>
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
                    <span className="text-sm text-muted-foreground font-medium">Middag</span>
                    <span className={`text-xs font-medium ${slot.available > 0 ? colors.badge : "text-muted-foreground/70"}`}>
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
                    <span className="text-sm text-muted-foreground font-medium">Avond</span>
                    <span className={`text-xs font-medium ${slot.available > 0 ? colors.badge : "text-muted-foreground/70"}`}>
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
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Notities (optioneel)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Voeg een notitie toe..."
              rows={3}
              className="w-full px-4 py-2 border border-border bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
            />
          </div>

          {/* Worker Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Kies een medewerker
            </label>
            <select
              value={chosenWorker}
              onChange={e => setChosenWorker(e.target.value)}
              className="w-full px-4 py-2 border border-border bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              disabled={availableWorkers.length === 0}
            >
              <option value="">-- Kies een medewerker --</option>
              {availableWorkers.map((worker) => (
                <option key={worker} value={worker}>{worker}</option>
              ))}
            </select>
            {availableWorkers.length === 0 && (
              <div className="text-xs text-muted-foreground mt-1">Geen medewerkers beschikbaar voor dit moment.</div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 dark:bg-muted/60 dark:hover:bg-muted/70 transition-colors"
            >
              Annuleren
            </button>
            <button
              onClick={handleSubmit}
              disabled={!date || getDateAvailability(date) === "none"}
              className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:bg-muted disabled:cursor-not-allowed disabled:text-muted-foreground"
            >
              Versturen
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export function AppointmentRequestSheet(props: AppointmentRequestSheetProps) {
  if (!props.isOpen) {
    return null;
  }
  return <AppointmentRequestSheetInternal {...props} />;
}