interface SectionBarProps {
  title: string;
}

export function SectionBar({ title }: SectionBarProps) {
  return (
    <div className="bg-[#F5A623] text-white font-bold text-center py-2 px-4">
      {title}
    </div>
  );
}