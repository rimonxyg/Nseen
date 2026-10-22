# Nseen Website — System Architecture & Context Specification (context.md)

## 1. Executive Summary & Brand Philosophy

### 1.1 Mission & Vision
**Nseen** is an offline-first Android privacy utility designed to intercept, store, and display incoming notifications from major messaging platforms (WhatsApp, Messenger, Telegram, Instagram) so deleted messages remain readable. Nseen is the flagship product of a forward-looking lab dedicated to problem-solving software and future hybrid hardware/software ecosystems.

**Honesty Rules:**
1. Zero tracking: No cookies, no analytics beacons, no external third-party scripts.
2. Transparency: Intercepted chats NEVER touch any cloud server. Network permissions are used exclusively for Google Sign-In and 150 BDT lifetime license validation.
3. Realistic roadmap: Future products and hardware concepts are presented as forward-looking plans, not dated commitments.
4. No deceptive UI patterns: No fake countdown timers, no artificial stock limits.

---

## 2. Design System & Visual Tokens (§2)

### 2.1 Color Tokens
```css
:root {
  --color-obsidian: #08090a;
  --color-obsidian-subtle: #0f1113;
  --color-obsidian-card: #15181b;
  --color-obsidian-border: rgba(255, 255, 255, 0.08);
  --color-obsidian-border-hover: rgba(255, 255, 255, 0.16);

  --color-emerald: #00c896;
  --color-emerald-glow: rgba(0, 200, 150, 0.25);
  --color-emerald-subtle: rgba(0, 200, 150, 0.12);
  --color-emerald-text: #05dfa8;

  --color-deleted-red: #ff3b30;
  --color-deleted-bg: rgba(255, 59, 48, 0.15);
  --color-deleted-border: rgba(255, 59, 48, 0.35);

  --color-text-primary: #f5f5f7;
  --color-text-secondary: #86868b;
  --color-text-tertiary: #515154;

  --hero-glow: radial-gradient(circle at 50% 30%, rgba(0, 200, 150, 0.18) 0%, rgba(8, 9, 10, 0) 70%);
}
```

### 2.2 Glassmorphism & Elevation
* `.glass`: `background: rgba(21, 24, 27, 0.72); backdrop-filter: blur(20px) saturate(180%); border: 1px solid var(--color-obsidian-border);`
* `.glass-strong`: `background: rgba(21, 24, 27, 0.88); backdrop-filter: blur(32px); border: 1px solid var(--color-obsidian-border-hover);`
* Fallback: Opaque `--color-obsidian-card` when `backdrop-filter` is unsupported or `prefers-reduced-transparency` is active.

### 2.3 Typography Scale
* Primary font: **Inter Variable** (Latin).
* Bengali font: **Hind Siliguri** (400, 500, 600).
* Fluid type scale:
  - Display Hero H1: `clamp(2.5rem, 6vw, 4.5rem)`
  - Section H2: `clamp(2rem, 4vw, 3rem)`
  - Subhead H3: `clamp(1.25rem, 2.5vw, 1.75rem)`
  - Body: `1rem` (16px), line-height `1.6`

---

## 3. Information Architecture & Sections (§3)

### 3.1 Hero Section
* Eyebrow: `NSEEN LABS • ANDROID PRO EDITION`
* Display H1: `Never miss a deleted message again.`
* Subtext: `Nseen captures messages the millisecond they arrive on your phone. Even if the sender deletes them for everyone, you still read them. 100% on-device. Zero cloud leakage.`
* CTAs:
  - Primary: `Download Nseen Pro (v1.2.1)` (with direct `<a download>`)
  - Secondary: `Installation Guide` (`#install`)
* Trust Row: `150 BDT Lifetime • One Phone Binding • Zero Ads & Zero Tracking`

### 3.2 Live Phone Mockup & 6s Sequence
* CSS/SVG device frame with notch, glass reflection, and status bar.
* Message timeline:
  1. `0s`: Incoming WhatsApp message: *"Meet me at 4 PM at the lobby!"*
  2. `2s`: Status flips to *"This message was deleted"*.
  3. `2.5s`: Nseen spring-in badge: `DELETED` in glowing red, revealing original text intact.
  4. `5s`: Holds state, then resets.

### 3.3 BentoGrid & 6 BentoTiles (§3.3)
1. **Real-Time Notification Trap**: Captures notifications via Android `NotificationListenerService` before messaging apps purge them.
2. **True 100% On-Device Privacy**: SQLite Room database encrypted locally on your flash storage. No remote servers ever receive chat logs.
3. **Multilingual Deletion Engine**: Recognizes deletion phrases in English, Bengali, Arabic, Spanish, French, German, and Turkish.
4. **Hardware-Fused Binding**: 1 License = 1 Device. Widevine DRM Unique ID ensures license permanence through uninstalls.
5. **Multi-App Unified Inbox**: WhatsApp, WhatsApp Business, Facebook Messenger, Instagram Direct, and Telegram.
6. **MFS Lifetime Checkout**: Simple 150 BDT one-time lifetime payment via bKash, Nagad, Rocket, or Card.

### 3.7 Future Ecosystem & Hardware/Software Hybrid Labs (§3.7)
* Stage 1 (Now): Nseen Android Privacy Flagship (v1.2.1).
* Stage 2 (Next): Cross-platform Companion & Smart Privacy Vaults.
* Stage 3 (Later): Dedicated Hardware Security Module & Physical NFC/USB Privacy Keys (Nseen Key / Privacy Node).
* Teaser Line: *"We are engineering dedicated hardware devices fused with offline software to eliminate surveillance without friction."*

---

## 4. Technical Architecture & Folder Structure (§4.2)

```
website/
├── public/
│   ├── _headers
│   ├── _redirects
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── favicon.svg
│   ├── site.webmanifest
│   ├── downloads/
│   │   └── Nseen-v1.2.1-pro.apk
│   └── fonts/
│       ├── inter-var.woff2
│       └── hind-siliguri-*.woff2
├── scripts/
│   ├── generate-release.mjs
│   ├── generate-qr.mjs
│   ├── check-budgets.mjs
│   └── verify-deploy.mjs
├── src/
│   ├── config/
│   │   └── site.config.ts
│   ├── data/
│   │   ├── copy.ts
│   │   ├── oem-guides.ts
│   │   ├── faq.ts
│   │   └── release.json
│   ├── lib/
│   │   ├── detectPlatform.ts
│   │   ├── copyToClipboard.ts
│   │   ├── formatBytes.ts
│   │   └── seo.ts
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── glass.css
│   │   └── index.css
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Pill.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── SegmentedControl.tsx
│   │   │   ├── VisuallyHidden.tsx
│   │   │   ├── Section.tsx
│   │   │   └── Container.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── MobileSheet.tsx
│   │   │   └── Footer.tsx
│   │   ├── hero/
│   │   │   ├── Hero.tsx
│   │   │   ├── PhoneMockup.tsx
│   │   │   ├── MessageSequence.tsx
│   │   │   └── DeletedBadge.tsx
│   │   ├── bento/
│   │   │   ├── BentoGrid.tsx
│   │   │   └── BentoTile.tsx
│   │   ├── download/
│   │   │   ├── DownloadCard.tsx
│   │   │   ├── IntegrityPill.tsx
│   │   │   ├── VerifyHelp.tsx
│   │   │   └── NonAndroidNotice.tsx
│   │   ├── install/
│   │   │   ├── OemSwitcher.tsx
│   │   │   ├── GuideStep.tsx
│   │   │   ├── PermissionCards.tsx
│   │   │   └── InstallSheet.tsx
│   │   ├── pricing/
│   │   │   ├── PricingCard.tsx
│   │   │   ├── PaymentStepper.tsx
│   │   │   ├── BengaliToggle.tsx
│   │   │   └── SafetyNotice.tsx
│   │   └── labs/
│   │       ├── Timeline.tsx
│   │       ├── AppTeaser.tsx
│   │       └── HardwareTeaser.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Privacy.tsx
│   │   └── Terms.tsx
│   ├── App.tsx
│   └── main.tsx
├── tailwind.config.ts
├── postcss.config.js
├── vite.config.ts
├── tsconfig.json
├── package.json
└── DECISIONS.md
```

---

## 6. Security & Headers Specification (§6.1)

```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; media-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';
```

For `/downloads/*`:
```
/downloads/*
  Content-Type: application/vnd.android.package-archive
  Content-Disposition: attachment
  X-Content-Type-Options: nosniff
```

---

## 8. User-Facing Copy (§8)

### 8.3 OEM Installation Guides (§8.3)
* **Samsung OneUI**:
  1. Download the APK and tap "Open".
  2. If Auto Blocker prompts, go to `Settings > Security and privacy > Auto Blocker` and temporarily allow installation.
  3. Grant Notification Access in Nseen onboarding.
* **Nothing / Stock Android 13/14/15**:
  1. Install APK from Files or Chrome.
  2. If Notification Access is greyed out, go to `Settings > Apps > Nseen > 3 dots (⋮) > Allow restricted settings`.
  3. Return to Nseen and turn on Notification Access.
* **Xiaomi / HyperOS / MIUI**:
  1. Pass the 10-second security verification prompt and tap "OK".
  2. Open App Info, turn ON **Autostart**.
  3. Set Battery Saver to **No restrictions**.
* **Vivo / Realme / Oppo**:
  1. Confirm your screen lock password when prompted by the system installer.
  2. Enable "Allow background power consumption" in App Info.

### 8.5 Bengali Payment Copy (§8.5)
* শিরোনাম: **১৫০ ৳ এককালীন আজীবন সাবস্ক্রিপশন**
* বিবরণ: **একবার কিনুন, আজীবন ব্যবহার করুন। কোনো মাসিক বা বাৎসরিক ফি নেই। ১টি অ্যাকাউন্ট = ১টি নিজস্ব ফোন।**
* পেমেন্ট ধাপ:
  1. **পেমেন্ট নম্বর কপি করুন**: অ্যাপে দেওয়া অফিসিয়াল bKash / Nagad পার্সোনাল বা মার্চেন্ট নম্বর কপি করুন।
  2. **Send Money সম্পন্ন করুন**: আপনার bKash / Nagad অ্যাপ থেকে ঠিক ১৫০ টাকা সেন্ড মানি করুন।
  3. **TrxID ও মোবাইল নম্বর দিন**: প্রাপ্ত ৮-১০ অক্ষরের ট্রানজেকশন আইডি (TrxID) অ্যাপে লিখে "যাচাই করুন" বাটনে চাপুন।
  4. **আজীবন এক্সেস আনলক**: তাৎক্ষণিক ভেরিফিকেশন শেষে অ্যাপটি চিরদিনের জন্য আনলক হয়ে যাবে।
* সতর্কতা: **আমরা কখনো আপনার পিন (PIN) বা ওটিপি (OTP) চাই না। পেমেন্ট সম্পূর্ণ আপনার নিজের ফোনে সংরক্ষিত থাকে।**

---

## 9. Definition of Done (§9)
* Lighthouse Performance ≥ 90, Accessibility 100, Best Practices 100, SEO 100.
* Zero external network calls; fully self-contained.
* 100% responsive down to 344px (foldable) and up to 2560px ultra-wide.
* Works with JavaScript disabled for reading and downloading.

