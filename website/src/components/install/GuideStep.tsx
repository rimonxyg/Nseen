import React from 'react';

export interface GuideStepProps {
  step: number;
  title: string;
  body: string;
  badge?: string;
}

export const GuideStep: React.FC<GuideStepProps> = ({ step, title, body, badge }) => {
  return (
    <div className="flex gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl glass border border-white/5 hover:border-emerald/30 transition-colors">
      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-emerald/15 border border-emerald/40 text-emerald font-mono font-bold text-base sm:text-lg flex items-center justify-center shrink-0">
        0{step}
      </div>

      <div className="flex flex-col gap-1.5 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-base sm:text-lg font-semibold text-text-primary">
            {title}
          </h4>
          {badge && (
            <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full bg-deleted-bg text-deleted-red border border-deleted-border/40 font-bold">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          {body}
        </p>
      </div>
    </div>
  );
};
