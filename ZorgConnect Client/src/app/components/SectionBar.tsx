interface SectionBarProps {
  title: string;
}

export function SectionBar({ title }: SectionBarProps) {
  return (
    <div className="zc-sectionbar bg-primary text-primary-foreground font-bold text-center py-2 px-4">
      {title}
    </div>
  );
}