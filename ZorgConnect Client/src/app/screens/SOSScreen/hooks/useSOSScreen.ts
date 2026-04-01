import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useCurrentUserName } from "../../../hooks/useCurrentUserName";

interface GeoLocation {
  lat: number;
  lng: number;
}

export function useSOSScreen() {
  const navigate = useNavigate();
  const currentUserName = useCurrentUserName();
  const dbBaseUrl = import.meta.env.VITE_DATABASE_URL || "http://localhost:3001";
  const sosAlertsUrl = `${dbBaseUrl.replace(/\/$/, "")}/sosAlerts`;

  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isEmergencySent, setIsEmergencySent] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [location, setLocation] = useState<GeoLocation | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          // Location unavailable, proceed without it
        }
      );
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPressing) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPressing(false);
            setShowVerification(true);
            return 100;
          }
          return prev + 100 / 30;
        });
      }, 100);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isPressing]);

  const startPressing = () => {
    setIsPressing(true);
    setShowVerification(false);
  };

  const stopPressing = () => setIsPressing(false);

  const confirmEmergency = () => {
    setShowVerification(false);
    setIsEmergencySent(true);

    const now = new Date();
    const timestamp = now.toLocaleTimeString("nl-NL", {
      hour: "2-digit",
      minute: "2-digit",
    });

    (async () => {
      try {
        await fetch(sosAlertsUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientName: currentUserName,
            timestamp,
            status: "Actief",
            createdAt: now.toISOString(),
            location: location ? { lat: location.lat, lng: location.lng } : null,
          }),
        });
      } catch (e) {
        console.warn("Kon noodmelding niet versturen:", e);
      }
    })();
  };

  const cancelVerification = () => {
    setShowVerification(false);
    setProgress(0);
  };

  const closeEmergency = () => {
    setIsEmergencySent(false);
    navigate("/home");
  };

  const cancelSOS = () => navigate("/home");

  return {
    isPressing,
    progress,
    isEmergencySent,
    showVerification,
    location,
    startPressing,
    stopPressing,
    confirmEmergency,
    cancelVerification,
    closeEmergency,
    cancelSOS,
  };
}
