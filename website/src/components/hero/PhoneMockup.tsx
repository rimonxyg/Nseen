import React from 'react';
import { MessageSequence } from './MessageSequence';
import { Wifi, BatteryMedium, ShieldAlert } from 'lucide-react';

export const PhoneMockup: React.FC = () => {
  return (
    <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[380px] select-none">
      {/* Outer ambient glow */}
      <div className="absolute -inset-1.5 bg-gradient-to-b from-emerald/30 to-transparent rounded-[44px] blur-xl opacity-70" />

      {/* Titanium phone outer frame */}
      <div className="relative rounded-[40px] p-3.5 bg-[#121417] border-2 border-[#2b3036] shadow-2xl">
        {/* Screen Bezel */}
        <div className="relative rounded-[32px] overflow-hidden bg-obsidian border border-black p-4 flex flex-col min-h-[520px]">
          {/* Top Notch / Camera Cutout & Status Bar */}
          <div className="flex items-center justify-between px-2 pt-1 pb-3 text-text-tertiary text-[11px] font-mono">
            <span>04:16</span>
            {/* Center Dynamic Island / Notch */}
            <div className="w-20 h-4 bg-black rounded-full border border-white/10 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald/60" />
            </div>
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5" />
              <BatteryMedium className="w-3.5 h-3.5 text-emerald" />
            </div>
          </div>

          {/* App Topbar */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-emerald/20 text-emerald flex items-center justify-center font-bold text-xs">
                N
              </span>
              <span className="text-xs font-bold text-text-primary uppercase tracking-wide">
                Nseen Vault
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-deleted-red bg-deleted-bg px-2 py-0.5 rounded-full border border-deleted-border/40">
              <ShieldAlert className="w-3 h-3" />
              <span>1 Deleted Found</span>
            </div>
          </div>

          {/* Chat Sequence Display */}
          <div className="flex-1 flex flex-col justify-center">
            <MessageSequence />
          </div>

          {/* Bottom Nav Mockup Indicator */}
          <div className="pt-3 mt-auto flex items-center justify-center">
            <div className="w-32 h-1 bg-white/20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
