import { Plus } from "lucide-react";

interface FABProps {
  onClick?: () => void;
  icon?: React.ReactNode;
}

export function FAB({ onClick, icon = <Plus size={28} /> }: FABProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 w-14 h-14 bg-[#F5A623] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#E69510] transition-colors max-w-[390px]"
    >
      {icon}
    </button>
  );
}
