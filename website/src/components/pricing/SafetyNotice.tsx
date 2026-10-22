import React from 'react';
import { ShieldAlert, Smartphone } from 'lucide-react';
import { siteConfig } from '../../config/site.config';

export const SafetyNotice: React.FC<{ lang: 'en' | 'bn' }> = ({ lang }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 max-w-3xl mx-auto">
      {/* Zero PIN/OTP Guarantee */}
      <div className="p-4 rounded-xl bg-deleted-bg border border-deleted-border/40 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-deleted-red shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1 text-xs text-text-secondary leading-relaxed">
          <span className="font-semibold text-text-primary">
            {lang === 'bn' ? 'কখনোই পিন বা ওটিপি দিবেন না' : 'Security Advisory: Zero PIN / OTP'}
          </span>
          <span>
            {lang === 'bn'
              ? 'এনসিন কখনোই আপনার বিকাশ/নগদ পিন বা কোনো ওটিপি কোড চাইবে না। পেমেন্ট কেবলমাত্র ট্রানজেকশন আইডি (TrxID) দিয়ে অ্যাপে ভেরিফাই হয়।'
              : 'Nseen never asks for your MFS PIN or SMS OTP. Verification is performed strictly via your unique Transaction ID (TrxID).'}
          </span>
        </div>
      </div>

      {/* One Phone Guarantee */}
      <div className="p-4 rounded-xl glass border border-white/10 flex items-start gap-3">
        <Smartphone className="w-5 h-5 text-emerald shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1 text-xs text-text-secondary leading-relaxed">
          <span className="font-semibold text-text-primary">
            {lang === 'bn' ? '১টি লাইসেন্স = ১টি নিজস্ব ফোন' : '1 License = 1 Physical Device'}
          </span>
          <span>
            {lang === 'bn'
              ? 'ভবিষ্যতে নতুন ফোনে পরিবর্তন করতে চাইলে মূল ট্রানজেকশন আইডি সহ আমাদের ইমেইল করুন।'
              : `Upgrading to a new phone in the future? Email us at ${siteConfig.supportEmail} with your original TrxID to migrate your license.`}
          </span>
        </div>
      </div>
    </div>
  );
};
