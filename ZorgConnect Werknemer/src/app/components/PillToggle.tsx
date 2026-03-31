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
          className={`px-6 py-2 text-sm font-medium transition-colors ${
            value === option
              ? "bg-[#1DC6B4] text-white"
              : "bg-white text-gray-700"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
