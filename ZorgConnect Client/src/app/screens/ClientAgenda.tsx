import { useState } from "react";
import { TealHeader } from "../components/TealHeader";
import { ClientBottomNav } from "../components/ClientBottomNav";
import { PillToggle } from "../components/PillToggle";
import { SectionBar } from "../components/SectionBar";
import { FAB } from "../components/FAB";
import { AppointmentRequestSheet, AppointmentRequest } from "../components/AppointmentRequestSheet";
import { mockAppointments } from "../data/mockData";

export default function ClientAgenda() {
  const [view, setView] = useState<string>("Aankomend");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleAppointmentRequest = (request: AppointmentRequest) => {
    // In a real app, this would send the request to the backend
    console.log("Appointment request:", request);
    alert(
      `Afspraakverzoek verstuurd!\nDatum: ${request.date}\nDagdeel: ${request.timeOfDay}\nNotities: ${request.notes || "Geen"}`
    );
  };

  const todayAppointments = mockAppointments.filter((a) => a.date === "Vandaag");
  const laterAppointments = mockAppointments.filter((a) => a.date !== "Vandaag");
  const pastAppointments = mockAppointments.filter((a) => a.isPast);

  return (
    <div className="min-h-screen bg-white pb-20 w-full mx-auto">
      <TealHeader title="Mijn Agenda" />

      {/* Pill Toggle */}
      <div className="p-4 flex justify-center">
        <PillToggle
          options={["Aankomend", "Afgelopen"]}
          value={view}
          onChange={setView}
        />
      </div>

      {view === "Aankomend" ? (
        <>
          {todayAppointments.length > 0 ? (
            <>
              <SectionBar title="Vandaag" />
              {todayAppointments.map((apt) => (
                <div key={apt.id} className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="font-bold text-lg mb-1">{apt.time}</div>
                      <div className="text-sm text-gray-700 mb-1">
                        {apt.type === "call" ? "Belafspraak 📞" : "Gesprek 💬"}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                          {apt.staffName.charAt(0)}
                        </div>
                        <div className="text-sm text-gray-600">{apt.staffName}</div>
                      </div>
                    </div>
                    {apt.isNow && (
                      <button className="bg-[#1DC6B4] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#18B5A3]">
                        Bel nu
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : null}

          {laterAppointments.length > 0 ? (
            <>
              <SectionBar title="Later" />
              {laterAppointments.map((apt) => (
                <div key={apt.id} className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-1">{apt.date}</div>
                      <div className="font-bold text-lg mb-1">{apt.time}</div>
                      <div className="text-sm text-gray-700 mb-1">
                        {apt.type === "call" ? "Belafspraak 📞" : "Gesprek 💬"}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                          {apt.staffName.charAt(0)}
                        </div>
                        <div className="text-sm text-gray-600">{apt.staffName}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : null}

          {todayAppointments.length === 0 && laterAppointments.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              Geen geplande afspraken
            </div>
          )}
        </>
      ) : (
        <>
          {pastAppointments.length > 0 ? (
            pastAppointments.map((apt) => (
              <div key={apt.id} className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">{apt.date}</div>
                    <div className="font-bold text-lg mb-1">{apt.time}</div>
                    <div className="text-sm text-gray-700 mb-1">
                      {apt.type === "call" ? "Belafspraak 📞" : "Gesprek 💬"}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                        {apt.staffName.charAt(0)}
                      </div>
                      <div className="text-sm text-gray-600">{apt.staffName}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-12">
              Geen afgelopen afspraken
            </div>
          )}
        </>
      )}

      <FAB onClick={() => setIsSheetOpen(true)} />
      <AppointmentRequestSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onSubmit={handleAppointmentRequest}
      />
      <ClientBottomNav />
    </div>
  );
}