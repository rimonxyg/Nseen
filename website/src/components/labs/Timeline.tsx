import React from 'react';
import { copy } from '../../data/copy';

export const Timeline: React.FC<{ lang: 'en' | 'bn' }> = ({ lang }) => {
  const items = copy[lang].labs.timeline;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="glass rounded-2xl p-6 sm:p-7 border border-white/5 relative flex flex-col justify-between hover:border-emerald/40 transition-colors"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-emerald uppercase tracking-wider">
                {item.phase}
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                  item.status === 'Live Now' || item.status === 'লাইভ আছে'
                    ? 'bg-emerald-subtle text-emerald border border-emerald/30'
                    : 'bg-white/5 text-text-tertiary border border-white/10'
                }`}
              >
                {item.status}
              </span>
            </div>

            <h4 className="text-base sm:text-lg font-semibold text-text-primary mb-2">
              {item.title}
            </h4>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              {item.desc}
            </p>
          </div>

          <div className="pt-6 mt-4 border-t border-white/5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald" />
            <span className="text-[10px] font-mono text-text-tertiary">Offline Engineering</span>
          </div>
        </div>
      ))}
    </div>
  );
};

