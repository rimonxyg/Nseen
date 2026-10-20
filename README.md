# Nseen (Never Miss a Deleted Message Again) 🛡️

[![Build Nseen APK](https://github.com/rimonxyg/Nseen/actions/workflows/build-apk.yml/badge.svg)](https://github.com/rimonxyg/Nseen/actions/workflows/build-apk.yml)
![Platform](https://img.shields.io/badge/Platform-Android-3DDC84?logo=android&logoColor=white)
![Kotlin](https://img.shields.io/badge/Kotlin-2.0.21-7F52FF?logo=kotlin&logoColor=white)
![Compose](https://img.shields.io/badge/Jetpack_Compose-Material_3-4285F4?logo=jetpackcompose&logoColor=white)
![License](https://img.shields.io/badge/Monetization-150_BDT_Lifetime-00C896)

**Nseen** is an offline-first Android application designed to intercept, store, and display incoming notifications from major messaging applications so that messages deleted by the sender ("This message was deleted" / "এই বার্তাটি মুছে ফেলা হয়েছে") remain permanently readable by the user.

---

## 🚀 Key Features

* **Real-Time Notification Interception**: Runs natively via Android `NotificationListenerService` without requiring root access or modified messaging clients.
* **Smart Deletion Detection**: Detects deletion notices in English, Bengali, Arabic, Spanish, French, German, and Turkish. Retroactively flags the original message with `isDeleted = true` instead of saving a meaningless placeholder.
* **Multi-App Support**:
  - WhatsApp (`com.whatsapp`)
  - WhatsApp Business (`com.whatsapp.w4b`)
  - Facebook Messenger (`com.facebook.orca`)
  - Telegram (`org.telegram.messenger`)
  - Instagram Direct (`com.instagram.android`)
* **Dual-Layer Anti-Duplicate Engine**: In-memory LRU cache with SHA-256 signatures plus a 5,000ms database sliding window.
* **100% On-Device Privacy**: Intercepted messages and chats NEVER leave the device and are never sent to any server.
* **Material 3 Dark Emerald UI**: Custom theme with animated Onboarding, Filter Chips, "Deleted Only" toggle, Chat Detail bubbles, and Biometric Lock (Fingerprint / Face ID).

---

## 💰 Monetization System (150 BDT Lifetime)

* **Price**: 150 BDT (Bangladeshi Taka) — One-time lifetime payment.
* **Security Model**: **1 User Account = 1 Physical Device**.
* **Modern Hardware Fingerprinting (`DeviceFingerprintHelper.kt`)**:
  - Because Android 10+ blocks access to physical Wi-Fi MAC addresses for privacy, Nseen extracts the hardware-fused **Widevine `MediaDrm` Device Unique ID** combined with `Settings.Secure.ANDROID_ID` into a deterministic SHA-256 fingerprint.
  - This fingerprint **survives app uninstallation, reboots, and storage wipes**.
* **Seamless Reinstallation**:
  - If the user uninstalls and reinstalls Nseen on the **same phone**, their license is automatically restored when they sign in with their Google account.
* **Anti-Fraud Account Lock**:
  - If the user attempts to sign in with their Google credentials on a different device, access is blocked (`DeviceMismatch`).
* **Offline Grace Period**:
  - Verified users can use the app completely offline for up to **14 days** without requiring internet checks.

---

## 🇧🇩 Bangladesh MFS Payment Integration

* **Supported Operators**: bKash, Nagad, Rocket.
* **In-App Checkout**:
  1. User selects payment method (bKash / Nagad / Rocket).
  2. One-tap copy to clipboard for merchant/personal number.
  3. User completes Send Money / Payment in their MFS app.
  4. User enters sender mobile number and Transaction ID (TrxID).
  5. License is instantly validated and activated.

---

## ☁️ Backend & Hosting Architecture (Firebase vs Supabase)

### Why Firebase is Recommended for Nseen:
1. **Native Android Google Sign-In**: Firebase Authentication pairs natively with Google Play Services on Android with zero redirect hassles.
2. **Cloud Firestore**: Simple, fast NoSQL document storage for user licenses (`licenses/{googleUid}`).
3. **Generous Free Tier**: Completely free for your initial thousands of users (no server maintenance fees).
4. **Cloud Functions**: Can host a lightweight webhook to verify bKash merchant notifications.

### Database Schema (`licenses` collection):
```json
{
  "google_uid": "goog_4f9d8a7c6b5e...",
  "email": "user@gmail.com",
  "bound_device_id": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "is_lifetime_active": true,
  "payment_amount": 150,
  "currency": "BDT",
  "payment_method": "bKash",
  "transaction_id": "BKH92817462",
  "activated_at": 1729000000000,
  "last_verified_at": 1729000000000
}
```

---

## 🛠️ How to Build & Install

### Option 1: Automated Cloud Build via GitHub Actions (Recommended)
This repository includes a continuous integration workflow:
1. Push code or trigger the workflow manually from the **Actions** tab.
2. Download the compiled release APK directly from GitHub Actions artifacts.

### Option 2: Local Build via Android Studio
1. Clone this repository:
   ```bash
   git clone https://github.com/rimonxyg/Nseen.git
   ```
2. Open the project in Android Studio (Jellyfish / Koala / Ladybug or newer).
3. Let Gradle sync dependencies (JDK 17 required).
4. Select **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
5. Sideload the generated APK onto your Android device.

---

## 📂 Project Structure

```
Nseen/
├── app/
│   ├── build.gradle.kts            # App dependencies (Compose BOM, Room, KSP)
│   └── src/main/
│       ├── AndroidManifest.xml     # Services, Activities, isolated permissions
│       └── java/com/nseen/app/
│           ├── NseenApplication.kt # Application container
│           ├── di/                 # Dependency injection container
│           ├── data/
│           │   ├── local/          # Room DB, DAOs, MessageEntity
│           │   ├── preferences/    # AppPreferences (retention, biometric)
│           │   └── repository/     # MessageRepository
│           ├── license/
│           │   ├── DeviceFingerprintHelper.kt  # Hardware DRM device binding
│           │   ├── LicenseModel.kt             # Data models & state machine
│           │   ├── LicenseManager.kt           # License controller & signatures
│           │   ├── PaymentManager.kt           # bKash / Nagad TrxID handler
│           │   └── GoogleAuthHelper.kt         # Google Identity integration
│           ├── service/
│           │   ├── MsgListenerService.kt       # NotificationListenerService
│           │   └── engine/
│           │       ├── DeletionDetector.kt     # Multilingual & Bengali matching
│           │       ├── NotificationParser.kt   # MessagingStyle parser
│           │       └── Deduplicator.kt         # LRU cache deduplication
│           └── ui/
│               ├── MainActivity.kt             # Compose NavHost & Gatekeeper
│               ├── screens/
│               │   ├── onboarding/             # Intro & permissions
│               │   ├── paywall/                # 150 BDT Paywall & bKash checkout
│               │   ├── home/                   # Conversation list & filters
│               │   ├── detail/                 # Chat bubbles & deleted cards
│               │   └── settings/               # Account, License & app toggles
│               └── theme/                      # Emerald Material 3 Design
├── .github/workflows/build-apk.yml # Cloud APK automated build pipeline
├── tasks.md                        # Task tracker & completed milestones
└── context.md                      # Complete architectural documentation
```

---

## 📄 Privacy Statement
Nseen takes privacy seriously:
* Messages and notifications are processed strictly on the user's phone.
* Network permissions (`INTERNET`) are exclusively used to verify the 150 BDT lifetime license and Google account.
* No personal chats, contacts, or messages are ever transmitted to any server.
