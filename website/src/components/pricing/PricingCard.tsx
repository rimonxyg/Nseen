import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { PaymentStepper } from './PaymentStepper';
import { SafetyNotice } from './SafetyNotice';
import { Check, Sparkles } from 'lucide-react';
import { copy } from '../../data/copy';

export const PricingCard: React.FC<{ lang: 'en' | 'bn'; onToggleLang: () => void }> = ({
  lang,
  onToggleLang,
}) => {
  const t = copy[lang].pricing;
  const [showGuide, setShowGuide] = useState(false);

  return (
    <section id="pricing" className="py-20 sm:py-28 relative">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono font-semibold tracking-wider text-emerald uppercase mb-3 inline-block">
            {t.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary mb-4">
            {t.title}
          </h2>
          <p className="text-base text-text-secondary">
            {t.subtitle}
          </p>

          <button
            onClick={onToggleLang}
            className="mt-4 px-4 py-1.5 rounded-full glass hover:bg-white/10 text-xs font-medium text-emerald border border-emerald/30 inline-flex items-center gap-1.5"
          >
            <span>{t.bengaliToggle}</span>
          </button>
        </div>

        {/* Pricing Main Hero Card */}
        <div className="max-w-xl mx-auto glass-strong rounded-3xl p-8 sm:p-12 border-2 border-emerald/50 shadow-glow-emerald relative overflow-hidden">
          {/* Top Banner Tag */}
          <div className="absolute top-0 right-0 bg-emerald text-obsidian px-6 py-1.5 rounded-bl-2xl font-mono text-xs font-bold uppercase tracking-wider shadow-md">
            LIFETIME PASS
          </div>

          <div className="flex flex-col items-center gap-2 mb-8 mt-2">
            <span className="text-sm font-mono text-emerald tracking-wider uppercase font-semibold">
              One-Time Payment
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-7xl font-extrabold text-text-primary tracking-tight">
                {t.price} ৳
              </span>
              <span className="text-sm text-text-tertiary font-mono">
                / device forever
              </span>
            </div>
            <span className="text-xs text-text-secondary">
              Zero monthly fees • Zero advertisements • Zero cloud tracking
            </span>
          </div>

          {/* Feature Checklist */}
          <div className="flex flex-col gap-3.5 text-left mb-8 pb-8 border-y border-white/10">
            {t.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald/15 border border-emerald/40 text-emerald flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => setShowGuide(!showGuide)}
              size="lg"
              variant="primary"
              className="w-full py-4 text-base font-bold shadow-glow-subtle flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>{showGuide ? 'Hide Payment Guide' : t.howToPay}</span>
            </Button>

            <span className="text-[11px] text-text-tertiary">
              Accepted: bKash • Nagad • Rocket • Visa • Mastercard
            </span>
          </div>
        </div>

        {/* Expandable Payment Stepper */}
        {showGuide && (
          <div className="animate-fade-in">
            <PaymentStepper lang={lang} />
          </div>
        )}

        {/* Safety & Anti-Fraud Advisory */}
        <SafetyNotice lang={lang} />
      </div>
    </section>
  );
};
