import { ChevronRight } from "lucide-react";

type StatusType = "beschikbaar" | "achterwacht" | "niet-beschikbaar";

interface ListRowProps {
  avatarUrl?: string;
  name: string;
  subtitle?: string;
  status?: StatusType;
  badge?: string;
  onClick?: () => void;
}

export function ListRow({ avatarUrl, name, subtitle, status, badge, onClick }: ListRowProps) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 active:bg-gray-50"
      onClick={onClick}
    >
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-500 text-lg font-medium">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        {status && <StatusDot status={status} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900">{name}</div>
        {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
        {badge && (
          <span className="inline-block mt-1 px-3 py-1 bg-[#F5A623] text-white text-xs rounded-full">
            {badge}
          </span>
        )}
      </div>
      <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
    </div>
  );
}

function StatusDot({ status }: { status: StatusType }) {
  const colors = {
    beschikbaar: "bg-green-500",
    achterwacht: "bg-[#F5A623]",
    "niet-beschikbaar": "bg-gray-400",
  };

  return (
    <div
      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${colors[status]}`}
    />
  );
}
