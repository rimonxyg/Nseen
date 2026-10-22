import React from 'react';
import releaseInfo from '../../data/release.json';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC<{ lang: 'en' | 'bn' }> = ({ lang }) => {
  return (
    <footer className="border-t border-obsidian-border bg-obsidian-subtle py-16 sm:py-20 relative overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/5">
          {/* Brand Info */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald/20 border border-emerald flex items-center justify-center font-bold text-emerald">
                N
              </div>
              <span className="font-semibold text-lg text-text-primary">Nseen Technologies</span>
            </div>
            <p className="text-sm text-text-secondary max-w-md leading-relaxed">
              {lang === 'bn'
                ? 'এনসিন সম্পূর্ণ ডিভাইসে সংরক্ষিত অফলাইন নোটিফিকেশন ভল্ট। কোনো চ্যাট সার্ভারে পাঠানো হয় না এবং কোনো বিজ্ঞাপন নেই।'
                : 'Nseen is a zero-leakage, 100% on-device notification vault engineered in Bangladesh. No tracking, no ads, no cloud leakage.'}
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald mt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Release: v{releaseInfo.version} (SHA-256 Verified)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase font-mono tracking-wider text-text-tertiary">Product</span>
            <a href="#features" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Core Features</a>
            <a href="#download" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Direct APK Download</a>
            <a href="#install" className="text-sm text-text-secondary hover:text-text-primary transition-colors">OEM Install Guide</a>
            <a href="#pricing" className="text-sm text-text-secondary hover:text-text-primary transition-colors">150 BDT Lifetime</a>
            <a href="#labs" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Future Labs & Key</a>
          </div>

          {/* Legal & Privacy */}
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase font-mono tracking-wider text-text-tertiary">Trust & Ethics</span>
            <a href="#faq" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Frequently Asked Questions</a>
            <span className="text-sm text-text-secondary">Zero-Tracking Guarantee</span>
            <span className="text-sm text-text-secondary">Local SQLite Storage Only</span>
            <a href="mailto:support@nseen.app" className="text-sm text-emerald hover:underline">support@nseen.app</a>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-tertiary">
          <p>© {new Date().getFullYear()} Nseen Technologies. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span>Engineered with zero-trust privacy for Android</span>
            <Heart className="w-3.5 h-3.5 text-deleted-red inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
