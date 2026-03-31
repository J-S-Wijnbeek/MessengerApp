import { TealHeader } from "../../components/TealHeader";
import { StaffBottomNav } from "../../components/StaffBottomNav";
import { SectionBar } from "../../components/SectionBar";
import { ListRow } from "../../components/ListRow";
import { useTeamOverview } from "./hooks/useTeamOverview";

export default function TeamOverview() {
  const { beschikbaarStaff, achterwachtStaff, nietBeschikbaarStaff } = useTeamOverview();

  return (
    <div className="min-h-screen bg-white pb-20 max-w-[390px] mx-auto">
      <TealHeader title="Team 3 - Noord" />

      {/* Available Staff */}
      <SectionBar title="Beschikbaar" />
      {beschikbaarStaff.map((staff) => (
        <ListRow
          key={staff.id}
          name={staff.name}
          subtitle={`${staff.clients}/${staff.maxClients} clienten`}
          status="beschikbaar"
        />
      ))}

      {/* On Call Staff */}
      <SectionBar title="Achterwacht" />
      {achterwachtStaff.map((staff) => (
        <ListRow
          key={staff.id}
          name={staff.name}
          subtitle={`${staff.clients}/${staff.maxClients} clienten`}
          status="achterwacht"
          badge="Achterwacht"
        />
      ))}

      {/* Unavailable Staff */}
      <SectionBar title="Niet beschikbaar" />
      {nietBeschikbaarStaff.map((staff) => (
        <ListRow
          key={staff.id}
          name={staff.name}
          subtitle={`${staff.clients}/${staff.maxClients} clienten`}
          status="niet-beschikbaar"
        />
      ))}

      <StaffBottomNav />
    </div>
  );
}
