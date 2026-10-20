package com.nseen.app.data.local.entity

import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey

/**
 * Represents an intercepted messaging notification.
 *
 * @property id Auto-generated primary key
 * @property packageName App package (e.g. com.whatsapp, org.telegram.messenger)
 * @property sender Name of the individual who sent the message
 * @property conversation Conversation/Group name (falls back to sender if direct 1-on-1 chat)
 * @property text Content of the message or placeholder (e.g. "Photo")
 * @property timestamp Unix epoch timestamp in milliseconds when notification was posted
 * @property isDeleted True if deletion pattern detected from sender
 * @property isRead True if viewed by user in app
 */
@Entity(
    tableName = "messages",
    indices = [
        Index(value = ["packageName"]),
        Index(value = ["sender"]),
        Index(value = ["conversation"]),
        Index(value = ["timestamp"]),
        Index(value = ["isDeleted"]),
        Index(value = ["packageName", "conversation"])
    ]
)
data class MessageEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val packageName: String,
    val sender: String,
    val conversation: String,
    val text: String,
    val timestamp: Long,
    val isDeleted: Boolean = false,
    val isRead: Boolean = false
)
