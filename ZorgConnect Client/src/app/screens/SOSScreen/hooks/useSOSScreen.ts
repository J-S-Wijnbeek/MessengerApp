import { useState, useEffect } from "react";

// Helper om toestemming uit localStorage te halen
function getLocatieToestemming() {
  if (typeof window === "undefined") return false;
  const stored = window.localStorage.getItem("zorgconnect:client:locatieDelen");
  return stored === "true";
}
import { useNavigate } from "react-router";

export function useSOSScreen() {
    const [isEmergencySent, setIsEmergencySent] = useState(false);
    // Locatie ophalen als toestemming is gegeven
    const [location, setLocation] = useState<{lat: number; lng: number} | null>(null);
      const [adres, setAdres] = useState<string>("");
    useEffect(() => {
      console.log('useEffect triggered, isEmergencySent:', isEmergencySent);
      const allowed = getLocatieToestemming();
      console.log('locatie toestemming:', allowed);
      if (allowed && "geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            console.log('Locatie opgehaald:', pos);
            setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          },
          (err) => {
            console.error('Locatie error:', err);
            setLocation(null);
          }
        );
      } else {
        setLocation(null);
      }
    }, [isEmergencySent]);
    
      // Haal adres op via Google Maps Geocoding API
      useEffect(() => {
        if (location) {
          const fetchAdres = async () => {
            try {
              const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=AIzaSyAhzleMjsGnAvFIlXDDXJ6Hf4OrZFrs0xc`);
              const data = await res.json();
              if (data.status === "OK" && data.results.length > 0) {
                setAdres(data.results[0].formatted_address);
              } else {
                setAdres("Adres niet gevonden");
              }
            } catch {
              setAdres("Adres ophalen mislukt");
            }
          };
          fetchAdres();
        } else {
          setAdres("");
        }
      }, [location]);
    const navigate = useNavigate();
    const [isPressing, setIsPressing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showVerification, setShowVerification] = useState(false);

  useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
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

    const confirmEmergency = async () => {
        setShowVerification(false);
        setIsEmergencySent(true);
        // Verstuur locatie en adres naar backend/werknemer
        if (location && adres) {
          try {
            await fetch("http://localhost:3001/noodmeldingen", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                lat: location.lat,
                lng: location.lng,
                adres,
                tijd: new Date().toISOString(),
              }),
            });
          } catch (e) {
            // optioneel: error handling
            console.error("Fout bij versturen noodmelding:", e);
          }
        }
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
    startPressing,
    stopPressing,
    confirmEmergency,
    cancelVerification,
    closeEmergency,
    cancelSOS,
    location,
         adres,
  };
}
