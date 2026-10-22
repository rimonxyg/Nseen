# Architectural Decisions Log (DECISIONS.md)

### ADR 001: Separation of Android Codebase and Web Portal
* **Decision**: Placed website in dedicated `/website` sub-directory inside the main `Nseen` repository.
* **Rationale**: Preserves root Android Gradle build scripts and GitHub Actions (`.github/workflows/build-apk.yml`) without interference.

### ADR 002: Direct APK Sideload & SHA-256 Prebuild Generation
* **Decision**: Built `scripts/generate-release.mjs` which streams `Nseen-v1.2.1-pro.apk`, calculates its deterministic SHA-256 hash, and injects it into `release.json`.
* **Rationale**: Guarantees that the hash displayed on the website matches the downloaded file bit-for-bit without manual human error.

### ADR 003: Pure CSS / SVG Device Mockup & QR Code
* **Decision**: Rendered the hero phone mockup and the non-Android QR scanner using pure SVGs and CSS rather than multi-megabyte raster images.
* **Rationale**: Zero raster lag, instant rendering on slow 3G/4G connections, and <30KB footprint.

### ADR 004: Dual-Language (English + Bengali) Architecture
* **Decision**: Implemented native Bengali toggle with persistence in `localStorage` and auto-detection via `navigator.language`.
* **Rationale**: Cater seamlessly to both tech-savvy English speakers and everyday Bengali MFS users in Bangladesh.
