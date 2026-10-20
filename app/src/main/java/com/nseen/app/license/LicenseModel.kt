package com.nseen.app.license

/**
 * Data representation of the user's 150 BDT Lifetime License.
 */
data class LicenseInfo(
    val isLifetimeActive: Boolean = false,
    val googleUid: String = "",
    val email: String = "",
    val boundDeviceId: String = "",
    val activatedAt: Long = 0L,
    val transactionId: String = "",
    val paymentMethod: String = "bKash",
    val amountBdt: Int = 150,
    val lastVerifiedAt: Long = 0L,
    val signature: String = ""
)

/**
 * Represents the current licensing state of the application.
 */
sealed interface LicenseState {
    /** User has not signed in with their Google account yet. */
    data object Unauthenticated : LicenseState

    /** Actively querying backend or verifying transaction. */
    data class Checking(val message: String = "Verifying license...") : LicenseState

    /** Signed in with Google, but no active 150 BDT license found. */
    data class Unlicensed(
        val email: String,
        val googleUid: String,
        val deviceId: String
    ) : LicenseState

    /** Active lifetime license valid for this specific hardware device. */
    data class Active(
        val license: LicenseInfo
    ) : LicenseState

    /**
     * Account is paid, but bound to another physical phone.
     * Prevents sharing 1 license across multiple phones.
     */
    data class DeviceMismatch(
        val email: String,
        val registeredDeviceId: String,
        val currentDeviceId: String
    ) : LicenseState

    /**
     * Verified license running offline within the 14-day grace period.
     */
    data class OfflineGrace(
        val license: LicenseInfo,
        val daysRemaining: Int
    ) : LicenseState

    /** Generic verification or network failure. */
    data class Error(
        val message: String
    ) : LicenseState
}
