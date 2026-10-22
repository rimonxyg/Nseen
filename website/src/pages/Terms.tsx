import React from 'react';
import { siteConfig } from '../config/site.config';

export const Terms: React.FC = () => {
  return (
    <main id="main-content" className="pt-32 pb-24 max-w-3xl mx-auto px-4 sm:px-6">
      <div className="glass rounded-3xl p-8 sm:p-12 border border-white/10 flex flex-col gap-8">
        <div>
          <span className="text-xs font-mono font-semibold tracking-wider text-emerald uppercase mb-2 block">
            TERMS OF SERVICE
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
            Simple, honest commercial terms.
          </h1>
          <p className="text-sm text-text-secondary">
            Last updated: October 2026
          </p>
        </div>

        <div className="flex flex-col gap-6 text-sm text-text-secondary leading-relaxed">
          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-text-primary">1. Lifetime License Agreement</h2>
            <p>
              Nseen Pro is provided as a one-time 150 BDT lifetime purchase. There are no recurring monthly, yearly, or hidden maintenance charges.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-text-primary">2. Single-Device Binding</h2>
            <p>
              Each 150 BDT license is cryptographically bound to one physical Android handset via hardware-level MediaDrm identification to prevent fraudulent mass redistribution.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-text-primary">3. Device Migration Policy</h2>
            <p>
              If you purchase a new Android smartphone, you may migrate your license by contacting <a href={`mailto:${siteConfig.supportEmail}`} className="text-emerald hover:underline">{siteConfig.supportEmail}</a> with your original Transaction ID (TrxID) and Google account email.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-text-primary">4. Refund Guarantee</h2>
            <p>
              {siteConfig.refundPolicyText}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

