import React from 'react';
import { HardDrive, EyeOff } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <main id="main-content" className="pt-32 pb-24 max-w-3xl mx-auto px-4 sm:px-6">
      <div className="glass rounded-3xl p-8 sm:p-12 border border-white/10 flex flex-col gap-8">
        <div>
          <span className="text-xs font-mono font-semibold tracking-wider text-emerald uppercase mb-2 block">
            PRIVACY GUARANTEE
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
            Your messages belong strictly on your phone.
          </h1>
          <p className="text-sm text-text-secondary">
            Last updated: October 2026 • Policy Version 1.2
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-obsidian-subtle border border-white/5 flex items-start gap-3">
            <HardDrive className="w-5 h-5 text-emerald shrink-0 mt-0.5" />
            <div className="text-xs text-text-secondary">
              <strong className="text-text-primary block mb-0.5">100% Local SQLite Storage</strong>
              All intercepted notifications and message logs are saved locally on your physical device storage.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-obsidian-subtle border border-white/5 flex items-start gap-3">
            <EyeOff className="w-5 h-5 text-emerald shrink-0 mt-0.5" />
            <div className="text-xs text-text-secondary">
              <strong className="text-text-primary block mb-0.5">Zero Cloud Storage of Chats</strong>
              Nseen has no servers that receive, forward, or inspect your chat contents.
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 text-sm text-text-secondary leading-relaxed border-t border-white/5 pt-6">
          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-text-primary">1. Information We Access On-Device</h2>
            <p>
              When you grant Nseen the Android <code>NotificationListenerService</code> permission, Android allows the app to read incoming notifications from applications you select (WhatsApp, Messenger, Telegram, Instagram). This data remains sandboxed inside the app's local SQLite database.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-text-primary">2. Network Permissions & Licensing</h2>
            <p>
              Nseen requests <code>android.permission.INTERNET</code> strictly for Google Sign-In and validating your 150 BDT lifetime license against Google Firebase Authentication. Your chats, contacts, or media files are never transmitted across the network.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-text-primary">3. Website Zero-Tracking Commitment</h2>
            <p>
              This website uses zero tracking cookies, zero analytics beacons, and no external tracking scripts. Your IP address is never harvested or sold.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-text-primary">4. Contacting Us</h2>
            <p>
              For privacy audits or technical inquiries, contact our engineering lead at <a href="mailto:support@nseen.app" className="text-emerald hover:underline">support@nseen.app</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};
