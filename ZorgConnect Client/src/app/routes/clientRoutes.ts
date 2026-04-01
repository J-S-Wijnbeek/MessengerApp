import { RouteObject } from "react-router";
import Login from "../screens/Login";
import ClientHome from "../screens/ClientHome";
import ClientAgenda from "../screens/ClientAgenda";
import ClientInstellingen from "../screens/ClientInstellingen";
import ClientProfiel from "../screens/ClientProfiel";
import Berichten from "../screens/Berichten";
import SOSScreen from "../screens/SOSScreen";
import { ErrorBoundary } from "../components/ErrorBoundary";

export const clientRoutes: RouteObject[] = [
  {
    path: "/",
    Component: Login,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: "/home",
    Component: ClientHome,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: "/agenda",
    Component: ClientAgenda,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: "/instellingen",
    Component: ClientInstellingen,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: "/profiel",
    Component: ClientProfiel,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: "/berichten",
    Component: Berichten,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: "/sos",
    Component: SOSScreen,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: "*",
    Component: Login,
    ErrorBoundary: ErrorBoundary,
  },
];