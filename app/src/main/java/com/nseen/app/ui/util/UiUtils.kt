package com.nseen.app.ui.util

import com.nseen.app.data.preferences.AppPreferences

/** Maps a package name to a display label. */
fun packageLabel(packageName: String): String = when (packageName) {
    AppPreferences.PACKAGE_WHATSAPP -> "WhatsApp"
    AppPreferences.PACKAGE_WHATSAPP_BUSINESS -> "WhatsApp Business"
    AppPreferences.PACKAGE_MESSENGER -> "Messenger"
    AppPreferences.PACKAGE_INSTAGRAM -> "Instagram"
    AppPreferences.PACKAGE_TELEGRAM -> "Telegram"
    else -> packageName
}

/** Maps a package name to an emoji icon (used before loading actual app icons). */
fun packageEmoji(packageName: String): String = when (packageName) {
    AppPreferences.PACKAGE_WHATSAPP -> "💬"
    AppPreferences.PACKAGE_WHATSAPP_BUSINESS -> "🏢"
    AppPreferences.PACKAGE_MESSENGER -> "📫"
    AppPreferences.PACKAGE_INSTAGRAM -> "📷"
    AppPreferences.PACKAGE_TELEGRAM -> "✈️"
    else -> "📩"
}

/** Formats a timestamp into a human-readable short string. */
fun formatTimestamp(timestamp: Long): String {
    val now = System.currentTimeMillis()
    val diff = now - timestamp
    return when {
        diff < 60_000 -> "Just now"
        diff < 3_600_000 -> "${diff / 60_000}m ago"
        diff < 86_400_000 -> "${diff / 3_600_000}h ago"
        diff < 604_800_000 -> "${diff / 86_400_000}d ago"
        else -> {
            val sdf = java.text.SimpleDateFormat("MMM d", java.util.Locale.getDefault())
            sdf.format(java.util.Date(timestamp))
        }
    }
}
