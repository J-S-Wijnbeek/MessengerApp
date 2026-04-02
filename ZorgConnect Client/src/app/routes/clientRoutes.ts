import { redirect, type RouteObject } from "react-router";
import Login from "../screens/Login";
import ClientHome from "../screens/ClientHome";
import ClientAgenda from "../screens/ClientAgenda";
import ClientInstellingen from "../screens/ClientInstellingen";
import ClientProfiel from "../screens/ClientProfiel";
import ClientMedicatieZoeken from "../screens/ClientMedicatieZoeken";
import Berichten from "../screens/Berichten";
import SOSScreen from "../screens/SOSScreen";
import { ErrorBoundary } from "../components/ErrorBoundary";

const AUTH_STORAGE_KEY = "zorgconnect:client:isAuthed";

function isAuthed() {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function requireAuth() {
  if (!isAuthed()) {
    throw redirect("/");
  }
  return null;
}

export const clientRoutes: RouteObject[] = [
  {
    path: "/",
    Component: Login,
    ErrorBoundary: ErrorBoundary,
    loader: () => {
      if (isAuthed()) throw redirect("/home");
      return null;
    },
  },
  {
    path: "/home",
    Component: ClientHome,
    ErrorBoundary: ErrorBoundary,
    loader: requireAuth,
  },
  {
    path: "/agenda",
    Component: ClientAgenda,
    ErrorBoundary: ErrorBoundary,
    loader: requireAuth,
  },
  {
    path: "/instellingen",
    Component: ClientInstellingen,
    ErrorBoundary: ErrorBoundary,
    loader: requireAuth,
  },
  {
    path: "/profiel",
    Component: ClientProfiel,
    ErrorBoundary: ErrorBoundary,
    loader: requireAuth,
  },
  {
    path: "/medicatie",
    Component: ClientMedicatieZoeken,
    ErrorBoundary: ErrorBoundary,
    loader: requireAuth,
  },
  {
    path: "/berichten",
    Component: Berichten,
    ErrorBoundary: ErrorBoundary,
    loader: requireAuth,
  },
  {
    path: "/sos",
    Component: SOSScreen,
    ErrorBoundary: ErrorBoundary,
    loader: requireAuth,
  },
  {
    path: "*",
    Component: Login,
    ErrorBoundary: ErrorBoundary,
    loader: () => {
      if (isAuthed()) throw redirect("/home");
      return null;
    },
  },
];