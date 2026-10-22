import React, { useEffect } from 'react';
import { X, ShieldCheck, Download, HelpCircle, CreditCard, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export interface MobileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'bn';
  onToggleLang: () => void;
}

export const MobileSheet: React.FC<MobileSheetProps> = ({
  isOpen,
  onClose,
  lang,
  onToggleLang,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
      className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full glass-strong rounded-t-3xl border-t border-obsidian-border p-6 sm:p-8 flex flex-col gap-6 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald/20 border border-emerald flex items-center justify-center font-bold text-emerald">
              N
            </span>
            <span className="font-semibold text-lg text-text-primary">Nseen Pro</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Menu"
            className="p-2 rounded-full glass hover:bg-white/10 text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-3">
          <a
            href="#features"
            onClick={onClose}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-text-primary font-medium"
          >
            <ShieldCheck className="w-5 h-5 text-emerald" />
            <span>{lang === 'bn' ? 'ফিচারসমূহ' : 'Core Features'}</span>
          </a>
          <a
            href="#install"
            onClick={onClose}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-text-primary font-medium"
          >
            <HelpCircle className="w-5 h-5 text-emerald" />
            <span>{lang === 'bn' ? 'ইন্সটলেশন গাইড' : 'Install Guide'}</span>
          </a>
          <a
            href="#pricing"
            onClick={onClose}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-text-primary font-medium"
          >
            <CreditCard className="w-5 h-5 text-emerald" />
            <span>{lang === 'bn' ? '১৫০ ৳ সাবস্ক্রিপশন' : '150 BDT Lifetime'}</span>
          </a>
          <a
            href="#labs"
            onClick={onClose}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-text-primary font-medium"
          >
            <Sparkles className="w-5 h-5 text-emerald" />
            <span>{lang === 'bn' ? 'ফিউচার ল্যাবস' : 'Future Labs'}</span>
          </a>
        </nav>

        <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
          <button
            onClick={() => {
              onToggleLang();
              onClose();
            }}
            className="py-3 px-4 rounded-xl glass text-center text-sm font-medium text-text-secondary hover:text-text-primary"
          >
            {lang === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন (Bengali)'}
          </button>
          <Button
            asLink
            href="#download"
            size="lg"
            variant="primary"
            className="w-full flex items-center justify-center gap-2"
            onClick={onClose}
          >
            <Download className="w-5 h-5" />
            <span>{lang === 'bn' ? 'ডাউনলোড v1.2.1 Pro' : 'Download v1.2.1 Pro'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

