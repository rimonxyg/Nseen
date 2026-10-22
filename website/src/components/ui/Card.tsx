import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid' | 'glow';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'glass',
  className = '',
  children,
  ...props
}) => {
  const variantStyles = {
    glass: "glass shadow-glass-card rounded-2xl transition-all duration-300 hover:border-obsidian-border-hover",
    solid: "bg-obsidian-card border border-obsidian-border rounded-2xl",
    glow: "glass shadow-glass-card border-emerald/20 hover:border-emerald/50 rounded-2xl transition-all duration-300 hover:shadow-glow-emerald",
  };

  return (
    <div className={`p-6 sm:p-8 ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

