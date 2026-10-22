import React from 'react';

export interface PillProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'deleted' | 'neutral' | 'glass';
  className?: string;
}

export const Pill: React.FC<PillProps> = ({
  children,
  variant = 'glass',
  className = '',
}) => {
  const variantStyles = {
    emerald: "bg-emerald-subtle text-emerald border border-emerald/30",
    deleted: "bg-deleted-bg text-deleted-red border border-deleted-border font-bold uppercase tracking-wider",
    neutral: "bg-white/5 text-text-secondary border border-white/10",
    glass: "glass-pill text-text-primary",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

