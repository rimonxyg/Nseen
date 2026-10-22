import React, { useState } from 'react';
import { faqs } from '../../data/faq';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FaqSection: React.FC<{ lang: 'en' | 'bn' }> = ({ lang }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section id="faq" className="py-20 sm:py-28 relative">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono font-semibold tracking-wider text-emerald uppercase mb-3 inline-block">
            {lang === 'bn' ? 'সাধারণ প্রশ্ন ও উত্তর' : 'QUESTIONS & ANSWERS'}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary mb-4">
            {lang === 'bn' ? 'আপনার মনে থাকা সকল প্রশ্নের উত্তর' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-base text-text-secondary">
            {lang === 'bn'
              ? 'এনসিনের প্রাইভেসি, পারমিশন ও পেমেন্ট নিয়ে স্পষ্ট ধারণা পেতে পড়ুন।'
              : 'Clear answers on security, offline architecture, and our lifetime license.'}
          </p>
        </div>

        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="glass rounded-2xl border border-white/5 overflow-hidden transition-colors hover:border-emerald/30"
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-semibold text-text-primary">
                    {faq.question}
                  </span>
                  <div className="w-8 h-8 rounded-full glass flex items-center justify-center shrink-0 text-emerald">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-sm text-text-secondary leading-relaxed border-t border-white/5 pt-4 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
