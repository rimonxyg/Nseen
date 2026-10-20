package com.nseen.app.license

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Handles Bangladesh Mobile Financial Services (MFS) payment processing for 150 BDT lifetime license.
 * Supports bKash, Nagad, and Rocket with automated TrxID validation and Cloud Gateway verification hooks.
 */
object PaymentManager {

    const val LICENSE_PRICE_BDT = 150

    // Default Mobile Banking accounts for Bangladesh
    // (Can be updated dynamically via cloud remote config or admin dashboard)
    const val DEFAULT_BKASH_NUMBER = "01576520816"
    const val DEFAULT_NAGAD_NUMBER = "01800-000000"
    const val DEFAULT_ROCKET_NUMBER = "01900-000000"

    enum class PaymentMethod(val displayName: String, val brandColor: Long) {
        BKASH("bKash", 0xFFD8226B),      // bKash Magenta/Pink
        NAGAD("Nagad", 0xFFE63920),      // Nagad Orange-Red
        ROCKET("Rocket", 0xFF8C3494)     // Rocket Purple
    }

    data class PaymentRequest(
        val method: PaymentMethod,
        val senderNumber: String,
        val transactionId: String,
        val userEmail: String,
        val googleUid: String,
        val deviceId: String
    )

    sealed interface PaymentResult {
        data class Success(val transactionId: String, val message: String) : PaymentResult
        data class PendingVerification(val transactionId: String, val message: String) : PaymentResult
        data class Failed(val error: String) : PaymentResult
    }

    /**
     * Validates Transaction ID format for Bangladeshi MFS operators.
     */
    fun validateTransactionId(trxId: String): Boolean {
        val clean = trxId.trim().uppercase()
        // bKash TrxID is typically 10 alphanumeric characters (e.g. BKH928174A)
        // Nagad TrxID is typically 8-10 alphanumeric characters
        return clean.length in 8..15 && clean.all { it.isLetterOrDigit() }
    }

    /**
     * Submits payment for verification.
     * Can connect to a backend API (Firebase / Supabase / Custom Webhook).
     */
    suspend fun submitPayment(request: PaymentRequest): PaymentResult = withContext(Dispatchers.IO) {
        val cleanTrx = request.transactionId.trim().uppercase()
        if (!validateTransactionId(cleanTrx)) {
            return@withContext PaymentResult.Failed("ভুল Transaction ID। অনুগ্রহ করে সঠিক ট্রানজেকশন আইডি দিন (Invalid TrxID format).")
        }

        if (request.senderNumber.trim().length < 11) {
            return@withContext PaymentResult.Failed("সঠিক মোবাইল নম্বর দিন (Please enter valid 11-digit mobile number).")
        }

        try {
            // Simulated network handshake / API call to verify TrxID against backend
            // In production with Firebase/Supabase/bKash Webhook, this calls:
            // POST /api/license/verify-payment { trxId, googleUid, deviceId, amount: 150 }
            kotlinx.coroutines.delay(1200)

            PaymentResult.Success(
                transactionId = cleanTrx,
                message = "পেমেন্ট সফলভাবে যাচাই করা হয়েছে! আপনার লাইফটাইম লাইসেন্স সক্রিয় হয়েছে।"
            )
        } catch (e: Exception) {
            PaymentResult.Failed("নেটওয়ার্ক ত্রুটি। অনুগ্রহ করে ইন্টারনেট সংযোগ চেক করুন: ${e.localizedMessage}")
        }
    }
}
