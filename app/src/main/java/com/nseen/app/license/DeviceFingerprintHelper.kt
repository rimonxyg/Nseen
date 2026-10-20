package com.nseen.app.license

import android.content.Context
import android.media.MediaDrm
import android.os.Build
import android.provider.Settings
import java.security.MessageDigest
import java.util.UUID

/**
 * Generates an immutable, cryptographically deterministic hardware device fingerprint.
 *
 * Why this is used instead of MAC Address:
 * Starting with Android 6.0 and strictly in Android 10+ (API 29-35+), Android blocks access
 * to the physical MAC address (WifiInfo.getMacAddress() returns dummy 02:00:00:00:00:00).
 *
 * This helper combines:
 * 1. Settings.Secure.ANDROID_ID (App-signing + Device specific)
 * 2. MediaDrm Widevine Hardware Device Unique ID (hardware-fused into the phone's DRM chip)
 * 3. Hardware board & manufacturer identifiers
 * 4. Application cryptographic salt
 *
 * The resulting SHA-256 fingerprint survives app uninstalls, reboots, and cache clears,
 * ensuring strict 1 User = 1 Device licensing for the 150 BDT lifetime model.
 */
object DeviceFingerprintHelper {

    // Widevine UUID is standardized across Android devices (EDEF8BA9-79D6-4ACE-A3C8-27DCD51D21ED)
    private val WIDEVINE_UUID = UUID(-0x121074568629b532L, -0x5c37d823262d3db1L)
    private const val SECURITY_SALT = "Nseen_BDT_150_Lifetime_Security_Salt_v1"

    /**
     * Deterministic SHA-256 device identifier.
     */
    fun getDeviceId(context: Context): String {
        val androidId = Settings.Secure.getString(
            context.contentResolver,
            Settings.Secure.ANDROID_ID
        ) ?: "UNKNOWN_ANDROID_ID"

        val drmId = getDrmDeviceId()
        val hardwareSignature = "${Build.MANUFACTURER}_${Build.MODEL}_${Build.BOARD}_${Build.HARDWARE}"

        val rawCombined = "$androidId::$drmId::$hardwareSignature::$SECURITY_SALT"
        return sha256(rawCombined)
    }

    /**
     * Extracts hardware-fused Widevine DRM unique ID.
     */
    private fun getDrmDeviceId(): String {
        return try {
            val mediaDrm = MediaDrm(WIDEVINE_UUID)
            val drmBytes = mediaDrm.getPropertyByteArray(MediaDrm.PROPERTY_DEVICE_UNIQUE_ID)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                mediaDrm.close()
            } else {
                @Suppress("DEPRECATION")
                mediaDrm.release()
            }
            drmBytes.joinToString("") { "%02x".format(it) }
        } catch (e: Exception) {
            // Safe fallback for emulators or devices without Widevine L1/L3
            "DRM_FALLBACK_${Build.FINGERPRINT}"
        }
    }

    /**
     * SHA-256 hex digest generator.
     */
    private fun sha256(input: String): String {
        val md = MessageDigest.getInstance("SHA-256")
        val bytes = md.digest(input.toByteArray(Charsets.UTF_8))
        return bytes.joinToString("") { "%02x".format(it) }
    }

    /**
     * Formats a short human-readable identifier for display in the UI (e.g. DEV-8F21-9B3C).
     */
    fun getDisplayDeviceId(context: Context): String {
        val fullId = getDeviceId(context)
        val part1 = fullId.take(4).uppercase()
        val part2 = fullId.takeLast(4).uppercase()
        return "DEV-$part1-$part2"
    }
}
