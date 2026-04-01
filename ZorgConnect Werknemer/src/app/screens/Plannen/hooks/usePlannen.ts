import { useState } from "react";
import { mockSchedule, mockStaff } from "../../../data/mockData";

export function usePlannen() {
  const [view, setView] = useState<string>("Ik");
  const [selectedShift, setSelectedShift] = useState<number | null>(null);

  const openShiftDetail = (id: number) => setSelectedShift(id);
  const closeShiftDetail = () => setSelectedShift(null);

  return {
    view,
    setView,
    selectedShift,
    openShiftDetail,
    closeShiftDetail,
    schedule: mockSchedule,
    staff: mockStaff,
  };
}
