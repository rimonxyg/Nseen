# Nseen Website — Execution Tracker (tasks.md)

Conventions: work phases in order. Do not start a phase until the previous phase's **Gate** passes. Commit after each task group with a conventional commit message. Record any deviation in `DECISIONS.md`. Spec reference: `context.md`.

---

## Phase 1: Project Setup & Design System Initialization

- [ ] Initialize repo with `pnpm create vite` (React + TS), set Node 20 via `.nvmrc`, enable TS `strict`
- [ ] Install exact-pinned deps: react, react-dom, vite-react-ssg, react-router-dom, tailwindcss, postcss, autoprefixer, lucide-react, motion
- [ ] Install dev deps: eslint, eslint-plugin-jsx-a11y, prettier, vitest, @testing-library/react, playwright, @axe-core/playwright, svgo
- [ ] Create the folder structure from `context.md` §4.2 (empty files where needed)
- [ ] Write `src/styles/tokens.css` with all color, radius, spacing and type tokens from §2
- [ ] Configure `tailwind.config.ts` to consume the tokens, breakpoints (360/480/768/1024/1280/1536/2000) and fluid type scale
- [ ] Implement `glass.css` (.glass, .glass-strong, fallbacks for no backdrop-filter and reduced transparency)
- [ ] Self-host fonts: subset Inter Variable (Latin) and Hind Siliguri (400/500/600, Bengali + Latin) to woff2; add `@font-face` with `font-display: swap`
- [ ] Add base styles: reset, `color-scheme: dark`, focus ring, skip link, reduced-motion rules
- [ ] Build UI primitives: Button (primary/secondary), Pill, Card, Toast, SegmentedControl, VisuallyHidden, Section, Container
- [ ] Create `src/data/copy.ts` and move every user-facing string from `context.md` §8 into it (en + bn)
- [ ] Create `src/config/site.config.ts` with typed fields: supportEmail, siteUrl, labsContactUrl, minAndroid, refundPolicyText, mfs.{bkash,nagad,rocket}, bank details (all optional strings, owner-filled)
- [ ] Set up ESLint, Prettier, `pnpm lint`, `pnpm typecheck`, `pnpm test` scripts
- [ ] Add `DECISIONS.md` and `README.md` (setup, scripts, how to release a new APK)
- [ ] **Gate:** `pnpm build` succeeds, a token showcase page renders all colors/type/glass correctly at 360px and 1440px

---

## Phase 2: Core Components & Apple-Style Hero Presentation

- [ ] Configure `vite-react-ssg` with routes `/`, `/privacy`, `/terms`, `*`; verify prerendered HTML contains hero text
- [ ] Build `Navbar` (glass, hide-on-scroll-down/show-on-up, scroll-spy, active link state)
- [ ] Build `MobileSheet` navigation (focus trap, Escape to close, restore focus, body scroll lock)
- [ ] Build `Hero` with eyebrow, display H1, subtext, two CTAs, trust row
- [ ] Build `PhoneMockup` as pure CSS/SVG (no raster over 30 KB) with chat thread
- [ ] Build `MessageSequence`: 6s loop (arrive → delete → red DELETED badge spring-in → hold → reset)
- [ ] Build `DeletedBadge` (red tint, pulsing dot; pulse disabled for reduced motion)
- [ ] Provide static final frame for reduced motion and for no-JS/pre-hydration
- [ ] Add hero background glow (`--hero-glow`) and slow parallax float (transform only; disabled for reduced motion)
- [ ] Build `BentoGrid` + 6 `BentoTile`s with content from §3.3 and expandable detail panels (keyboard accessible, readable without hover)
- [ ] Add entrance animations via IntersectionObserver (`useInView`), once per element, staggered 60ms
- [ ] Build `Footer` with links, mission line, trademark notice, version from `release.json`
- [ ] Build `Privacy` and `Terms` pages (plain-language; privacy page states: no tracking, no cookies, localStorage only for language/tab, accurate description of Google sign-in and license check)
- [ ] Verify the hero is fully styled and legible with JS disabled
- [ ] **Gate:** Lighthouse mobile on `/` ≥ 90 Performance; no layout shift in hero; reduced-motion verified manually

---

## Phase 3: Direct APK Download Engine & Cryptographic Integrity Pill

- [ ] Place the release APK at `public/downloads/Nseen-v1.2.1-pro.apk` (owner supplies the file; do not commit if repo is public, use CI artifact instead and document it)
- [ ] Write `scripts/generate-release.mjs`: stream APK, compute SHA-256 + byte size, write `src/data/release.json` and `<apk>.sha256` (`<hash>  <filename>` format); fail the build if the APK is missing
- [ ] Wire the script to `prebuild` in `package.json`
- [ ] Implement `lib/detectPlatform.ts` (userAgentData first, UA fallback) with unit tests for Android, iOS, Windows, macOS, Linux, and in-app browsers (FB/Instagram/Messenger)
- [ ] Build `DownloadCard`: icon, "Nseen v1.2.1 Pro", Android requirement from `release.json`, size via `formatBytes`, release date
- [ ] Make the primary button a native `<a href download>` so it works without JS
- [ ] Build `NonAndroidNotice` with build-time-generated QR SVG (`scripts/generate-qr.mjs`) and a "Download anyway" link
- [ ] Build in-app-browser warning: "Open in Chrome to download"
- [ ] Build `IntegrityPill`: truncated hash, copy button, expand to full 64-char hash, `aria-live` toast "Checksum copied"
- [ ] Implement `copyToClipboard.ts` with clipboard API + textarea fallback; unit test both paths
- [ ] Build `VerifyHelp` collapsible with Termux / PowerShell / macOS-Linux commands, each with its own copy button
- [ ] Post-click state: "Downloading… follow the install guide below"; smooth-scroll to `#install` after 1.5s unless the user interacts
- [ ] Configure headers for `/downloads/*` (Content-Type `application/vnd.android.package-archive`, `Content-Disposition: attachment`, `nosniff`)
- [ ] Write `scripts/verify-deploy.mjs` that downloads the deployed APK and checks its SHA-256 equals the hash shown on the live page
- [ ] **Gate:** Download works on a real Android phone over mobile data; displayed hash matches `sha256sum` of the downloaded file; works with JS disabled

---

## Phase 4: Multi-Brand OEM Installation Guide (Samsung, Nothing, Xiaomi, Vivo)

- [ ] Define `src/data/oem-guides.ts` typed schema: `{id, label, steps:[{title, body, illustrationId}], footnote}` using copy from `context.md` §8.3
- [ ] Build `OemSwitcher` using the WAI-ARIA tabs pattern (arrow keys, Home/End), sliding thumb with spring, hash-synced (`#install=samsung|stock|xiaomi|vivo`)
- [ ] Auto-select the tab from UA/Client Hints, best-effort, user override always wins
- [ ] Draw 4 sets of simple SVG phone illustrations (3 per brand, each < 6 KB, SVGO-optimized, no copied OEM UI assets)
- [ ] Build `GuideStep` card (number, title, body, illustration)
- [ ] Build `PermissionCards` (Notification access, Battery/background exemption) with "Why we need this" lines
- [ ] Build `InstallSheet` for mobile (bottom sheet, swipe-down dismiss, focus trap, `aria-modal`, focus restore) and inline layout on desktop
- [ ] Add "Did it not work?" help block linking to the FAQ and support email
- [ ] Add the Samsung Auto Blocker and Play Protect step and the Nothing/Stock "Allow restricted settings" step exactly as written in the spec
- [ ] Unit test the tab auto-selection logic and hash sync
- [ ] **Gate:** Every tab is keyboard-operable, screen-reader labelled, and readable at 360px; a non-technical tester completes install using only the page

---

## Phase 5: 150 BDT Lifetime Pricing & MFS Checkout Explainer

- [ ] Build `PricingCard` (150 BDT, "One-time. Lifetime. One phone.", feature list, "How to pay" button)
- [ ] Build gateway chips (bKash, Nagad, Rocket, Bank/Card) as neutral text chips; no third-party logos unless owner provides licensed assets
- [ ] Build `PaymentStepper` with 4 steps and per-gateway tabs; read numbers/details only from `site.config.ts`
- [ ] Implement empty-field fallback: "Payment details are shown inside the app."; add a unit test that no number is ever hardcoded in components
- [ ] Build Bank/Card transfer details block (renders only if configured)
- [ ] Build `BengaliToggle` ("বাংলায় দেখুন"), default on when `navigator.language` starts with `bn`; persist in `localStorage` with try/catch
- [ ] Add the full Bengali instructions from `context.md` §8.5 with `lang="bn"` and Hind Siliguri
- [ ] Build `SafetyNotice` ("We never ask for your PIN or OTP") and the "one license = one phone" explainer with device-change contact
- [ ] Confirm the page contains no form fields collecting TrxID, phone numbers or PINs
- [ ] Build refund text block sourced from `site.config.ts` with the specified fallback
- [ ] **Gate:** A Bengali-speaking tester can explain the payment process correctly after reading only the Bengali block

---

## Phase 6: Future Ecosystem & Hardware/Software Hybrid Teaser Section

- [ ] Build `Timeline` (horizontal on desktop, vertical on mobile) with 3 stages: Now / Next / Later
- [ ] Build two "Coming soon" utility-app teaser cards with abstract glyphs and no invented product names
- [ ] Build `HardwareTeaser` glass card with stylized line-art SVG device (privacy module / hardware key / IoT companion) and the copy from §3.7
- [ ] Add "Get notified" link-out (`mailto:` or `labsContactUrl`), no on-site form, no tracking
- [ ] Add a note that these are plans, not dated commitments
- [ ] Lazy-load the Labs section with prefetch on approach
- [ ] **Gate:** Section looks intentional and premium at 360px, 768px, 1440px and 2560px; no fake or misleading claims

---

## Phase 7: Security Hardening, SEO, Mobile Responsiveness & QA Testing

### Security
- [ ] Add `public/_headers` exactly as in `context.md` §6.1 and the equivalent in `firebase.json`
- [ ] Confirm the built HTML has no inline scripts/styles; if the SSG emits any, add build-time SHA-256 hashes to `script-src`/`style-src` via a post-build script (never `'unsafe-inline'`)
- [ ] Verify zero CSP violations in the browser console on all routes
- [ ] Playwright test: every network request on `/` goes to the site's own origin only
- [ ] Run `pnpm audit --prod`; fix or document any high/critical issues
- [ ] Confirm no external CDN, font, script or iframe is referenced anywhere (`grep` check in CI)
- [ ] Test securityheaders.com/Mozilla Observatory-style scan on the staging URL; target A/A+

### SEO & metadata
- [ ] Implement `lib/seo.ts` to set title, description, canonical, OpenGraph, Twitter card per route
- [ ] Create `og-image.png` (1200×630, < 120 KB) and set `og:image:alt`
- [ ] Add JSON-LD: SoftwareApplication (price 150 BDT), Organization, FAQPage (generated from `faq.ts`)
- [ ] Generate `sitemap.xml` and `robots.txt`; add `site.webmanifest` and icons (favicon.svg, apple-touch-icon, 192, 512)
- [ ] Validate structured data and OG previews on the staging URL

### Responsiveness
- [ ] Test at 360, 390, 412, 768, 820, 1024, 1280, 1440, 1920, 2560 widths
- [ ] Test iPhone Safari, Chrome Android, Samsung Internet, Firefox Android, iPad portrait/landscape
- [ ] Test foldable viewports (Galaxy Z Fold folded ~344px and unfolded ~884px; Surface Duo spanning); nothing crosses the hinge
- [ ] Verify touch targets ≥ 48px and no horizontal scroll at any width
- [ ] Verify `backdrop-filter` fallback in a browser/profile where it is disabled

### Performance & accessibility
- [ ] Implement `scripts/check-budgets.mjs` (JS ≤ 70 KB gz initial, CSS ≤ 20 KB gz, fonts ≤ 120 KB) and run in CI
- [ ] Lighthouse mobile (Slow 4G, 4x CPU): Performance ≥ 95, Accessibility 100, Best Practices 100, SEO 100; FCP < 1.0s, LCP < 1.8s, CLS < 0.02
- [ ] Run axe-core via Playwright on all routes with zero violations
- [ ] Manual screen reader pass (TalkBack on Android) for nav, tabs, accordion, sheet, toast
- [ ] Verify `prefers-reduced-motion` and `prefers-reduced-transparency` behaviors
- [ ] Verify keyboard-only navigation of the entire page

### QA
- [ ] Unit tests: detectPlatform, copyToClipboard, formatBytes, release.json schema, copy completeness (every key has en + bn where required)
- [ ] E2E: download link present with correct `href`/`download`; integrity pill copy; OEM tab switching and hash sync; Bengali toggle persistence; FAQ accordion; mobile nav
- [ ] Proofread all copy against the honesty rules in `context.md` §1.1
- [ ] **Gate:** All checks above pass in CI on a clean clone

---

## Phase 8: Production Deployment (Firebase Hosting / Cloudflare Pages)

### Cloudflare Pages (primary)
- [ ] Create the Pages project, connect the repo, build command `pnpm build`, output dir `dist`, Node 20
- [ ] Provide the APK to the build via the documented secure method (private artifact/R2 download step) since it must not be committed to a public repo
- [ ] Confirm `_headers` and `_redirects` are served; verify CSP and all security headers with `curl -I`
- [ ] Confirm the 16.8 MB APK is under the 25 MiB per-file Pages limit and downloads with the correct Content-Type
- [ ] Attach the custom domain, enforce HTTPS, enable HSTS, enable Always Use HTTPS
- [ ] Disable any automatic Cloudflare injection that adds third-party scripts (e.g. Web Analytics beacon, Rocket Loader, email obfuscation scripts) because they violate the CSP and the zero-tracking rule

### Firebase Hosting (alternative)
- [ ] `firebase init hosting` with `dist` as public dir and SPA rewrite only for `/privacy` and `/terms` fallback as needed
- [ ] Port all headers from `_headers` into `firebase.json` `hosting.headers`
- [ ] Deploy to a preview channel first, run the full Phase 7 suite against it, then promote to live

### Post-deploy
- [ ] Run `scripts/verify-deploy.mjs`: live APK SHA-256 equals the hash displayed on the live page
- [ ] Re-run Lighthouse mobile and the network-origin test against the production URL
- [ ] Download and install the APK from production on at least one Samsung, one Xiaomi/Redmi, and one stock/Nothing-class device; confirm each OEM guide matches reality and fix wording if not
- [ ] Submit `sitemap.xml` to Search Console (verification via DNS TXT only, no script)
- [ ] Document the release procedure in `README.md`: replace APK → run `generate-release` → build → deploy → run `verify-deploy`
- [ ] Tag `v1.0.0` and record the final URLs, headers and Lighthouse scores in `DECISIONS.md`
- [ ] **Final Gate:** Definition of Done in `context.md` §9 is fully satisfied

