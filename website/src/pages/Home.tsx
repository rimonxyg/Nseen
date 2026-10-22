import React from 'react';
import { Hero } from '../components/hero/Hero';
import { BentoGrid } from '../components/bento/BentoGrid';
import { DownloadCard } from '../components/download/DownloadCard';
import { OemSwitcher } from '../components/install/OemSwitcher';
import { PricingCard } from '../components/pricing/PricingCard';
import { Timeline } from '../components/labs/Timeline';
import { HardwareTeaser } from '../components/labs/HardwareTeaser';
import { FaqSection } from '../components/faq/FaqSection';
import { copy } from '../data/copy';

export const Home: React.FC<{ lang: 'en' | 'bn'; onToggleLang: () => void }> = ({
  lang,
  onToggleLang,
}) => {
  const tLabs = copy[lang].labs;

  return (
    <main id="main-content" className="flex flex-col">
      {/* 1. Hero Presentation */}
      <Hero lang={lang} />

      {/* 2. Bento Grid 6-Tile Innovation Architecture */}
      <BentoGrid lang={lang} />

      {/* 3. Direct APK Download Card & Checksum */}
      <DownloadCard lang={lang} />

      {/* 4. Multi-Brand OEM Installation Guide */}
      <OemSwitcher lang={lang} />

      {/* 5. 150 BDT Lifetime Pricing & MFS Checkout */}
      <PricingCard lang={lang} onToggleLang={onToggleLang} />

      {/* 6. Future Labs & Hybrid Hardware Roadmap */}
      <section id="labs" className="py-20 sm:py-28 relative">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-semibold tracking-wider text-emerald uppercase mb-3 inline-block">
              {tLabs.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary mb-4">
              {tLabs.title}
            </h2>
            <p className="text-base text-text-secondary">
              {tLabs.subtitle}
            </p>
          </div>

          <Timeline lang={lang} />
          <HardwareTeaser lang={lang} />
        </div>
      </section>

      {/* 7. Comprehensive FAQ */}
      <FaqSection lang={lang} />
    </main>
  );
};
