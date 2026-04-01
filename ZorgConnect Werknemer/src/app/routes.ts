import { createBrowserRouter } from "react-router";
import Login from "./screens/Login";
import StaffHome from "./screens/StaffHome";
import TeamOverview from "./screens/TeamOverview";
import Plannen from "./screens/Plannen";
import Gesprekken from "./screens/Gesprekken";
import Instellingen from "./screens/Instellingen";
import Berichten from "./screens/Berichten";
import ChatDetail from "./screens/ChatDetail";
import ClientProfiel from "./screens/ClientProfiel";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/staff-home",
    Component: StaffHome,
  },
  {
    path: "/team",
    Component: TeamOverview,
  },
  {
    path: "/plannen",
    Component: Plannen,
  },
  {
    path: "/berichten",
    Component: Berichten,
  },
  {
    path: "/chat/:clientId",
    Component: ChatDetail,
  },
  {
    path: "/client-profiel/:clientId",
    Component: ClientProfiel,
  },
  {
    path: "/gesprekken",
    Component: Gesprekken,
  },
  {
    path: "/instellingen",
    Component: Instellingen,
  },
  {
    path: "*",
    Component: Login,
  },
]);