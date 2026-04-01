interface TealHeaderProps {
  title: string;
  subtitle?: string;
  rightIcon?: React.ReactNode;
}

export function TealHeader({ title, subtitle, rightIcon }: TealHeaderProps) {
  return (
    <div className="bg-[#1DC6B4] text-white text-center py-4 px-4 flex items-center justify-center relative">
      <div>
        <h1 className="font-bold text-lg">{title}</h1>
        {subtitle && <div className="text-sm opacity-90 mt-1">{subtitle}</div>}
      </div>
      {rightIcon && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {rightIcon}
        </div>
      )}
    </div>
  );
}