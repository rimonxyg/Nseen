import React, { useState, useEffect } from 'react';
import { oemGuides, OemGuide } from '../../data/oem-guides';
import { GuideStep } from './GuideStep';
import { PermissionCards } from './PermissionCards';
import { SegmentedControl } from '../ui/SegmentedControl';
import { detectPlatform } from '../../lib/detectPlatform';
import { HelpCircle, Mail } from 'lucide-react';
import { siteConfig } from '../../config/site.config';

export const OemSwitcher: React.FC<{ lang: 'en' | 'bn' }> = ({ lang }) => {
  const platform = detectPlatform();
  const [selectedBrand, setSelectedBrand] = useState<'samsung' | 'stock' | 'xiaomi' | 'vivo'>('samsung');

  useEffect(() => {
    // Check URL hash first
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('install=')) {
      const brand = hash.split('install=')[1] as 'samsung' | 'stock' | 'xiaomi' | 'vivo';
      if (['samsung', 'stock', 'xiaomi', 'vivo'].includes(brand)) {
        setSelectedBrand(brand);
        return;
      }
    }

    // Fallback to auto-detected OEM brand
    if (platform.isAndroid && platform.detectedBrand) {
      setSelectedBrand(platform.detectedBrand);
    }
  }, [platform.isAndroid, platform.detectedBrand]);

  const handleBrandChange = (brand: 'samsung' | 'stock' | 'xiaomi' | 'vivo') => {
    setSelectedBrand(brand);
    window.history.replaceState(null, '', `#install=${brand}`);
  };

  const currentGuide: OemGuide = oemGuides.find((g) => g.id === selectedBrand) || oemGuides[0];

  const brandOptions = [
    { value: 'samsung' as const, label: 'Samsung (OneUI)' },
    { value: 'stock' as const, label: 'Nothing / Pixel' },
    { value: 'xiaomi' as const, label: 'Xiaomi (HyperOS)' },
    { value: 'vivo' as const, label: 'Vivo / Realme / Oppo' },
  ];

  return (
    <section id="install" className="py-20 sm:py-28 relative">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-semibold tracking-wider text-emerald uppercase mb-3 inline-block">
            {lang === 'bn' ? 'সহজ ইন্সটলেশন গাইড' : 'OEM INSTALLATION ASSISTANT'}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary mb-4">
            {lang === 'bn' ? 'যেকোনো অ্যান্ড্রয়েড ফোনে সহজে চালু করুন' : 'Bypass Blocks & Install in 60 Seconds'}
          </h2>
          <p className="text-base text-text-secondary">
            {lang === 'bn'
              ? 'আপনার ফোনের ব্র্যান্ড অনুযায়ী নিচের ৩টি সহজ ধাপ অনুসরণ করুন।'
              : 'Select your phone model below for an exact 3-step visual walkthrough.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10 overflow-x-auto pb-2">
          <SegmentedControl
            options={brandOptions}
            value={selectedBrand}
            onChange={handleBrandChange}
          />
        </div>

        {/* Active Guide Content */}
        <div className="max-w-3xl mx-auto">
          {/* Headline & OS Pill */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 p-4 rounded-xl glass border border-white/5">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                {currentGuide.headline}
              </h3>
              <span className="text-xs font-mono text-emerald">
                Optimized for {currentGuide.osName}
              </span>
            </div>
            {selectedBrand === platform.detectedBrand && platform.isAndroid && (
              <span className="text-[11px] font-mono text-emerald bg-emerald-subtle border border-emerald/30 px-3 py-1 rounded-full self-start sm:self-auto">
                ✓ Detected Phone
              </span>
            )}
          </div>

          {/* 3 Step Cards */}
          <div className="flex flex-col gap-4">
            {currentGuide.steps.map((step) => (
              <GuideStep
                key={step.step}
                step={step.step}
                title={step.title}
                body={step.body}
                badge={step.badge}
              />
            ))}
          </div>

          {/* Brand-Specific Footnote */}
          <div className="mt-6 p-4 rounded-xl bg-obsidian-subtle border border-white/5 text-xs text-text-secondary leading-relaxed">
            <span className="font-semibold text-text-primary">Note: </span>
            {currentGuide.troubleshootNote}
          </div>

          {/* Core System Permissions Card */}
          <PermissionCards />

          {/* Still Need Help? */}
          <div className="mt-10 p-6 rounded-2xl glass border border-white/5 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <HelpCircle className="w-8 h-8 text-emerald shrink-0" />
              <div>
                <h5 className="text-sm font-semibold text-text-primary">Still encountering an installation issue?</h5>
                <p className="text-xs text-text-secondary">Our technical team responds within 2 hours to help you set up.</p>
              </div>
            </div>
            <a
              href={`mailto:${siteConfig.supportEmail}?subject=Nseen%20Installation%20Assistance`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass hover:border-emerald text-xs font-medium text-text-primary hover:text-emerald transition-colors shrink-0"
            >
              <Mail className="w-4 h-4 text-emerald" />
              <span>Contact Support</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

