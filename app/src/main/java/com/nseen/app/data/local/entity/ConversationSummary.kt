package com.nseen.app.data.local.entity

/**
 * Aggregated summary for grouping messages in the Home screen conversation list.
 */
data class ConversationSummary(
    val conversation: String,
    val packageName: String,
    val lastSender: String,
    val lastMessageText: String,
    val lastTimestamp: Long,
    val unreadCount: Int,
    val totalCount: Int,
    val hasDeletedMessages: Boolean
)
