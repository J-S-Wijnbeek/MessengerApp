import { Plus } from "lucide-react";

interface FABProps {
  onClick?: () => void;
  icon?: React.ReactNode;
}

export function FAB({ icon, onClick }: FABProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 w-14 h-14 bg-[#1DC6B4] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#18B5A3] transition-colors max-w-[390px]"
    >
      {icon}
    </button>
  );
}