import React, { useState, useEffect } from 'react';
import { DeletedBadge } from './DeletedBadge';
import { MessageSquare, ShieldCheck, CheckCheck } from 'lucide-react';

export const MessageSequence: React.FC = () => {
  // Cycle stages:
  // 0: Initial message arrives
  // 1: Sender deletes it (WhatsApp placeholder)
  // 2: Nseen reveals original text with DELETED badge
  const [stage, setStage] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    // Check if user prefers reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setStage(2); // Always show final revealed frame
      return;
    }

    const timer = setInterval(() => {
      setStage((prev) => {
        if (prev === 0) return 1;
        if (prev === 1) return 2;
        return 0;
      });
    }, 2800);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col gap-3.5 p-4 rounded-2xl bg-obsidian-subtle/80 border border-white/5 shadow-inner">
      {/* Sender Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald/20 border border-emerald/30 flex items-center justify-center text-xs font-bold text-emerald">
            RM
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-text-primary">Rimon (WhatsApp)</span>
            <span className="text-[10px] text-text-tertiary">Active now</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono text-emerald bg-emerald-subtle px-2 py-0.5 rounded-full border border-emerald/20">
          <ShieldCheck className="w-3 h-3" />
          <span>Intercepted</span>
        </div>
      </div>

      {/* Message 1 (Context) */}
      <div className="self-start max-w-[85%] rounded-2xl rounded-tl-sm bg-[#1f2429] p-3 text-xs text-text-primary shadow-sm">
        Hey! Where are you right now? Let's meet up today!
        <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-text-tertiary">
          <span>04:14 PM</span>
          <CheckCheck className="w-3 h-3 text-emerald" />
        </div>
      </div>

      {/* Message 2 (The Deleted / Recovered Message) */}
      <div className="self-start max-w-[90%] transition-all duration-300">
        {stage === 0 && (
          <div className="rounded-2xl rounded-tl-sm bg-[#1f2429] p-3 text-xs text-text-primary border border-white/5 shadow-sm animate-fade-in">
            <p className="font-medium text-emerald-text">
              "Check this secret document before they take it down!"
            </p>
            <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/5 text-[10px] text-text-tertiary">
              <span className="text-emerald">Captured by Nseen</span>
              <span>04:15 PM</span>
            </div>
          </div>
        )}

        {stage === 1 && (
          <div className="rounded-2xl rounded-tl-sm bg-obsidian-card p-3 text-xs text-text-tertiary italic border border-white/5 flex items-center gap-2 animate-fade-in">
            <MessageSquare className="w-3.5 h-3.5 text-text-tertiary" />
            <span>This message was deleted by the sender.</span>
          </div>
        )}

        {stage === 2 && (
          <div className="rounded-2xl rounded-tl-sm bg-obsidian-card p-3.5 text-xs text-text-primary border border-deleted-border/40 shadow-glow-subtle animate-fade-in relative overflow-hidden">
            <div className="flex items-center justify-between mb-1.5">
              <DeletedBadge />
              <span className="text-[10px] text-text-tertiary">Deleted at 04:16 PM</span>
            </div>
            <p className="font-semibold text-text-primary text-[13px] leading-relaxed">
              "Check this secret document before they take it down!"
            </p>
            <div className="flex items-center justify-between mt-2.5 pt-1.5 border-t border-white/5 text-[10px]">
              <span className="text-emerald font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Recovered Offline
              </span>
              <span className="text-text-tertiary">Preserved forever</span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Helper Hint */}
      <div className="text-center pt-1 text-[11px] text-text-secondary">
        {stage === 0 && "① Sender sends private message..."}
        {stage === 1 && "② Sender deletes message for everyone..."}
        {stage === 2 && "③ Nseen catches and displays it permanently in red!"}
      </div>
    </div>
  );
};
