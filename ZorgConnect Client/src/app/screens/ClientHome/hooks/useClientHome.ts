import { useState } from "react";
import { useNavigate } from "react-router";
import { mockCoupledCareWorkers, mockOtherStaff } from "../../../data/mockData";
import { StatusType } from "../../../components/ListRow";

export function useClientHome() {
  const [showOtherStaff, setShowOtherStaff] = useState(false);
  const navigate = useNavigate();

  const fastestCareWorker = mockCoupledCareWorkers[0];

  const beschikbaarCoupled = mockCoupledCareWorkers.filter((s) => s.status === "beschikbaar");
  const achterwachtCoupled = mockCoupledCareWorkers.filter((s) => s.status === "achterwacht");
  const nietBeschikbaarCoupled = mockCoupledCareWorkers.filter((s) => s.status === "niet-beschikbaar");

  const beschikbaarOther = mockOtherStaff.filter((s) => s.status === "beschikbaar");
  const achterwachtOther = mockOtherStaff.filter((s) => s.status === "achterwacht");
  const nietBeschikbaarOther = mockOtherStaff.filter((s) => s.status === "niet-beschikbaar");

  const navigateToChat = (id: number) => {
    navigate("/berichten", { state: { chatId: id } });
  };

  return {
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
  };
}

export type { StatusType };
