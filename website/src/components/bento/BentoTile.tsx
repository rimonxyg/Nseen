import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export interface BentoTileProps {
  id: string;
  title: string;
  tag: string;
  summary: string;
  details: string;
  icon: React.ReactNode;
  colSpan?: string;
}

export const BentoTile: React.FC<BentoTileProps> = ({
  title,
  tag,
  summary,
  details,
  icon,
  colSpan = 'col-span-1',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`glass rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:border-emerald/40 hover:shadow-glass-card group ${colSpan}`}
    >
      <div>
        {/* Top bar with icon and tag */}
        <div className="flex items-center justify-between mb-5">
          <div className="w-12 h-12 rounded-xl bg-emerald/10 border border-emerald/20 flex items-center justify-center text-emerald group-hover:scale-105 transition-transform">
            {icon}
          </div>
          <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-text-secondary">
            {tag}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2 group-hover:text-emerald transition-colors">
          {title}
        </h3>

        {/* Summary */}
        <p className="text-sm text-text-secondary leading-relaxed mb-4">
          {summary}
        </p>

        {/* Expandable Technical Deep-Dive */}
        {isExpanded && (
          <div className="p-3.5 rounded-xl bg-obsidian-subtle/90 border border-emerald/20 text-xs text-text-secondary leading-relaxed mb-4 animate-fade-in">
            <div className="flex items-center gap-1.5 text-emerald font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Architectural Detail</span>
            </div>
            {details}
          </div>
        )}
      </div>

      {/* Expand/Collapse Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald hover:text-[#05dfa8] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald rounded self-start mt-2"
        aria-expanded={isExpanded}
      >
        <span>{isExpanded ? 'Show Less' : 'Learn Technical Mechanism'}</span>
        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};
