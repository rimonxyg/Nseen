# TASKS & PROGRESS TRACKER - NSEEN

> Project: **Nseen (Deleted Message Viewer)**  
> Package: `com.nseen.app`  
> Target: Android (Kotlin 2.0, Jetpack Compose Material 3, Room SQLite)  
> Version: 1.1.0 (Lifetime Pro Edition)  
> Business Model: **150 BDT One-Time Lifetime Subscription per User & Device (Google Auth + Hardware Fingerprint Binding)**

---

## Part 1: Core Engine & Features (Built by Original Developer)

### 1.1 Architecture & Build Setup
- [x] Android Studio project configuration with Gradle Kotlin DSL (`build.gradle.kts`)
- [x] Target SDK 35, Compile SDK 37, Min SDK 26 (Android 8.0 Oreo to Android 15+)
- [x] Kotlin 2.0 with Jetpack Compose Compiler Plugin & KSP
- [x] Clean architecture package organization (`data`, `di`, `service`, `ui`, `license`)
- [x] Application subclass (`NseenApplication`) initializing manual DI container (`AppContainer`)
- [x] Material 3 Dark Emerald Theme (`Theme.kt`, `Color.kt`, `Type.kt`) with brand colors (`NseenGreen`, `DeletedBadgeColor`)

### 1.2 Notification Interception & Engine
- [x] `MsgListenerService` extending `NotificationListenerService`
- [x] `AndroidManifest.xml` registration with `android.permission.BIND_NOTIFICATION_LISTENER_SERVICE`
- [x] Smart parsing in `NotificationParser.kt`:
  - [x] Extraction of `NotificationCompat.MessagingStyle` (extracts individual bundled messages)
  - [x] Fallback parsing using `EXTRA_BIG_TEXT`, `EXTRA_TEXT`, `EXTRA_TITLE`, and `EXTRA_CONVERSATION_TITLE`
  - [x] Filter out group summaries (`FLAG_GROUP_SUMMARY`) and ongoing notifications (`FLAG_ONGOING_EVENT`)
- [x] Smart Deletion Detection in `DeletionDetector.kt`:
  - [x] O(1) Set lookup for known deletion phrases across multiple languages (English, Spanish, Portuguese, French, German, Arabic, Turkish)
  - [x] Native Bengali deletion strings added for Bangladesh market ("এই বার্তাটি মুছে ফেলা হয়েছে", "আপনি এই বার্তাটি মুছে ফেলেছেন", etc.)
  - [x] Multilingual fallback regex pattern for WhatsApp, Telegram, Messenger, Instagram
  - [x] Retroactive message flagging: Updates the original active message to `isDeleted = true` instead of storing the message deleted string
- [x] Dual-Layer Deduplication in `Deduplicator.kt`:
  - [x] Layer 1: In-memory LRU cache (`LruCache`) with SHA-256 message signatures
  - [x] Layer 2: Database timestamp cutoff window (5000ms sliding window)
- [x] OEM Reliability Service Rebind Helper (`ServiceRebindHelper.kt`) to automatically recover from aggressive battery managers (MIUI, OneUI, ColorOS)

### 1.3 Multi-App Support
- [x] WhatsApp (`com.whatsapp`)
- [x] WhatsApp Business (`com.whatsapp.w4b`)
- [x] Telegram (`org.telegram.messenger`)
- [x] Facebook Messenger (`com.facebook.orca`)
- [x] Instagram Direct (`com.instagram.android`)
- [x] Dynamic app filter chips with custom app emojis and colors

### 1.4 Local Database & Persistence
- [x] Room Database (`NseenDatabase.kt`) version 1
- [x] `MessageEntity.kt` with composite indices (`packageName`, `sender`, `conversation`, `timestamp`, `isDeleted`)
- [x] `MessageDao.kt`:
  - [x] Reactive Flow queries for all messages, messages by package, conversation, and deleted messages
  - [x] Full-text search query across message text, sender, and conversation
  - [x] Duplicate lookup and deletion mutation queries
  - [x] Conversation deletion and total wipe queries
  - [x] Auto-retention message pruning query (`deleteOlderThan`)
- [x] `MessageRepository.kt` with reactive grouping of raw messages into `ConversationSummary` flows
- [x] `AppPreferences.kt` via SharedPreferences with reactive Flow observer

### 1.5 User Interface (Jetpack Compose)
- [x] **Onboarding Screen (`OnboardingScreen.kt`)**:
  - [x] Animated pulsating logo and brand presentation
  - [x] Feature overview cards (Smart Capture, Deletion Detection, 100% Private Messages)
  - [x] Real-time permission status check & direct button to system Notification Access Settings
- [x] **Home Screen (`HomeScreen.kt`)**:
  - [x] Top bar with emerald "PRO 150৳" badge, search input, and settings shortcut
  - [x] Filter chips by application (All, WhatsApp, Telegram, Instagram, etc.)
  - [x] "Deleted" filter toggle chip with vivid red badge
  - [x] Conversation card list displaying app badge, sender, timestamp, unread counter, and DELETED red badge
  - [x] Long-press to delete conversation dialog
  - [x] Empty state graphics and guidance
- [x] **Detail Screen (`DetailScreen.kt`)**:
  - [x] Chronological message bubbles with sender separation
  - [x] Prominent red card styling for deleted messages with timestamp
  - [x] Automatic scroll-to-bottom on new incoming messages
  - [x] Individual message deletion capability
- [x] **Settings Screen (`SettingsScreen.kt`)**:
  - [x] Per-app toggle switches for monitored platforms
  - [x] Auto-delete retention policy selector (1 day, 2 days, Never)
  - [x] Biometric lock toggle (Fingerprint / Face ID)
  - [x] Direct link to Disable Battery Optimization
  - [x] Direct link to Notification Listener Settings
  - [x] Clear All Saved Messages with confirmation alert

---

## Part 2: Monetization, Licensing & Launch System (Completed & Ready)

### 2.1 Security & Identity Infrastructure
- [x] Added `android.permission.INTERNET` and `android.permission.ACCESS_NETWORK_STATE` to `AndroidManifest.xml` (dedicated strictly to licensing)
- [x] Hardware Device Fingerprint Generator (`DeviceFingerprintHelper.kt`):
  - [x] Extracts `Settings.Secure.ANDROID_ID`
  - [x] Extracts hardware-level Widevine `MediaDrm` Device Unique ID (hardware-fused, survives uninstalls)
  - [x] Generates salted SHA-256 deterministic Device ID
  - [x] Formats human-readable snippet for UI (`DEV-XXXX-YYYY`)
  - [x] *(Note: Physical MAC address is blocked on Android 10+; this hardware fingerprint serves as the exact modern equivalent)*
- [x] Google Account Authentication Helper (`GoogleAuthHelper.kt`):
  - [x] Handles user sign-in, capturing verified Google email and unique Google UID
  - [x] Multi-account selection and switching

### 2.2 Licensing Architecture & Firebase Backend
- [x] License Data Models (`LicenseModel.kt`):
  - [x] `LicenseInfo` (isLifetimeActive, googleUid, email, boundDeviceId, activatedAt, transactionId, paymentMethod, amountBdt = 150)
  - [x] `LicenseState` state machine (`Unauthenticated`, `Checking`, `Unlicensed`, `Active`, `DeviceMismatch`, `OfflineGrace`, `Error`)
- [x] Firebase Cloud Integration (`FirebaseLicenseService.kt`):
  - [x] Firebase BOM 33.8.0, Firebase Auth & Cloud Firestore setup
  - [x] Google Play Services Auth (`play-services-auth:21.3.0`)
  - [x] Cloud license document lookup (`licenses/{googleUid}`)
  - [x] Cloud hardware device matching (restoration vs rejection)
  - [x] `firestore.rules` security rules file
  - [x] `app/google-services.json` configuration template
- [x] State Controller (`LicenseManager.kt`):
  - [x] Cryptographic tamper-proof local signature verification (prevents editing SharedPreferences)
  - [x] Strict device binding validation (prevents sharing 1 license across multiple phones)
  - [x] 14-day offline grace period for users without continuous internet
  - [x] Automatic license restoration on reinstallation on the same phone
  - [x] Real-time cloud sync with Firebase Firestore
- [x] Dependency Container Injection (`AppContainer.kt`):
  - [x] Provides single `licenseManager` instance across ViewModels and Services

### 2.3 Bangladesh Payment Gateway & Checkout Flow
- [x] Payment Engine (`PaymentManager.kt`):
  - [x] Native support for **bKash**, **Nagad**, and **Rocket**
  - [x] Standard 150 BDT lifetime pricing configuration
  - [x] Real-time TrxID alphanumeric format validator
  - [x] Extensible cloud API hook for automated verification
- [x] Interactive in-app payment bottom sheet in `PaywallScreen.kt`:
  - [x] Brand-colored method selector tabs (bKash Pink, Nagad Orange, Rocket Purple)
  - [x] One-tap copy payment number with clipboard integration and toast
  - [x] Step-by-step Bengali & English instructions (Send Money 150 ৳ -> Copy TrxID -> Submit)
  - [x] Sender mobile number and TrxID input fields with validation and loading spinner

### 2.4 In-App Paywall & License Gatekeeper
- [x] Premium Paywall Screen (`PaywallScreen.kt`):
  - [x] Material 3 Dark Emerald hero header with pulsating badge
  - [x] 150 ৳ Lifetime pricing tag (এককালীন পেমেন্ট, আজীবনের সুবিধা)
  - [x] 4 Core value proposition cards with emerald checkmarks
  - [x] Device-lock transparency card explaining the 1 User = 1 Phone rule
  - [x] Google Account Sign-In dialog & status chip
  - [x] Interactive bKash / Nagad checkout BottomSheet
  - [x] "পূর্বের ক্রয় রিস্টোর করুন (Restore)" button
- [x] Gatekeeper enforcement in `MainActivity.kt`:
  - [x] Startup routing: Unlicensed/unauthenticated users are routed directly to `PaywallScreen`
  - [x] Instant unlock to `HomeScreen` once 150 ৳ payment is verified or restored
  - [x] Clean exit if unpaid user cancels root paywall

### 2.5 Privacy Disclosures & Settings Integration
- [x] Privacy policy update in `OnboardingScreen.kt`:
  - [x] Clarifies that intercepted messages remain 100% on-device; network is strictly used for 150 ৳ license verification
- [x] "Account & License" section in `SettingsScreen.kt`:
  - [x] Displays connected Google email
  - [x] Displays unique Device Fingerprint ID (`DEV-XXXX-YYYY`)
  - [x] Displays live license status (Active Lifetime 150 ৳ or Free/Unlicensed)
  - [x] Direct shortcut to Paywall / License Management

---

- [x] Connect production cloud database (Firebase `nseen-b0674` configured with `google-services.json`)
- [x] Configure real bKash / Nagad numbers in `PaymentManager.kt` (`01576520816`)
- [x] Set up automated GitHub Actions cloud build CI/CD pipeline
- [x] Generate signed release APK: `Nseen-v1.1.0-pro-apks` built successfully in GitHub Actions Run #4
- [x] Create comprehensive, fully editable UAT specification document (`Nseen_v1.1.0_UAT_Test_Specification.docx`)
- [ ] Complete in Firebase Console: Enable Google Sign-In & Publish Firestore Rules


