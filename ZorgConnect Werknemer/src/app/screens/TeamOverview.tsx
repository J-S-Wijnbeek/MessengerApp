import { TealHeader } from "../components/TealHeader";
import { StaffBottomNav } from "../components/StaffBottomNav";
import { SectionBar } from "../components/SectionBar";
import { ListRow } from "../components/ListRow";
import { mockStaff } from "../data/mockData";

export default function TeamOverview() {
  const beschikbaarStaff = mockStaff.filter((s) => s.status === "beschikbaar");
  const achterwachtStaff = mockStaff.filter((s) => s.status === "achterwacht");
  const nietBeschikbaarStaff = mockStaff.filter((s) => s.status === "niet-beschikbaar");

  return (
    <div className="min-h-screen bg-white pb-20 max-w-[390px] mx-auto">
      <TealHeader title="Team 3 - Noord" />

      {/* Available Staff */}
      <SectionBar title="Beschikbaar" />
      {beschikbaarStaff.map((staff) => (
        <ListRow
          key={staff.id}
          name={staff.name}
          subtitle={`${staff.clients}/${staff.maxClients} cliënten`}
          status="beschikbaar"
        />
      ))}

      {/* On Call Staff */}
      <SectionBar title="Achterwacht" />
      {achterwachtStaff.map((staff) => (
        <ListRow
          key={staff.id}
          name={staff.name}
          subtitle={`${staff.clients}/${staff.maxClients} cliënten`}
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
          subtitle={`${staff.clients}/${staff.maxClients} cliënten`}
          status="niet-beschikbaar"
        />
      ))}

      <StaffBottomNav />
    </div>
  );
}