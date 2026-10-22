# Nseen Official Web Portal & Release Distribution

Apple-inspired, minimal, zero-leakage web portal for **Nseen (Deleted Message Viewer)**.

## Getting Started

```bash
cd website
pnpm install
pnpm dev
```

## Production Build

```bash
pnpm build
```

The build will automatically run `scripts/generate-release.mjs` and `scripts/generate-qr.mjs` before bundling, ensuring that `release.json` has the exact SHA-256 hash of the binary located at `public/downloads/Nseen-v1.2.1-pro.apk`.

## Releasing a New APK
1. Place your updated `.apk` into `public/downloads/`.
2. Update the filename in `scripts/generate-release.mjs` if the version string changed.
3. Run `pnpm build`.
4. Deploy the output `dist/` directory to Firebase Hosting or Cloudflare Pages.
