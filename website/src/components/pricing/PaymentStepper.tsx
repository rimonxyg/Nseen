import React, { useState } from 'react';
import { siteConfig } from '../../config/site.config';
import { Copy, Check, ArrowRight } from 'lucide-react';
import { copyToClipboard } from '../../lib/copyToClipboard';

export const PaymentStepper: React.FC<{ lang: 'en' | 'bn' }> = ({ lang }) => {
  const [gateway, setGateway] = useState<'bkash' | 'nagad' | 'rocket' | 'bank'>('bkash');
  const [copiedNumber, setCopiedNumber] = useState(false);

  const getNumber = () => {
    if (gateway === 'bkash') return siteConfig.mfs.bkash;
    if (gateway === 'nagad') return siteConfig.mfs.nagad;
    if (gateway === 'rocket') return siteConfig.mfs.rocket;
    return undefined;
  };

  const numberToDisplay = getNumber();

  const handleCopy = async () => {
    if (numberToDisplay) {
      await copyToClipboard(numberToDisplay);
      setCopiedNumber(true);
      setTimeout(() => setCopiedNumber(false), 2500);
    }
  };

  const gatewayNames = {
    bkash: 'bKash (বিকাশ)',
    nagad: 'Nagad (নগদ)',
    rocket: 'Rocket (রকেট)',
    bank: 'Bank Card / Transfer',
  };

  return (
    <div className="w-full max-w-3xl mx-auto glass rounded-3xl p-6 sm:p-10 border border-emerald/30 shadow-glass-card mt-10">
      {/* Gateway Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8 pb-6 border-b border-white/10">
        {(['bkash', 'nagad', 'rocket', 'bank'] as const).map((gw) => (
          <button
            key={gw}
            onClick={() => setGateway(gw)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              gateway === gw
                ? 'bg-emerald text-obsidian shadow-glow-subtle'
                : 'glass text-text-secondary hover:text-text-primary'
            }`}
          >
            {gatewayNames[gw]}
          </button>
        ))}
      </div>

      {/* Gateway Details */}
      {gateway === 'bank' ? (
        <div className="p-6 rounded-2xl bg-obsidian-subtle border border-white/5 flex flex-col gap-3 text-sm text-text-secondary">
          <h4 className="text-base font-semibold text-text-primary">
            {lang === 'bn' ? 'ব্যাংক কার্ড বা ডাইরেক্ট ট্রান্সফার' : 'Bank Card & Online Banking Details'}
          </h4>
          <p>
            {lang === 'bn'
              ? 'অ্যাপের ভেতর "Pay with Card / Bank" সিলেক্ট করে যেকোনো ভিসা, মাস্টারকার্ড বা সরাসরি ব্যাংক অ্যাকাউন্ট থেকে ১৫০ টাকা পে করতে পারবেন।'
              : 'Inside the app paywall, tap "Card / Bank" to checkout using Visa, Mastercard, or local internet banking directly through our secure payment gateway.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Step 1: Number Copy Box */}
          <div className="p-5 rounded-2xl bg-obsidian-subtle border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase font-mono text-emerald tracking-wider font-semibold">
                Official {gateway.toUpperCase()} Number
              </span>
              <span className="text-xl sm:text-2xl font-mono font-bold text-text-primary">
                {numberToDisplay || "Payment details are shown inside the app"}
              </span>
              <span className="text-xs text-text-tertiary">
                Send Money (Personal / Merchant) • Amount: 150 BDT
              </span>
            </div>

            {numberToDisplay && (
              <button
                onClick={handleCopy}
                className="px-4 py-2.5 rounded-full bg-emerald text-obsidian text-xs font-semibold flex items-center gap-2 hover:bg-[#05dfa8] transition-colors shadow-glow-subtle shrink-0"
              >
                {copiedNumber ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedNumber ? 'Copied Number!' : 'Copy Number'}</span>
              </button>
            )}
          </div>

          {/* Step Sequence */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-xl glass border border-white/5 flex flex-col gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald/20 text-emerald font-mono font-bold text-xs flex items-center justify-center">1</span>
              <h5 className="text-sm font-semibold text-text-primary">Send Money</h5>
              <p className="text-xs text-text-secondary leading-relaxed">
                Send 150 BDT to the number above from your {gateway.toUpperCase()} app.
              </p>
            </div>

            <div className="p-4 rounded-xl glass border border-white/5 flex flex-col gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald/20 text-emerald font-mono font-bold text-xs flex items-center justify-center">2</span>
              <h5 className="text-sm font-semibold text-text-primary">Copy TrxID</h5>
              <p className="text-xs text-text-secondary leading-relaxed">
                Copy the 8-10 character Transaction ID received in your confirmation SMS.
              </p>
            </div>

            <div className="p-4 rounded-xl glass border border-white/5 flex flex-col gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald/20 text-emerald font-mono font-bold text-xs flex items-center justify-center">3</span>
              <h5 className="text-sm font-semibold text-text-primary">Unlock in App</h5>
              <p className="text-xs text-text-secondary leading-relaxed">
                Open Nseen on your phone, paste TrxID, and lifetime access unlocks instantly!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Next Step Callout */}
      <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-secondary">
        <span>Haven't installed the app yet?</span>
        <a
          href="#download"
          className="inline-flex items-center gap-1.5 text-emerald font-semibold hover:underline"
        >
          <span>Download Nseen APK first</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};

