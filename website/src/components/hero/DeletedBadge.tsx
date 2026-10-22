import React from 'react';

export const DeletedBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-deleted-bg border border-deleted-border text-deleted-red text-[11px] font-bold tracking-wider uppercase ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-deleted-red animate-pulse" />
      <span>DELETED</span>
    </span>
  );
};

