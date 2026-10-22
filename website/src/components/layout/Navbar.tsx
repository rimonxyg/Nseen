import React, { useState, useEffect } from 'react';
import { Menu, Download, Globe } from 'lucide-react';
import { Button } from '../ui/Button';
import { MobileSheet } from './MobileSheet';

export interface NavbarProps {
  lang: 'en' | 'bn';
  onToggleLang: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ lang, onToggleLang }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 40);

      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setIsVisible(false); // Hide on scroll down
      } else {
        setIsVisible(true); // Show on scroll up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${isScrolled ? 'glass py-3 border-b border-obsidian-border' : 'bg-transparent py-5'}`}
      >
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-emerald/15 border border-emerald/40 flex items-center justify-center font-bold text-emerald shadow-glow-subtle group-hover:border-emerald transition-colors">
              N
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-base sm:text-lg tracking-tight text-text-primary">
                Nseen
              </span>
              <span className="text-[10px] tracking-widest uppercase font-mono text-emerald">
                Pro 150৳
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
            <a href="#features" className="hover:text-text-primary transition-colors">
              {lang === 'bn' ? 'ফিচারসমূহ' : 'Features'}
            </a>
            <a href="#install" className="hover:text-text-primary transition-colors">
              {lang === 'bn' ? 'ইন্সটল গাইড' : 'Install Guide'}
            </a>
            <a href="#pricing" className="hover:text-text-primary transition-colors">
              {lang === 'bn' ? '১৫০ ৳ সাবস্ক্রিপশন' : '150 BDT Lifetime'}
            </a>
            <a href="#labs" className="hover:text-text-primary transition-colors">
              {lang === 'bn' ? 'ল্যাবস' : 'Labs'}
            </a>
            <a href="#faq" className="hover:text-text-primary transition-colors">
              {lang === 'bn' ? 'প্রশ্নোত্তর' : 'FAQ'}
            </a>
          </nav>

          {/* Actions: Lang toggle + Download CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onToggleLang}
              className="px-3 py-1.5 rounded-full glass hover:bg-white/10 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            <Button
              asLink
              href="#download"
              size="sm"
              variant="primary"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{lang === 'bn' ? 'ডাউনলোড' : 'Download v1.2.1'}</span>
            </Button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onToggleLang}
              className="p-2 rounded-full glass text-xs font-medium text-text-secondary"
              aria-label="Toggle language"
            >
              {lang === 'bn' ? 'EN' : 'বাং'}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="p-2.5 rounded-xl glass hover:bg-white/10 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileSheet
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        lang={lang}
        onToggleLang={onToggleLang}
      />
    </>
  );
};

