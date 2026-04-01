interface SectionBarProps {
  title: string;
}

export function SectionBar({ title }: SectionBarProps) {
  return (
    <div className="bg-[#1DC6B4] text-white font-bold text-center py-2 px-4">
      {title}
    </div>
  );
}
