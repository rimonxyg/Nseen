package com.nseen.app.data.preferences

import android.content.Context
import android.content.SharedPreferences
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow

class AppPreferences(context: Context) {

    private val prefs: SharedPreferences = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    companion object {
        private const val PREFS_NAME = "nseen_preferences"
        const val KEY_ONBOARDING_COMPLETED = "onboarding_completed"
        const val KEY_RETENTION_DAYS = "retention_days"
        const val KEY_BIOMETRIC_LOCK = "biometric_lock"
        const val KEY_APP_WHATSAPP = "app_whatsapp"
        const val KEY_APP_WHATSAPP_BUSINESS = "app_whatsapp_business"
        const val KEY_APP_MESSENGER = "app_messenger"
        const val KEY_APP_INSTAGRAM = "app_instagram"
        const val KEY_APP_TELEGRAM = "app_telegram"

        const val PACKAGE_WHATSAPP = "com.whatsapp"
        const val PACKAGE_WHATSAPP_BUSINESS = "com.whatsapp.w4b"
        const val PACKAGE_MESSENGER = "com.facebook.orca"
        const val PACKAGE_INSTAGRAM = "com.instagram.android"
        const val PACKAGE_TELEGRAM = "org.telegram.messenger"

        val DEFAULT_SUPPORTED_PACKAGES = setOf(
            PACKAGE_WHATSAPP,
            PACKAGE_WHATSAPP_BUSINESS,
            PACKAGE_MESSENGER,
            PACKAGE_INSTAGRAM,
            PACKAGE_TELEGRAM
        )
    }

    var isOnboardingCompleted: Boolean
        get() = prefs.getBoolean(KEY_ONBOARDING_COMPLETED, false)
        set(value) = prefs.edit().putBoolean(KEY_ONBOARDING_COMPLETED, value).apply()

    var retentionDays: Int
        get() = prefs.getInt(KEY_RETENTION_DAYS, 1) // Default: 1 day
        set(value) = prefs.edit().putInt(KEY_RETENTION_DAYS, value).apply()

    var isBiometricLockEnabled: Boolean
        get() = prefs.getBoolean(KEY_BIOMETRIC_LOCK, false)
        set(value) = prefs.edit().putBoolean(KEY_BIOMETRIC_LOCK, value).apply()

    fun isAppMonitored(packageName: String): Boolean {
        return when (packageName) {
            PACKAGE_WHATSAPP -> prefs.getBoolean(KEY_APP_WHATSAPP, true)
            PACKAGE_WHATSAPP_BUSINESS -> prefs.getBoolean(KEY_APP_WHATSAPP_BUSINESS, true)
            PACKAGE_MESSENGER -> prefs.getBoolean(KEY_APP_MESSENGER, true)
            PACKAGE_INSTAGRAM -> prefs.getBoolean(KEY_APP_INSTAGRAM, true)
            PACKAGE_TELEGRAM -> prefs.getBoolean(KEY_APP_TELEGRAM, true)
            else -> false
        }
    }

    fun setAppMonitored(packageName: String, enabled: Boolean) {
        val key = when (packageName) {
            PACKAGE_WHATSAPP -> KEY_APP_WHATSAPP
            PACKAGE_WHATSAPP_BUSINESS -> KEY_APP_WHATSAPP_BUSINESS
            PACKAGE_MESSENGER -> KEY_APP_MESSENGER
            PACKAGE_INSTAGRAM -> KEY_APP_INSTAGRAM
            PACKAGE_TELEGRAM -> KEY_APP_TELEGRAM
            else -> return
        }
        prefs.edit().putBoolean(key, enabled).apply()
    }

    fun observeMonitoredApps(): Flow<Map<String, Boolean>> = callbackFlow {
        fun sendCurrent() {
            trySend(
                mapOf(
                    PACKAGE_WHATSAPP to isAppMonitored(PACKAGE_WHATSAPP),
                    PACKAGE_WHATSAPP_BUSINESS to isAppMonitored(PACKAGE_WHATSAPP_BUSINESS),
                    PACKAGE_MESSENGER to isAppMonitored(PACKAGE_MESSENGER),
                    PACKAGE_INSTAGRAM to isAppMonitored(PACKAGE_INSTAGRAM),
                    PACKAGE_TELEGRAM to isAppMonitored(PACKAGE_TELEGRAM)
                )
            )
        }
        sendCurrent()

        val listener = SharedPreferences.OnSharedPreferenceChangeListener { _, _ ->
            sendCurrent()
        }
        prefs.registerOnSharedPreferenceChangeListener(listener)
        awaitClose { prefs.unregisterOnSharedPreferenceChangeListener(listener) }
    }
}
