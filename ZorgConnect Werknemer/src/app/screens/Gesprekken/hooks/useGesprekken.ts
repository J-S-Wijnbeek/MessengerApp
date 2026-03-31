import { useState } from "react";
import { mockCalls, mockSOSHistory } from "../../../data/mockData";

export function useGesprekken() {
  const [view, setView] = useState<string>("Alles");

  const filteredCalls =
    view === "Gemist"
      ? mockCalls.filter((c) => c.type === "gemist")
      : mockCalls;

  return {
    view,
    setView,
    filteredCalls,
    sosHistory: mockSOSHistory,
  };
}
