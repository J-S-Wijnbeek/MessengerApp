import { TealHeader } from "../../components/TealHeader";
import { StaffBottomNav } from "../../components/StaffBottomNav";
import { SectionBar } from "../../components/SectionBar";
import { MessageCircle, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useStaffHome } from "./hooks/useStaffHome";

const SOCKET_URL = "http://localhost:3001";
const PENDING_URGENT_ALERTS_KEY = "pendingUrgentAlerts";

function loadPendingUrgentAlerts() {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(PENDING_URGENT_ALERTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function savePendingUrgentAlerts(alerts: Array<any>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PENDING_URGENT_ALERTS_KEY, JSON.stringify(alerts));
}

export default function StaffHome() {
  const { navigate, staffName, currentShiftTime, status, isAchterwacht, linkedClients, sosAlerts } =
    useStaffHome();
  const [urgentAlerts, setUrgentAlerts] = useState<
    Array<{ chatId: string; matches: string[]; message: string; createdAt: number }>
  >(() => loadPendingUrgentAlerts());
  const [messageNotifications, setMessageNotifications] = useState<
    Array<{ chatId: string; preview: string; timestamp: string; createdAt: number }>
  >([]);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      autoConnect: false,
      reconnection: false,
      timeout: 5000,
      transports: ["websocket", "polling"],
    });

    const handleUrgentAlert = (alert: any) => {
      const createdAt = Date.now();
      setUrgentAlerts((prev) => {
        if (prev.some((item) => String(item.chatId) === String(alert.chatId))) {
          return prev;
        }
        const next = [...prev, { ...alert, createdAt }];
        savePendingUrgentAlerts(next);
        return next;
      });
    };

    const removeUrgentAlert = (chatId: string) => {
      setUrgentAlerts((prev) => {
        const next = prev.filter((item) => String(item.chatId) !== String(chatId));
        savePendingUrgentAlerts(next);
        return next;
      });
    };

    const handleNewMessage = (notification: any) => {
      const createdAt = Date.now();
      setMessageNotifications((prev) => [
        ...prev,
        { ...notification, createdAt },
      ]);
      window.setTimeout(() => {
        setMessageNotifications((current) => current.filter((item) => item.createdAt !== createdAt));
      }, 10000);
    };

    socket.open();
    socket.on("connect", () => {
      socket.emit("join_staff");
    });
    socket.on("urgent_alert", handleUrgentAlert);
    socket.on("new_message", handleNewMessage);
    socket.on("connect_error", (error) => {
      console.warn("Staff socket connection failed:", error);
    });

    return () => {
      socket.disconnect();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white pb-20 max-w-[390px] mx-auto">
      <TealHeader title="TeamTelefoon" subtitle={`Goedemiddag, ${staffName.split(" ")[0]}`} />

      {/* New messages */}
      {messageNotifications.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 text-blue-900 px-4 py-3 space-y-3">
          <div className="font-bold">Nieuwe berichten</div>
          {messageNotifications.map((notification) => {
            const client = linkedClients.find((client) => String(client.id) === String(notification.chatId));
            return (
              <div
                key={`${notification.chatId}-${notification.createdAt}`}
                className="bg-white border border-blue-100 rounded-lg p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">
                      {client ? client.name : `Cliënt ${notification.chatId}`}
                    </div>
                    <div className="text-xs text-gray-600">{notification.timestamp}</div>
                    <div className="mt-2 text-sm text-gray-700">{notification.preview}</div>
                  </div>
                  <button
                    onClick={() => navigate(`/chat/${notification.chatId}`)}
                    className="text-[#1DC6B4] text-sm font-semibold"
                  >
                    Bekijk
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Status Card */}
      <div className="px-4 py-4">
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Huidige status</div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${status === "beschikbaar"
                  ? "bg-green-500 text-white"
                  : status === "achterwacht"
                    ? "bg-[#F5A623] text-white"
                    : "bg-gray-500 text-white"
                }`}
            >
              {status === "beschikbaar"
                ? "Beschikbaar"
                : status === "achterwacht"
                  ? "Achterwacht"
                  : "Niet beschikbaar"}
            </div>
          </div>
        </div>
      </div>

      {/* SOS Alerts (only shown if active) */}
      {sosAlerts.length > 0 && (
        <>
          <div className="bg-[#D9534F] text-white text-center py-2 px-4 font-bold text-sm">
            Noodoproepen actief
          </div>
          {urgentAlerts.length > 0 && (
            <div className="bg-red-50 border border-red-200 text-red-900 px-4 py-3 space-y-3">
              <div className="font-bold">Noodoproepen actief</div>
              {urgentAlerts.map((alert) => {
                const client = linkedClients.find((client) => String(client.id) === String(alert.chatId));
                return (
                  <div key={`${alert.chatId}-${alert.createdAt}`} className="bg-red-100 border border-red-200 rounded-lg p-3">
                    <div className="font-semibold">
                      {client ? client.name : `Cliënt ${alert.chatId}`}
                    </div>
                    <div className="text-xs text-gray-600">Matches: {alert.matches.join(", ")}</div>
                    <div className="mt-1 text-sm text-gray-800">"{alert.message}"</div>
                    <button
                      onClick={() => {
                        removeUrgentAlert(String(alert.chatId));
                        navigate(`/chat/${alert.chatId}`);
                      }}
                      className="mt-3 inline-flex items-center rounded-full bg-white border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
                    >
                      Open chat
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* My Clients */}
      <SectionBar title="Mijn Cliënten" />
      {linkedClients.map((client) => (
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
