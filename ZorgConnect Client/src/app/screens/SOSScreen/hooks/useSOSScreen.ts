import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

export function useSOSScreen() {
  const navigate = useNavigate();
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isEmergencySent, setIsEmergencySent] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

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
  };
}
