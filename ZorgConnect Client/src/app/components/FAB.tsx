import * as React from "react";
import { Plus } from "lucide-react";
import type { ReactNode } from "react";

interface FABProps {
  onClick?: () => void;
  icon?: ReactNode;
}

export function FAB({ icon, onClick }: FABProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 w-14 h-14 bg-secondary text-secondary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-secondary/90 transition-colors max-w-[390px]"
    >
      {icon ?? <Plus size={28} />}
    </button>
  );
}