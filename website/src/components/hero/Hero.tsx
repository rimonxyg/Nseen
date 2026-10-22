import React from 'react';
import { Button } from '../ui/Button';
import { PhoneMockup } from './PhoneMockup';
import { Download, HelpCircle, ShieldCheck, Cpu, Smartphone } from 'lucide-react';
import { copy } from '../../data/copy';
import releaseInfo from '../../data/release.json';

export const Hero: React.FC<{ lang: 'en' | 'bn' }> = ({ lang }) => {
  const t = copy[lang].hero;

  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 overflow-hidden">
      {/* Background Radial Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[700px] pointer-events-none -z-10"
        style={{ background: 'var(--hero-glow)' }}
      />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Copy & CTA */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass border border-emerald/30 shadow-glow-subtle">
              <span className="w-2 h-2 rounded-full bg-emerald animate-ping" />
              <span className="text-xs font-mono font-semibold tracking-wider text-emerald uppercase">
                {t.eyebrow}
              </span>
            </div>

            {/* Main Display Title */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-text-primary leading-[1.08]">
              {lang === 'bn' ? (
                <>
                  মুছে ফেলা বার্তা <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald to-[#05dfa8]">
                    আর কখনোই হারাবে না।
                  </span>
                </>
              ) : (
                <>
                  Never miss a <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald to-[#05dfa8]">
                    deleted message
                  </span>{" "}
                  again.
                </>
              )}
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-xl">
              {t.subtext}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto pt-2">
              <Button
                asLink
                href="#download"
                size="lg"
                variant="primary"
                className="gap-2.5 shadow-glow-emerald"
              >
                <Download className="w-5 h-5" />
                <span>{t.primaryCta}</span>
              </Button>

              <Button
                asLink
                href="#install"
                size="lg"
                variant="secondary"
                className="gap-2"
              >
                <HelpCircle className="w-5 h-5 text-emerald" />
                <span>{t.secondaryCta}</span>
              </Button>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-text-secondary border-t border-white/5 w-full">
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald" />
                <span>100% On-Device Storage</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Cpu className="w-4 h-4 text-emerald" />
                <span>Widevine DRM Hardware Locked</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Smartphone className="w-4 h-4 text-emerald" />
                <span>APK: v{releaseInfo.version}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Phone Mockup */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
};

