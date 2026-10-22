import React from 'react';
import { Button } from '../ui/Button';
import { copy } from '../../data/copy';
import { siteConfig } from '../../config/site.config';
import { Cpu, Mail } from 'lucide-react';

export const HardwareTeaser: React.FC<{ lang: 'en' | 'bn' }> = ({ lang }) => {
  const t = copy[lang].labs.hardwareTeaser;

  return (
    <div className="mt-12 glass-strong rounded-3xl p-8 sm:p-12 border border-white/10 relative overflow-hidden">
      {/* Background Subtle Hardware Circuit Lines (SVG) */}
      <svg
        className="absolute top-0 right-0 w-96 h-96 opacity-10 pointer-events-none -z-0"
        viewBox="0 0 200 200"
        fill="none"
        stroke="#00c896"
        strokeWidth="1.5"
      >
        <path d="M20 20h60v40h40v60h60" />
        <circle cx="80" cy="60" r="4" fill="#00c896" />
        <circle cx="120" cy="120" r="4" fill="#00c896" />
        <rect x="130" y="130" width="40" height="40" rx="8" />
      </svg>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Copy */}
        <div className="lg:col-span-8 flex flex-col gap-4 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-subtle border border-emerald/30 text-emerald text-xs font-mono font-semibold self-start">
            <Cpu className="w-3.5 h-3.5" />
            <span>HYBRID HARDWARE + SOFTWARE INITIATIVE</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-text-primary">
            {t.title}
          </h3>

          <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-2xl">
            {t.desc}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
            <Button
              asLink
              href={siteConfig.labsContactUrl}
              size="md"
              variant="primary"
              className="gap-2 shadow-glow-subtle"
            >
              <Mail className="w-4 h-4" />
              <span>{t.cta}</span>
            </Button>
            <span className="text-[11px] text-text-tertiary">
              {t.disclaimer}
            </span>
          </div>
        </div>

        {/* Right Line-Art Device Conceptual SVG Mockup */}
        <div className="lg:col-span-4 flex justify-center">
          <div className="w-48 h-48 rounded-2xl glass border border-emerald/40 p-4 flex flex-col items-center justify-center gap-3 shadow-glow-subtle relative group hover:scale-105 transition-transform">
            <div className="w-20 h-20 rounded-xl bg-obsidian-subtle border border-emerald/30 flex items-center justify-center relative">
              <Cpu className="w-10 h-10 text-emerald animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald shadow-glow-emerald" />
            </div>
            <div className="text-center">
              <span className="text-xs font-mono font-bold text-text-primary block">
                Nseen Security Key
              </span>
              <span className="text-[10px] font-mono text-emerald">
                NFC • Hardware Fused
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
