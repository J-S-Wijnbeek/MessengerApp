import { useMemo } from "react";

const STORAGE_KEY = "zorgconnect.currentUserName";
const FALLBACK_NAME = "Peter Hendriks";

export function useCurrentUserName() {
  return useMemo(() => {
    if (typeof window === "undefined") return FALLBACK_NAME;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored?.trim() ? stored : FALLBACK_NAME;
  }, []);
}

