import React from 'react';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  className?: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ id, className = '', children, ...props }) => {
  return (
    <section id={id} className={`py-16 sm:py-24 lg:py-32 relative ${className}`} {...props}>
      {children}
    </section>
  );
};

export const Container: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className = '',
  children,
}) => {
  return (
    <div className={`max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
};

