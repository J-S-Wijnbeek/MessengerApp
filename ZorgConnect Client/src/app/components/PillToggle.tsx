import { useState } from "react";

interface PillToggleProps {
  options: [string, string];
  value: string;
  onChange: (value: string) => void;
}

export function PillToggle({ options, value, onChange }: PillToggleProps) {
  return (
    <div className="inline-flex rounded-full border border-gray-300 overflow-hidden">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`flex-1 py-2 px-4 rounded-full font-medium transition-all ${
            value === option
              ? "bg-[#F5A623] text-white"
              : "bg-white text-gray-700"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}