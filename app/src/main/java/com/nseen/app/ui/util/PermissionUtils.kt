package com.nseen.app.ui.util

import android.content.Context
import android.os.PowerManager
import android.provider.Settings
import com.nseen.app.data.preferences.AppPreferences

/**
 * Utility functions for checking runtime permission states.
 */
object PermissionUtils {

    /**
     * Returns true if the Notification Listener Service permission has been granted.
     */
    fun isNotificationListenerEnabled(context: Context): Boolean {
        val flat = Settings.Secure.getString(
            context.contentResolver,
            "enabled_notification_listeners"
        ) ?: return false
        return flat.contains(context.packageName)
    }

    /**
     * Returns true if the app is already excluded from battery optimizations.
     * When false, the service is at risk of being killed by the system on OEM devices.
     */
    fun isBatteryOptimizationIgnored(context: Context): Boolean {
        val pm = context.getSystemService(Context.POWER_SERVICE) as PowerManager
        return pm.isIgnoringBatteryOptimizations(context.packageName)
    }
}
