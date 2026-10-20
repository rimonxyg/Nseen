package com.nseen.app.service

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import com.nseen.app.NseenApplication
import com.nseen.app.data.local.entity.MessageEntity
import com.nseen.app.data.preferences.AppPreferences
import com.nseen.app.service.engine.DeletionDetector
import com.nseen.app.service.engine.Deduplicator
import com.nseen.app.service.engine.NotificationParser
import com.nseen.app.service.util.ServiceRebindHelper
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch

/**
 * Core notification listener. Captures, validates, deduplicates, and stores
 * messaging notifications from the allowlisted apps.
 *
 * Lifecycle: Created and bound by Android when the user grants Notification Access.
 * All database operations run on [Dispatchers.IO] — never the main thread.
 */
class MsgListenerService : NotificationListenerService() {

    // Coroutine scope tied to service lifetime — cancelled in onDestroy
    private val serviceScope = CoroutineScope(Dispatchers.IO + SupervisorJob())

    // Shared single instance of the deduplicator (lives for the lifetime of this service)
    private val deduplicator = Deduplicator()

    private val repository by lazy {
        (applicationContext as NseenApplication).container.messageRepository
    }

    private val preferences by lazy {
        (applicationContext as NseenApplication).container.appPreferences
    }

    // ─── NotificationListenerService callbacks ─────────────────────────────────

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        super.onNotificationPosted(sbn)
        if (sbn == null) return

        val packageName = sbn.packageName

        // Reject apps not in the user's monitored allowlist
        if (!AppPreferences.DEFAULT_SUPPORTED_PACKAGES.contains(packageName)) return
        if (!preferences.isAppMonitored(packageName)) return

        // Parse — returns null if notification is a group summary or ongoing
        val parsed = NotificationParser.parse(sbn) ?: return

        serviceScope.launch {
            for (msg in parsed) {
                processMessage(msg.packageName, msg.sender, msg.conversation, msg.text, msg.timestamp)
            }
        }
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification?) {
        super.onNotificationRemoved(sbn)
        // We intentionally do NOT delete on removal — that's the whole point of the app.
    }

    override fun onListenerConnected() {
        super.onListenerConnected()
        Log.i(TAG, "Notification listener connected.")
        cleanupOldMessages()
    }

    private fun cleanupOldMessages() {
        val days = preferences.retentionDays
        if (days > 0) {
            serviceScope.launch {
                try {
                    val cutoff = System.currentTimeMillis() - (days * 24L * 60L * 60L * 1000L)
                    val deleted = repository.deleteOlderThan(cutoff)
                    if (deleted > 0) {
                        Log.i(TAG, "Auto-deleted $deleted messages older than $days day(s).")
                    }
                } catch (e: Exception) {
                    Log.e(TAG, "Error during auto-cleanup: ${e.message}")
                }
            }
        }
    }

    override fun onListenerDisconnected() {
        super.onListenerDisconnected()
        Log.w(TAG, "Notification listener disconnected — requesting rebind.")
        // Request Android to rebind the service automatically (helps against OEM task killers)
        ServiceRebindHelper.requestRebind(this, MsgListenerService::class.java)
    }

    override fun onDestroy() {
        super.onDestroy()
        serviceScope.cancel()
    }

    // ─── Core processing logic ─────────────────────────────────────────────────

    /**
     * Handles a single parsed message.
     *
     * Decision tree:
     *  1. Is this text a deletion notice? → Find latest stored message from sender, mark it deleted.
     *  2. Is this a duplicate (in-memory LRU or DB check)? → Skip.
     *  3. Otherwise insert as a new [MessageEntity].
     */
    private suspend fun processMessage(
        packageName: String,
        sender: String,
        conversation: String,
        text: String,
        timestamp: Long
    ) {
        try {
            // ── Step 1: Deletion detection ────────────────────────────────────
            if (DeletionDetector.isDeletion(text)) {
                Log.d(TAG, "Deletion notice detected from $sender — marking original.")
                val original = repository.getLatestActiveMessageFromSender(packageName, sender)
                if (original != null) {
                    repository.markMessageAsDeleted(original.id)
                    Log.i(TAG, "Marked msg #${original.id} as deleted (${original.text.take(30)}…)")
                } else {
                    Log.d(TAG, "No previous message from $sender to mark deleted.")
                }
                return // Do NOT insert the deletion notice itself
            }

            // ── Step 2: In-memory deduplication (fast gate) ──────────────────
            if (deduplicator.isDuplicate(packageName, sender, text, timestamp)) {
                Log.v(TAG, "Dedup (LRU): skipping duplicate from $sender")
                return
            }

            // ── Step 3: DB-level deduplication (covers service restarts) ─────
            val cutoff = timestamp - Deduplicator.WINDOW_MS
            val existing = repository.findRecentDuplicate(packageName, sender, text, cutoff)
            if (existing != null) {
                Log.v(TAG, "Dedup (DB): skipping duplicate from $sender")
                return
            }

            // ── Step 4: Insert ───────────────────────────────────────────────
            val entity = MessageEntity(
                packageName = packageName,
                sender = sender,
                conversation = conversation,
                text = text,
                timestamp = timestamp,
                isDeleted = false,
                isRead = false
            )
            val id = repository.insertMessage(entity)
            Log.i(TAG, "Saved message #$id from $sender in [$conversation]: ${text.take(40)}")
        } catch (e: Exception) {
            Log.e(TAG, "Error processing notification from $packageName: ${e.message}", e)
        }
    }

    companion object {
        private const val TAG = "MsgListenerService"
    }
}
