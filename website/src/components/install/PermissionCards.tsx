import React from 'react';
import { Bell, BatteryCharging } from 'lucide-react';

export const PermissionCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
      {/* Notification Access Card */}
      <div className="p-5 rounded-2xl glass border border-white/5 flex gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald/10 border border-emerald/20 text-emerald flex items-center justify-center shrink-0">
          <Bell className="w-5 h-5" />
        </div>
        <div className="flex flex-col gap-1">
          <h5 className="text-sm font-semibold text-text-primary">
            Notification Listener Permission
          </h5>
          <p className="text-xs text-text-secondary leading-relaxed">
            <strong>Why it's needed:</strong> Android requires this system permission so Nseen can catch messages the instant they arrive in your notification tray before the sender deletes them.
          </p>
        </div>
      </div>

      {/* Battery Optimization Card */}
      <div className="p-5 rounded-2xl glass border border-white/5 flex gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald/10 border border-emerald/20 text-emerald flex items-center justify-center shrink-0">
          <BatteryCharging className="w-5 h-5" />
        </div>
        <div className="flex flex-col gap-1">
          <h5 className="text-sm font-semibold text-text-primary">
            Disable Battery Optimization
          </h5>
          <p className="text-xs text-text-secondary leading-relaxed">
            <strong>Why it's needed:</strong> Aggressive OEM battery killers (like MIUI or OneUI) sleep background apps. Disabling optimization guarantees 24/7 continuous protection.
          </p>
        </div>
      </div>
    </div>
  );
};
