import { mockStaff } from "../../../data/mockData";
import { StatusType } from "../../../components/ListRow";

export function useTeamOverview() {
  const beschikbaarStaff = mockStaff.filter((s) => s.status === "beschikbaar");
  const achterwachtStaff = mockStaff.filter((s) => s.status === "achterwacht");
  const nietBeschikbaarStaff = mockStaff.filter((s) => s.status === "niet-beschikbaar");

  return { beschikbaarStaff, achterwachtStaff, nietBeschikbaarStaff };
}

export type { StatusType };
