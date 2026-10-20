package com.nseen.app.license

import android.content.Context
import android.content.SharedPreferences
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.security.MessageDigest

/**
 * Manages the 150 BDT Lifetime License lifecycle, device binding, and verification.
 * Enforces: 1 User Account = 1 Physical Hardware Device.
 */
class LicenseManager(private val context: Context) {

    private val prefs: SharedPreferences = context.getSharedPreferences(PREFS_LICENSE, Context.MODE_PRIVATE)
    private val scope = CoroutineScope(Dispatchers.IO)

    private val _licenseState = MutableStateFlow<LicenseState>(LicenseState.Checking())
    val licenseState: StateFlow<LicenseState> = _licenseState.asStateFlow()

    companion object {
        private const val PREFS_LICENSE = "nseen_secure_license_prefs"
        private const val KEY_IS_ACTIVE = "key_is_active"
        private const val KEY_GOOGLE_UID = "key_google_uid"
        private const val KEY_USER_EMAIL = "key_user_email"
        private const val KEY_BOUND_DEVICE_ID = "key_bound_device_id"
        private const val KEY_ACTIVATED_AT = "key_activated_at"
        private const val KEY_TRX_ID = "key_trx_id"
        private const val KEY_PAYMENT_METHOD = "key_payment_method"
        private const val KEY_LAST_VERIFIED_AT = "key_last_verified_at"
        private const val KEY_SIGNATURE = "key_signature"

        private const val OFFLINE_GRACE_DAYS = 14
        private const val SIGNATURE_SALT = "Nseen_BD_TamperProof_Signature_2026"
    }

    init {
        checkLicenseStatus()
    }

    /**
     * Checks current licensing and device-binding status.
     */
    fun checkLicenseStatus() {
        scope.launch {
            _licenseState.value = LicenseState.Checking("লাইসেন্স তথ্য যাচাই করা হচ্ছে...")

            val currentDeviceId = DeviceFingerprintHelper.getDeviceId(context)
            val googleUid = prefs.getString(KEY_GOOGLE_UID, null)
            val userEmail = prefs.getString(KEY_USER_EMAIL, null)

            // Step 1: Check if user is signed in with Google
            if (googleUid.isNullOrBlank() || userEmail.isNullOrBlank()) {
                _licenseState.value = LicenseState.Unauthenticated
                return@launch
            }

            val isActive = prefs.getBoolean(KEY_IS_ACTIVE, false)
            val boundDeviceId = prefs.getString(KEY_BOUND_DEVICE_ID, "") ?: ""
            val activatedAt = prefs.getLong(KEY_ACTIVATED_AT, 0L)
            val trxId = prefs.getString(KEY_TRX_ID, "") ?: ""
            val method = prefs.getString(KEY_PAYMENT_METHOD, "bKash") ?: "bKash"
            val lastVerified = prefs.getLong(KEY_LAST_VERIFIED_AT, 0L)
            val storedSignature = prefs.getString(KEY_SIGNATURE, "") ?: ""

            // Step 2: If not marked active, user is unlicensed
            if (!isActive) {
                _licenseState.value = LicenseState.Unlicensed(
                    email = userEmail,
                    googleUid = googleUid,
                    deviceId = currentDeviceId
                )
                return@launch
            }

            // Step 3: Verify local cryptographic integrity to prevent manual SharedPreferences manipulation
            val expectedSignature = generateSignature(googleUid, boundDeviceId, activatedAt)
            if (storedSignature != expectedSignature) {
                // Signature mismatch: tamper detected
                prefs.edit().clear().apply()
                _licenseState.value = LicenseState.Unlicensed(
                    email = userEmail,
                    googleUid = googleUid,
                    deviceId = currentDeviceId
                )
                return@launch
            }

            // Step 4: Strict Hardware Fingerprint Binding Check
            if (boundDeviceId != currentDeviceId) {
                // License was bought on Phone A, but user signed in on Phone B
                _licenseState.value = LicenseState.DeviceMismatch(
                    email = userEmail,
                    registeredDeviceId = boundDeviceId,
                    currentDeviceId = currentDeviceId
                )
                return@launch
            }

            // Step 5: Check Offline Grace Period (14 days)
            val now = System.currentTimeMillis()
            val daysSinceVerification = ((now - lastVerified) / (1000L * 60L * 60L * 24L)).toInt()

            val licenseInfo = LicenseInfo(
                isLifetimeActive = true,
                googleUid = googleUid,
                email = userEmail,
                boundDeviceId = boundDeviceId,
                activatedAt = activatedAt,
                transactionId = trxId,
                paymentMethod = method,
                amountBdt = PaymentManager.LICENSE_PRICE_BDT,
                lastVerifiedAt = lastVerified,
                signature = storedSignature
            )

            if (daysSinceVerification in 1..OFFLINE_GRACE_DAYS) {
                val daysRemaining = OFFLINE_GRACE_DAYS - daysSinceVerification
                _licenseState.value = LicenseState.OfflineGrace(licenseInfo, daysRemaining)
            } else {
                _licenseState.value = LicenseState.Active(licenseInfo)
            }
        }
    }

    /**
     * Activates a 150 BDT lifetime license and binds it to the current hardware device.
     */
    fun activateLifetimeLicense(
        googleUid: String,
        email: String,
        transactionId: String,
        paymentMethod: String
    ) {
        val currentDeviceId = DeviceFingerprintHelper.getDeviceId(context)
        val now = System.currentTimeMillis()
        val signature = generateSignature(googleUid, currentDeviceId, now)

        prefs.edit()
            .putBoolean(KEY_IS_ACTIVE, true)
            .putString(KEY_GOOGLE_UID, googleUid)
            .putString(KEY_USER_EMAIL, email)
            .putString(KEY_BOUND_DEVICE_ID, currentDeviceId)
            .putLong(KEY_ACTIVATED_AT, now)
            .putString(KEY_TRX_ID, transactionId)
            .putString(KEY_PAYMENT_METHOD, paymentMethod)
            .putLong(KEY_LAST_VERIFIED_AT, now)
            .putString(KEY_SIGNATURE, signature)
            .apply()

        val license = LicenseInfo(
            isLifetimeActive = true,
            googleUid = googleUid,
            email = email,
            boundDeviceId = currentDeviceId,
            activatedAt = now,
            transactionId = transactionId,
            paymentMethod = paymentMethod,
            amountBdt = PaymentManager.LICENSE_PRICE_BDT,
            lastVerifiedAt = now,
            signature = signature
        )
        _licenseState.value = LicenseState.Active(license)
    }

    /**
     * Restores an existing purchase (e.g., after an app uninstall and reinstall on the same device).
     */
    suspend fun restoreLicense(googleUid: String, email: String): Result<Boolean> {
        val currentDeviceId = DeviceFingerprintHelper.getDeviceId(context)

        // Simulated cloud query:
        // Checks cloud database for record matching (google_uid == googleUid)
        // If found, checks if (record.boundDeviceId == currentDeviceId)
        return try {
            // Check if there is an existing local record or cloud record
            val boundDeviceId = prefs.getString(KEY_BOUND_DEVICE_ID, currentDeviceId) ?: currentDeviceId
            if (boundDeviceId == currentDeviceId) {
                activateLifetimeLicense(
                    googleUid = googleUid,
                    email = email,
                    transactionId = prefs.getString(KEY_TRX_ID, "RESTORED_TX") ?: "RESTORED_TX",
                    paymentMethod = prefs.getString(KEY_PAYMENT_METHOD, "bKash") ?: "bKash"
                )
                Result.success(true)
            } else {
                _licenseState.value = LicenseState.DeviceMismatch(
                    email = email,
                    registeredDeviceId = boundDeviceId,
                    currentDeviceId = currentDeviceId
                )
                Result.failure(Exception("এই লাইসেন্সটি অন্য ফোনে নিবন্ধিত রয়েছে। এক লাইসেন্স কেবল একটি ফোনেই প্রযোজ্য।"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Stores Google user credentials upon successful sign-in.
     */
    fun onGoogleSignInSuccess(googleUid: String, email: String) {
        prefs.edit()
            .putString(KEY_GOOGLE_UID, googleUid)
            .putString(KEY_USER_EMAIL, email)
            .apply()
        checkLicenseStatus()
    }

    /**
     * Clears authentication and signs out.
     */
    fun signOut() {
        prefs.edit()
            .remove(KEY_GOOGLE_UID)
            .remove(KEY_USER_EMAIL)
            .apply()
        _licenseState.value = LicenseState.Unauthenticated
    }

    /**
     * Generates a tamper-proof cryptographic signature for the local license record.
     */
    private fun generateSignature(uid: String, deviceId: String, activatedAt: Long): String {
        val raw = "$uid::$deviceId::$activatedAt::$SIGNATURE_SALT"
        val md = MessageDigest.getInstance("SHA-256")
        return md.digest(raw.toByteArray(Charsets.UTF_8)).joinToString("") { "%02x".format(it) }
    }
}
