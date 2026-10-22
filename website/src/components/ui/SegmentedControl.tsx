
export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  badge?: string;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = '',
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      className={`inline-flex p-1.5 glass rounded-full border border-obsidian-border gap-1 overflow-x-auto max-w-full ${className}`}
    >
      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(opt.value)}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald ${
              isSelected
                ? 'bg-emerald text-obsidian font-semibold shadow-glow-subtle'
                : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
            }`}
          >
            {opt.label}
            {opt.badge && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold ${
                  isSelected ? 'bg-obsidian/20 text-obsidian' : 'bg-emerald-subtle text-emerald'
                }`}
              >
                {opt.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
