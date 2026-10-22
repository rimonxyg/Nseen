import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { IntegrityPill } from './IntegrityPill';
import { VerifyHelp } from './VerifyHelp';
import { NonAndroidNotice } from './NonAndroidNotice';
import { Toast } from '../ui/Toast';
import { Download, AlertTriangle, Smartphone, HardDrive, Calendar } from 'lucide-react';
import { copy } from '../../data/copy';
import releaseInfo from '../../data/release.json';
import { formatBytes } from '../../lib/formatBytes';
import { detectPlatform } from '../../lib/detectPlatform';

export const DownloadCard: React.FC<{ lang: 'en' | 'bn' }> = ({ lang }) => {
  const t = copy[lang].download;
  const platform = detectPlatform();
  const [showToast, setShowToast] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  const handleDownloadClick = () => {
    setDownloadStarted(true);
    // Smooth scroll to installation guide after 1.8 seconds
    setTimeout(() => {
      const installEl = document.getElementById('install');
      if (installEl) {
        installEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1800);
  };

  return (
    <section id="download" className="py-20 sm:py-28 relative">
      <Toast
        message={t.hashCopied}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono font-semibold tracking-wider text-emerald uppercase mb-3 inline-block">
            {t.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary mb-4">
            {t.title}
          </h2>
          <p className="text-base text-text-secondary">
            {t.subtitle}
          </p>
        </div>

        {/* Warning if in in-app browser */}
        {platform.isInAppBrowser && (
          <div className="max-w-xl mx-auto mb-8 p-4 rounded-xl bg-deleted-bg border border-deleted-border text-deleted-red text-xs sm:text-sm flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>
              You are viewing this inside an in-app browser (Messenger/Instagram). Tap the 3 dots in the top right and select <strong>"Open in Chrome"</strong> to download the APK.
            </span>
          </div>
        )}

        {/* If non-Android desktop/iOS, display QR code */}
        {!platform.isAndroid ? (
          <div className="flex flex-col gap-10">
            <NonAndroidNotice lang={lang} osName={platform.osName} />
          </div>
        ) : (
          /* Android Direct Download Main Card */
          <div className="max-w-2xl mx-auto glass rounded-3xl p-8 sm:p-12 border border-emerald/30 shadow-glow-emerald text-center flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald/15 border border-emerald/50 flex items-center justify-center font-bold text-2xl text-emerald shadow-glow-subtle">
              N
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-2xl sm:text-3xl font-bold text-text-primary">
                Nseen Pro (v{releaseInfo.version})
              </h3>
              <p className="text-xs sm:text-sm font-mono text-emerald">
                Production Release • Direct Sideload Build
              </p>
            </div>

            {/* Spec metadata chips */}
            <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-text-secondary py-2 border-y border-white/5 w-full">
              <span className="flex items-center gap-1.5 font-medium">
                <Smartphone className="w-4 h-4 text-emerald" />
                <span>Min: Android 8.0+</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <HardDrive className="w-4 h-4 text-emerald" />
                <span>Size: {formatBytes(releaseInfo.sizeBytes)}</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-emerald" />
                <span>Updated: {releaseInfo.releaseDate}</span>
              </span>
            </div>

            {/* Native Link Download Button */}
            <Button
              asLink
              href={releaseInfo.downloadUrl}
              download={releaseInfo.filename}
              size="lg"
              variant="primary"
              className="w-full sm:w-auto px-12 py-5 text-lg font-bold gap-3 shadow-glow-emerald"
              onClick={handleDownloadClick}
            >
              <Download className="w-6 h-6" />
              <span>{t.cta} ({formatBytes(releaseInfo.sizeBytes)})</span>
            </Button>

            {downloadStarted && (
              <p className="text-xs text-emerald font-medium animate-pulse">
                ✓ Download started. Follow the installation guide below.
              </p>
            )}

            {/* Cryptographic SHA-256 Pill */}
            <div className="w-full pt-4">
              <IntegrityPill onCopySuccess={() => setShowToast(true)} />
              <VerifyHelp />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
