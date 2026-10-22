import React from 'react';
import { QrCode, ArrowDownRight } from 'lucide-react';
import { copy } from '../../data/copy';
import releaseInfo from '../../data/release.json';

export const NonAndroidNotice: React.FC<{ lang: 'en' | 'bn'; osName: string }> = ({ lang, osName }) => {
  const t = copy[lang].download;

  return (
    <div className="glass rounded-2xl p-6 sm:p-8 max-w-xl mx-auto border border-emerald/20 text-center flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-emerald/10 border border-emerald/30 flex items-center justify-center text-emerald">
        <QrCode className="w-6 h-6" />
      </div>

      <div className="flex flex-col gap-1.5">
        <h4 className="text-base sm:text-lg font-semibold text-text-primary">
          {t.nonAndroidTitle} (Detected {osName})
        </h4>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-md">
          {t.nonAndroidDesc}
        </p>
      </div>

      {/* QR Code SVG Image */}
      <div className="p-3 rounded-2xl bg-obsidian-card border border-white/10 shadow-lg">
        <img
          src="/qr-download.svg"
          alt="Scan QR code to download Nseen on Android"
          className="w-40 h-40 sm:w-48 sm:h-48 rounded-xl"
          loading="lazy"
        />
      </div>

      {/* Fallback Direct Link */}
      <div className="pt-2">
        <a
          href={releaseInfo.downloadUrl}
          download={releaseInfo.filename}
          className="text-xs font-mono text-emerald hover:underline inline-flex items-center gap-1"
        >
          <span>{t.downloadAnyway}</span>
          <ArrowDownRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};

