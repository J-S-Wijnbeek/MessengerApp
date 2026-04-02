interface SectionBarProps {
  title: string;
  onClick?: () => void;
}

export function SectionBar({ title, onClick }: SectionBarProps) {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="zc-sectionbar w-full bg-primary text-primary-foreground font-bold text-center py-2 px-4 hover:opacity-95 active:opacity-90 transition-opacity"
      >
        {title}
      </button>
    );
  }

  return (
    <div className="zc-sectionbar bg-primary text-primary-foreground font-bold text-center py-2 px-4">
      {title}
    </div>
  );
}