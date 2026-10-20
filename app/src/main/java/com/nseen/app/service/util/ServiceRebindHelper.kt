package com.nseen.app.service.util

import android.content.ComponentName
import android.content.Context
import android.provider.Settings
import android.service.notification.NotificationListenerService
import android.util.Log

/**
 * Helpers for OEM battery-optimization workarounds and service keepalive.
 *
 * Some OEMs (Xiaomi MIUI, Samsung One UI, Oppo ColorOS) aggressively kill background
 * services. When [NotificationListenerService.onListenerDisconnected] fires, Android
 * allows us to request rebinding via [requestRebind].
 */
object ServiceRebindHelper {

    private const val TAG = "ServiceRebindHelper"

    /**
     * Call from [NotificationListenerService.onListenerDisconnected] to ask Android
     * to rebind the service. If the listener has been killed by an OEM task killer,
     * this causes Android to reconnect it without user interaction (on stock ROMs).
     *
     * Note: This does NOT work after the user explicitly revokes notification access.
     */
    fun requestRebind(context: Context, serviceClass: Class<out NotificationListenerService>) {
        try {
            val component = ComponentName(context, serviceClass)
            NotificationListenerService.requestRebind(component)
            Log.i(TAG, "Requested rebind for ${serviceClass.simpleName}")
        } catch (e: Exception) {
            Log.e(TAG, "Rebind request failed: ${e.message}")
        }
    }

    /**
     * Returns true if notification listener access is currently granted to this app.
     */
    fun isListenerEnabled(context: Context): Boolean {
        val flat = Settings.Secure.getString(
            context.contentResolver,
            "enabled_notification_listeners"
        ) ?: return false
        return flat.contains(context.packageName)
    }
}
