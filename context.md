# SYSTEM CONTEXT & ARCHITECTURAL SPECIFICATION - NSEEN

> **Permanent Memory & Context Document**  
> **App Name:** Nseen (Never miss a deleted message again)  
> **Package Identifier:** `com.nseen.app`  
> **Original Author:** Friend / Collaborator  
> **Current Maintainers:** Akhtaruzzaman Rimon & Antigravity  
> **Codebase Root:** `C:\RIMON[confidential]\whatsapp deleted messege viewer app\Nseen\Nseen`  
> **Target Platform:** Android (Min SDK 26 - Oreo, Target SDK 35 - Android 15, Compile SDK 37)  
> **Core Objective:** Integrate a 150 BDT One-Time Lifetime Subscription locked to one Google Account and one Physical Device (Hardware Fingerprint / MAC equivalent) with seamless restore on reinstallation.

---

## 1. Executive Summary & What Was Built

The existing project is a production-grade, offline-first Android application designed to intercept, store, and display incoming notifications from major messaging applications so that messages deleted by the sender ("This message was deleted") remain permanently readable by the user.

### Key Capabilities Built by Your Friend:
1. **Automated Notification Interception:** Runs as a background `NotificationListenerService` (`MsgListenerService`) that captures incoming notifications in real time.
2. **Deep Notification Extraction (`NotificationParser.kt`):** Intelligently unpacks Android `NotificationCompat.MessagingStyle` bundles (e.g. WhatsApp's grouped unread messages) as well as standard single-line and big-text notifications.
3. **Smart Deletion Detection (`DeletionDetector.kt`):** Detects when a messaging platform sends a deletion notice (e.g., "This message was deleted", "You deleted this message", "Este mensaje fue eliminado", etc.). Instead of saving this meaningless placeholder, Nseen queries the database for the latest active message from that sender and retroactively flags it with `isDeleted = true`.
4. **Dual-Layer Anti-Duplicate Engine (`Deduplicator.kt`):** Prevents duplicate entries when messaging apps repost or update notifications using an in-memory LRU cache and a 5000ms database sliding window.
5. **Multi-Platform Support:** Pre-configured for WhatsApp, WhatsApp Business, Telegram, Facebook Messenger, and Instagram Direct.
6. **Room Database (`NseenDatabase.kt`):** Local SQLite storage with indexed fields, conversation grouping, search queries, and customizable auto-deletion retention policies (1 day, 2 days, or Never).
7. **Modern Jetpack Compose UI:** Premium dark emerald design system with Onboarding, Home conversation list, Search, Filter Chips, "Deleted Only" filter, Chat Detail view with red deleted message indicators, and comprehensive Settings.
8. **Biometric Security:** Integration with `androidx.biometric` for fingerprint and facial authentication.
9. **Zero-Internet Architecture (v1.0.0):** Built strictly offline without `android.permission.INTERNET` to guarantee user privacy.

---

## 2. Comprehensive Codebase Inventory

```
C:\RIMON[confidential]\whatsapp deleted messege viewer app\Nseen\Nseen\
├── build.gradle.kts                # Root project build script
├── settings.gradle.kts             # Plugin management & project include (:app)
├── gradle.properties               # JVM args (4GB heap, AndroidX, Jetpack Compose)
├── gradlew / gradlew.bat           # Gradle wrapper scripts
├── Nseen-v1.0.0.apk                # Ready-to-install compiled beta release
└── app/
    ├── build.gradle.kts            # App module dependencies (Compose BOM 2024.10.01, Room 2.6.1, KSP)
    ├── proguard-rules.pro          # Obfuscation rules
    └── src/main/
        ├── AndroidManifest.xml     # Permissions, MainActivity, and MsgListenerService declaration
        ├── res/                    # Drawables, mipmaps, strings.xml, themes.xml
        └── java/com/nseen/app/
            ├── NseenApplication.kt         # Application class; initializes AppContainer
            ├── di/
            │   └── AppContainer.kt         # Manual Dependency Injection (NseenDatabase, MessageRepository, AppPreferences)
            ├── data/
            │   ├── local/
            │   │   ├── NseenDatabase.kt    # Room database declaration (version 1)
            │   │   ├── dao/
            │   │   │   └── MessageDao.kt   # SQL queries for CRUD, search, deletion detection, retention cleanup
            │   │   └── entity/
            │   │       ├── MessageEntity.kt        # Primary messages table schema
            │   │       └── ConversationSummary.kt  # POJO grouping messages by conversation
            │   ├── preferences/
            │   │   └── AppPreferences.kt   # SharedPreferences wrapper (retention, biometric, monitored apps)
            │   └── repository/
            │       └── MessageRepository.kt# Repository mediating Room queries and UI Flows
            ├── license/
            │   ├── DeviceFingerprintHelper.kt  # MediaDrm + ANDROID_ID hardware binding
            │   ├── LicenseModel.kt             # LicenseInfo data model & LicenseState machine
            │   ├── LicenseManager.kt           # State controller, tamper-proof signature, 14-day grace
            │   ├── PaymentManager.kt           # bKash, Nagad, Rocket TrxID validator & gateway hooks
            │   └── GoogleAuthHelper.kt         # Google Identity & Sign-In integration
            ├── service/
            │   ├── MsgListenerService.kt   # Android NotificationListenerService implementation
            │   ├── engine/
            │   │   ├── DeletionDetector.kt # O(1) set + Bengali & multilingual deletion matching
            │   │   ├── NotificationParser.kt# MessagingStyle and text parser
            │   │   └── Deduplicator.kt     # LRU cache + timestamp deduplication
            │   └── util/
            │       └── ServiceRebindHelper.kt # OEM task-killer recovery helper
            └── ui/
                ├── MainActivity.kt         # Single activity holding Compose NavHost & License Gatekeeper
                ├── navigation/
                │   └── Screen.kt           # Routes: Onboarding, Paywall, Home, Detail, Settings
                ├── screens/
                │   ├── onboarding/
                │   │   └── OnboardingScreen.kt # Permissions setup & updated privacy policy
                │   ├── paywall/
                │   │   └── PaywallScreen.kt    # 150 BDT lifetime proposition & bKash/Nagad checkout
                │   ├── home/
                │   │   ├── HomeScreen.kt       # Conversation list, PRO 150৳ badge, search, filters
                │   │   └── HomeViewModel.kt    # UI state manager for conversations
                │   ├── detail/
                │   │   ├── DetailScreen.kt     # Chat view with red deleted message cards
                │   │   └── DetailViewModel.kt  # UI state manager for chat history
                │   └── settings/
                │       └── SettingsScreen.kt   # Account & License card, app toggles, retention, biometrics
                ├── theme/
                │   ├── Color.kt            # Emerald, Dark Surface, Deleted Red, BkashPink, NagadOrange
                │   ├── Theme.kt            # Material 3 Theme setup
                │   └── Type.kt             # Typography
                └── util/
                    ├── PermissionUtils.kt  # Notification access verification helper
                    └── UiUtils.kt          # Timestamp formatting, app labels & emojis
```

---

## 3. How the Deletion Detection Engine Functions

1. **Incoming Notification:** An individual sends a WhatsApp message: *"Meet me at 8 PM"*.
2. **Notification Listener Capture:** `MsgListenerService` receives a `StatusBarNotification`.
3. **Parsing:** `NotificationParser.parse()` extracts the package (`com.whatsapp`), sender (*"Rahim"*), text (*"Meet me at 8 PM"*), and timestamp.
4. **Storage:** The message is saved into Room SQLite (`isDeleted = false`).
5. **Deletion Event:** 5 minutes later, Rahim taps "Delete for Everyone" in WhatsApp.
6. **Deletion Notification:** WhatsApp pushes a silent or brief notification: *"This message was deleted"*.
7. **Interception & Match:** `MsgListenerService` receives the notification. `DeletionDetector.isDeletion(text)` evaluates to `true` (via hash set or regex).
8. **Retroactive Flagging:**
   ```kotlin
   val original = repository.getLatestActiveMessageFromSender(packageName, sender)
   if (original != null) {
       repository.markMessageAsDeleted(original.id)
   }
   ```
9. **User Experience:** Nseen does NOT store the phrase *"This message was deleted"*. Instead, the original text *"Meet me at 8 PM"* is flagged with `isDeleted = true`. On the Home screen and Chat screen, a prominent red `DELETED` badge appears next to the exact message Rahim tried to erase.

---

## 4. The Business Model: 150 BDT Lifetime Subscription

### Product Strategy:
* **Pricing:** 150 BDT (Bangladeshi Taka) — One-time payment for lifetime access.
* **Target Audience:** Android users in Bangladesh wanting to read deleted WhatsApp/Messenger messages.
* **Security Rule:** **1 User = 1 Device**.
  * A user cannot share their login or subscription with friends or family on multiple phones.
  * If the user uninstalls the app and reinstalls it on the **same phone**, their subscription **MUST automatically restore** when they sign in with their Google account.
  * If the user attempts to sign into another phone, the app will reject the license and prompt them that the license is already bound to their original device.

---

## 5. Technical Architecture for Device Binding (The "MAC Address" Solution)

### The Problem with Physical MAC Addresses on Android:
* Starting with **Android 6.0 (Marshmallow)**, calling `WifiInfo.getMacAddress()` always returns the dummy address `02:00:00:00:00:00`.
* Starting with **Android 10 (API 29)**, Android strictly enforces randomized MAC addresses for privacy. Third-party apps are prohibited from accessing the hardware MAC address under any circumstance.

### The Modern, Indestructible Solution: Hardware Device Fingerprint
Instead of raw MAC address, we generate a cryptographically deterministic hardware fingerprint combining:
1. `Settings.Secure.getString(context.contentResolver, Settings.Secure.ANDROID_ID)`: Unique to the app signing key and device.
2. `MediaDrm` Widevine Hardware Device Unique ID:
   ```kotlin
   val widevineUuid = UUID(-0x121074568629b532L, -0x5c37d823262d3db1L)
   val mediaDrm = MediaDrm(widevineUuid)
   val deviceUniqueId = mediaDrm.getPropertyByteArray(MediaDrm.PROPERTY_DEVICE_UNIQUE_ID)
   ```
   *This ID is hardware-fused into the phone's DRM chip. It does NOT change when an app is uninstalled or reinstalled.*
3. **Hashing:** We combine `ANDROID_ID + DRM_DEVICE_ID + AppSalt` into a SHA-256 hash. This represents the phone's unique, permanent hardware identifier (`bound_device_id`).

### The Dual-Lock Formula: Google Account + Hardware Fingerprint
A license record in the backend contains:
```json
{
  "google_uid": "4f9d8a7c6b5e...",
  "email": "user@gmail.com",
  "bound_device_id": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "is_lifetime_active": true,
  "payment_amount": 150,
  "currency": "BDT",
  "payment_method": "bKash",
  "transaction_id": "BKH92817462",
  "activated_at": 1729000000000
}
```

### Flow 1: New Purchase (150 BDT)
1. User installs Nseen.
2. User signs in with Google (captures `google_uid` and `email`).
3. App generates local `bound_device_id`.
4. User pays 150 BDT via bKash / Nagad.
5. Server writes the record with `is_lifetime_active = true` and binds `bound_device_id`.
6. App unlocks full functionality.

### Flow 2: Uninstall & Reinstall on the SAME Device (Seamless Restore)
1. User uninstalls Nseen from Phone A.
2. Later, user reinstalls Nseen on Phone A.
3. User signs into their Google account (`user@gmail.com`).
4. App generates Phone A's hardware fingerprint (`bound_device_id`).
5. App contacts server: *"Check license for `google_uid` on `bound_device_id`"*.
6. Server checks:
   * `record.is_lifetime_active == true` [PASS]
   * `record.bound_device_id == current_device_id` [PASS]
7. **Result:** License instantly restored! No second payment required.

### Flow 3: Attempt to Share Account on Another Device (Anti-Fraud / Device Lock)
1. User gives their Google login to a friend on Phone B.
2. Friend installs Nseen on Phone B and signs in with `user@gmail.com`.
3. App generates Phone B's hardware fingerprint (`bound_device_id_B`).
4. App contacts server: *"Check license for `google_uid` on `bound_device_id_B`"*.
5. Server checks:
   * `record.bound_device_id` (`Phone A`) != `current_device_id` (`Phone B`) [MISMATCH]
6. **Result:** ACCESS DENIED. The app displays:
   > *"License Locked: This 150 BDT lifetime license is already registered to another phone. Each phone requires its own license."*

---

## 6. Privacy Architecture with Internet Permission

In version 1.0.0, the app has NO internet permission and highlights *"No internet. 100% private."*

When adding Google Sign-In and Licensing, we must add:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

### How to Maintain 100% User Trust:
1. **Clear Disclosures in UI:**
   * "Internet access is used EXCLUSIVELY to verify your 150 BDT lifetime subscription and Google account."
   * "Your messages, notifications, and chats NEVER leave this phone and are NEVER sent to any server."
2. **Codebase Guarantee:**
   * Room Database and `MessageRepository` remain completely isolated from network classes.
   * Only `LicenseManager` and Firebase Auth are permitted to use network calls.

---

## 7. Bangladesh Payment Integration Strategies

### Option A: Direct Mobile Banking (bKash / Nagad Personal or Send Money)
* **How it works:**
  1. Paywall shows: *"Send 150 BDT to 017xxxxxxxx (bKash/Nagad Personal)"*.
  2. User completes transaction in their bKash/Nagad app and gets a Transaction ID (TrxID).
  3. User pastes TrxID into Nseen.
  4. Backend verifies TrxID (either automatically via webhook/SMS forwarder or quick admin approval dashboard) and activates the license.
* **Pros:** Zero gateway fees, 100% familiar to all Bangladeshi users.

### Option B: Automated Merchant Gateway (bKash Tokenized Checkout / Shurjopay / Aamarpay)
* **How it works:**
  1. User taps "Pay 150 BDT".
  2. An in-app bKash checkout sheet opens.
  3. User enters bKash PIN & OTP.
  4. 150 BDT is debited instantly; webhook callback auto-activates the license in under 2 seconds.
* **Pros:** 100% automated, instant activation, zero manual effort.

---

## 8. Offline Resilience (Grace Period)

What if the user travels or doesn't have mobile data / Wi-Fi?
* Once a license is verified, the app saves an encrypted cryptographic license token into Android `EncryptedSharedPreferences`.
* The user can use Nseen completely offline for up to **14 days** before the app requires a quick internet handshake to refresh the license.

---

## 9. Current Status & Remaining Launch Steps

The entire core monetization and device-binding engine has been successfully implemented and integrated:
1. `DeviceFingerprintHelper.kt` extracts Widevine `MediaDrm` + `ANDROID_ID` hardware identifiers.
2. `GoogleAuthHelper.kt` handles Google Account verification.
3. `LicenseManager.kt` enforces strict 1 Account = 1 Physical Phone binding with tamper-proof signatures and 14-day offline grace.
4. `PaymentManager.kt` validates bKash, Nagad, and Rocket TrxIDs with automated hooks.
5. `PaywallScreen.kt` provides an in-app checkout experience with copy-number and submission.
6. `MainActivity.kt` enforces the licensing gatekeeper before granting access to chats.
7. `DeletionDetector.kt` natively detects Bengali WhatsApp deletion notices.

### Remaining Steps for Final Market Distribution:
1. Update real merchant/personal bKash & Nagad numbers in `PaymentManager.kt`.
2. Connect live webhook or cloud database (Firebase / Supabase) if auto-reconciliation is desired.
3. Enable ProGuard / R8 in `app/build.gradle.kts` to protect the signature salts from APK decompilation.
4. Build signed production release APK: `Nseen-v1.1.0-pro.apk`.
5. Verify reinstall & device-lock behavior on physical test devices.
