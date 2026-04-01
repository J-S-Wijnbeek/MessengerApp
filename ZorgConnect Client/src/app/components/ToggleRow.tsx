interface ToggleRowProps {
  label: string;
  description?: string;
  value: boolean;
  onChange: (next: boolean) => void;
}

export function ToggleRow({ label, description, value, onChange }: ToggleRowProps) {
  return (
    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
      <div className="flex flex-col w-3/4">
        <span className="text-gray-900">{label}</span>
        {description && (
          <span className="text-xs text-gray-500">
            {description}
          </span>
        )}
      </div>
      <button
        type="button"
        aria-label={`Toggle ${label}`}
        aria-pressed={value}
        onClick={() => onChange(!value)}
        className={`w-12 h-7 rounded-full transition-colors ${
          value ? "bg-[#F5A623]" : "bg-gray-300"
        }`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full transition-transform ${
            value ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

