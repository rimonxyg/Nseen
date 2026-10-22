export interface OemStep {
  step: number;
  title: string;
  body: string;
  badge?: string;
}

export interface OemGuide {
  id: 'samsung' | 'stock' | 'xiaomi' | 'vivo';
  name: string;
  osName: string;
  headline: string;
  steps: OemStep[];
  troubleshootNote: string;
}

export const oemGuides: OemGuide[] = [
  {
    id: 'samsung',
    name: 'Samsung',
    osName: 'OneUI 6 / 7 (Android 14-15)',
    headline: 'Installing on Samsung Galaxy (S25 Ultra, S24, A/M series)',
    steps: [
      {
        step: 1,
        title: 'Download & Open APK',
        body: 'Tap Download on our website. When the download completes, tap Open from your notifications or My Files.',
      },
      {
        step: 2,
        title: 'Auto Blocker / Play Protect',
        body: 'If Samsung Auto Blocker pops up, go to Settings > Security and privacy > Auto Blocker and temporarily turn it OFF. In Play Protect popup, tap "More details" and "Install anyway".',
        badge: 'Important for S24 / S25'
      },
      {
        step: 3,
        title: 'Grant Notification Access',
        body: 'Open Nseen, tap Grant Permission on the onboarding screen, and toggle Nseen to ALLOW in Device Notification Access.',
      }
    ],
    troubleshootNote: 'Samsung devices with OneUI 6+ activate Auto Blocker by default to prevent non-store apps. You can turn Auto Blocker back on right after installation.'
  },
  {
    id: 'stock',
    name: 'Nothing & Pixel',
    osName: 'Nothing OS / Pure Android 13, 14, 15',
    headline: 'Unlocking Restricted Settings on Nothing Phone & Google Pixel',
    steps: [
      {
        step: 1,
        title: 'Install from Chrome or Files',
        body: 'Download the APK and tap Install. When Play Protect scans, approve the installation.',
      },
      {
        step: 2,
        title: 'Unlock Restricted Settings',
        body: 'If Notification Access is greyed out: Go to Settings > Apps > All Apps > Nseen > Tap 3 dots (⋮) in top right corner > Tap "Allow restricted settings" (authenticate with fingerprint).',
        badge: 'Android 13+ Rule'
      },
      {
        step: 3,
        title: 'Toggle Notification Access',
        body: 'Return to Nseen and turn Notification Access ON. Set Battery Usage to "Unrestricted" for 24/7 reliability.',
      }
    ],
    troubleshootNote: 'Google introduced Restricted Settings in Android 13 to protect notification APIs for sideloaded APKs. Tapping the 3 dots in App Info unlocks it permanently.'
  },
  {
    id: 'xiaomi',
    name: 'Xiaomi / Redmi',
    osName: 'HyperOS & MIUI',
    headline: 'Configuration for Xiaomi, Redmi & POCO Devices',
    steps: [
      {
        step: 1,
        title: 'Security Verification Countdown',
        body: 'Xiaomi built-in package scanner will display a 10-second advisory. Check "I am aware of the possible risks" and tap OK to complete install.',
      },
      {
        step: 2,
        title: 'Enable Autostart (Mandatory)',
        body: 'Long press Nseen icon > Tap App Info > Turn Autostart to ON. This prevents MIUI from killing the notification listener when you clear recent apps.',
        badge: 'Required for MIUI'
      },
      {
        step: 3,
        title: 'Battery Saver: No Restrictions',
        body: 'In App Info > Battery saver, change the setting from "MIUI Battery saver" to "No restrictions". Grant Notification Access.',
      }
    ],
    troubleshootNote: 'Without Autostart enabled, Xiaomi HyperOS will terminate background services whenever the app switcher is cleared.'
  },
  {
    id: 'vivo',
    name: 'Vivo & Realme',
    osName: 'Funtouch OS / ColorOS / Realme UI',
    headline: 'Setup for Vivo, iQOO, Realme, Oppo & Tecno',
    steps: [
      {
        step: 1,
        title: 'Security Check Approval',
        body: 'When prompted by Phone Manager or Vivo security verification, enter your lock screen PIN or fingerprint to approve installation.',
      },
      {
        step: 2,
        title: 'Allow Background Activity',
        body: 'Open App Info > Battery > Select "Allow background activity" and "Allow high background power consumption".',
      },
      {
        step: 3,
        title: 'Turn on Notification Access',
        body: 'Open Nseen and enable Notification Access. The service will immediately start monitoring incoming messages.',
      }
    ],
    troubleshootNote: 'If the app is put to sleep after several days of inactivity, make sure "Auto-Freeze" is disabled in Phone Master / Security center.'
  }
];

