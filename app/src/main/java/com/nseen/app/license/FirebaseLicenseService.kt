package com.nseen.app.license

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.tasks.await
import kotlinx.coroutines.withContext

/**
 * Handles cloud licensing persistence, Google authentication, and device-binding verification via Firebase.
 */
object FirebaseLicenseService {

    private const val COLLECTION_LICENSES = "licenses"

    private val auth: FirebaseAuth? by lazy {
        try {
            FirebaseAuth.getInstance()
        } catch (e: Exception) {
            null
        }
    }

    private val firestore: FirebaseFirestore? by lazy {
        try {
            FirebaseFirestore.getInstance()
        } catch (e: Exception) {
            null
        }
    }

    /**
     * Checks Firebase Firestore for an existing lifetime license associated with [googleUid].
     */
    suspend fun fetchLicense(googleUid: String, currentDeviceId: String): Result<LicenseInfo?> = withContext(Dispatchers.IO) {
        val db = firestore ?: return@withContext Result.failure(Exception("Firebase not initialized"))

        try {
            val snapshot = db.collection(COLLECTION_LICENSES).document(googleUid).get().await()
            if (!snapshot.exists()) {
                return@withContext Result.success(null)
            }

            val isActive = snapshot.getBoolean("is_lifetime_active") ?: false
            val boundDeviceId = snapshot.getString("bound_device_id") ?: ""
            val email = snapshot.getString("email") ?: ""
            val trxId = snapshot.getString("transaction_id") ?: ""
            val method = snapshot.getString("payment_method") ?: "bKash"
            val activatedAt = snapshot.getLong("activated_at") ?: System.currentTimeMillis()

            val license = LicenseInfo(
                isLifetimeActive = isActive,
                googleUid = googleUid,
                email = email,
                boundDeviceId = boundDeviceId,
                activatedAt = activatedAt,
                transactionId = trxId,
                paymentMethod = method,
                amountBdt = PaymentManager.LICENSE_PRICE_BDT,
                lastVerifiedAt = System.currentTimeMillis()
            )

            Result.success(license)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Activates or registers a new 150 BDT lifetime license in Firebase Firestore bound to [boundDeviceId].
     */
    suspend fun saveLicense(
        googleUid: String,
        email: String,
        boundDeviceId: String,
        transactionId: String,
        paymentMethod: String
    ): Result<LicenseInfo> = withContext(Dispatchers.IO) {
        val db = firestore ?: return@withContext Result.failure(Exception("Firebase not initialized"))

        try {
            val now = System.currentTimeMillis()
            val licenseData = hashMapOf(
                "google_uid" to googleUid,
                "email" to email,
                "bound_device_id" to boundDeviceId,
                "is_lifetime_active" to true,
                "payment_amount" to PaymentManager.LICENSE_PRICE_BDT,
                "currency" to "BDT",
                "payment_method" to paymentMethod,
                "transaction_id" to transactionId,
                "activated_at" to now,
                "last_verified_at" to now
            )

            db.collection(COLLECTION_LICENSES).document(googleUid).set(licenseData).await()

            val license = LicenseInfo(
                isLifetimeActive = true,
                googleUid = googleUid,
                email = email,
                boundDeviceId = boundDeviceId,
                activatedAt = now,
                transactionId = transactionId,
                paymentMethod = paymentMethod,
                amountBdt = PaymentManager.LICENSE_PRICE_BDT,
                lastVerifiedAt = now
            )

            Result.success(license)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
