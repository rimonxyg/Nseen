package com.nseen.app.service.engine

import android.app.Notification
import android.service.notification.StatusBarNotification
import androidx.core.app.NotificationCompat
import com.nseen.app.data.local.entity.MessageEntity

/**
 * Parses a raw [StatusBarNotification] into a list of [MessageEntity] candidates.
 *
 * One notification can carry multiple messages when the app uses MessagingStyle
 * (e.g., WhatsApp bundles several unread messages into one notification).
 */
object NotificationParser {

    /**
     * Returns null if the notification should be ignored outright (group-summary, ongoing, etc.).
     * Otherwise returns a list (possibly multiple for MessagingStyle) of parsed candidates.
     */
    fun parse(sbn: StatusBarNotification): List<ParsedMessage>? {
        val notification = sbn.notification ?: return null

        // Skip group summaries — they are a container, not a real message
        if (notification.flags and Notification.FLAG_GROUP_SUMMARY != 0) return null

        // Skip persistent/ongoing notifications (calls, media, foreground services)
        if (notification.flags and Notification.FLAG_ONGOING_EVENT != 0) return null

        val extras = notification.extras ?: return null
        val packageName = sbn.packageName
        val postTime = sbn.postTime

        // Try MessagingStyle first — richest source for chat apps
        val messagingStyle = NotificationCompat.MessagingStyle
            .extractMessagingStyleFromNotification(notification)

        if (messagingStyle != null) {
            return parseMessagingStyle(messagingStyle, packageName, postTime)
        }

        // Fall back to EXTRA_TITLE + EXTRA_TEXT / EXTRA_BIG_TEXT
        val sender = extras.getCharSequence(Notification.EXTRA_TITLE)?.toString()
            ?: extras.getCharSequence(Notification.EXTRA_TITLE_BIG)?.toString()
            ?: return null

        // EXTRA_BIG_TEXT preferred as it is often untruncated
        val text = extras.getCharSequence(Notification.EXTRA_BIG_TEXT)?.toString()?.trim()
            ?.takeIf { it.isNotEmpty() }
            ?: extras.getCharSequence(Notification.EXTRA_TEXT)?.toString()?.trim()
            ?: return null

        // Conversation title is present for group messages
        val conversation = extras.getCharSequence(Notification.EXTRA_CONVERSATION_TITLE)
            ?.toString()
            ?.takeIf { it.isNotEmpty() }
            ?: sender

        return listOf(
            ParsedMessage(
                packageName = packageName,
                sender = sender,
                conversation = conversation,
                text = text,
                timestamp = postTime
            )
        )
    }

    private fun parseMessagingStyle(
        style: NotificationCompat.MessagingStyle,
        packageName: String,
        postTime: Long
    ): List<ParsedMessage>? {
        val conversationTitle = style.conversationTitle?.toString()
        val messages = style.messages

        if (messages.isEmpty()) return null

        return messages.mapNotNull { msg ->
            val sender = msg.person?.name?.toString()
                ?: style.user?.name?.toString()
                ?: return@mapNotNull null
            val text = msg.text?.toString()?.trim() ?: return@mapNotNull null
            if (text.isEmpty()) return@mapNotNull null

            // Use conversation title if present (group chat); otherwise use sender
            val conversation = conversationTitle?.takeIf { it.isNotEmpty() } ?: sender

            ParsedMessage(
                packageName = packageName,
                sender = sender,
                conversation = conversation,
                text = text,
                timestamp = msg.timestamp.takeIf { it > 0 } ?: postTime
            )
        }.takeIf { it.isNotEmpty() }
    }
}

data class ParsedMessage(
    val packageName: String,
    val sender: String,
    val conversation: String,
    val text: String,
    val timestamp: Long
)
