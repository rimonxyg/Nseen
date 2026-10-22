import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  asLink?: boolean;
  href?: string;
  download?: boolean | string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  asLink = false,
  href,
  download,
  className = '',
  children,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-full select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald active:scale-[0.98]";

  const sizeStyles = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base tracking-wide font-semibold",
  };

  const variantStyles = {
    primary: "bg-emerald text-obsidian font-semibold hover:bg-[#05dfa8] hover:shadow-glow-emerald",
    secondary: "bg-obsidian-card text-text-primary border border-obsidian-border hover:border-obsidian-border-hover hover:bg-obsidian-subtle",
    glass: "glass text-text-primary hover:border-emerald/40 hover:text-emerald",
    danger: "bg-deleted-bg text-deleted-red border border-deleted-border hover:bg-deleted-red hover:text-white",
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  if (asLink && href) {
    return (
      <a
        href={href}
        download={download}
        className={combinedClasses}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};
