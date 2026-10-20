package com.nseen.app.service.engine

import android.util.LruCache

/**
 * Prevents duplicate message inserts caused by notification re-posts.
 *
 * Android re-posts the notification for the same message when a new message from the
 * same conversation arrives. Without deduplication this would create two records for
 * a single message.
 *
 * Strategy:
 *  - An in-memory LRU cache stores a hashed key composed of
 *    (packageName, sender, text) -> postTimestamp.
 *  - A message is a duplicate if an identical key was seen within [WINDOW_MS] ms.
 *  - The repository layer performs a secondary DB check [findRecentDuplicate] before
 *    inserting, so this cache is a fast first-pass gate that avoids unnecessary DB calls.
 *
 * @param windowMs Maximum age in milliseconds within which identical messages are deduped (default 4s).
 */
class Deduplicator(private val windowMs: Long = WINDOW_MS) {

    // Key: hash of (packageName + sender + text), Value: timestamp of first seen occurrence
    private val cache = LruCache<Int, Long>(MAX_CACHE_SIZE)

    /**
     * Returns true if this message should be skipped (is a duplicate), false if it is new.
     *
     * Call this BEFORE any DB interaction to avoid redundant queries.
     */
    fun isDuplicate(packageName: String, sender: String, text: String, timestamp: Long): Boolean {
        val key = buildKey(packageName, sender, text)
        val previousTimestamp = cache.get(key)

        return if (previousTimestamp != null && timestamp - previousTimestamp < windowMs) {
            // Same message within the time window — it is a duplicate
            true
        } else {
            // Record it as the latest occurrence and pass it through
            cache.put(key, timestamp)
            false
        }
    }

    private fun buildKey(packageName: String, sender: String, text: String): Int {
        // Stable composite hash — combine fields with a prime-based formula
        var result = packageName.hashCode()
        result = 31 * result + sender.hashCode()
        result = 31 * result + text.hashCode()
        return result
    }

    companion object {
        /** Messages with identical content within 4 seconds are considered duplicates. */
        const val WINDOW_MS = 4_000L

        /** Maximum entries kept in memory (covers 256 recent unique messages). */
        private const val MAX_CACHE_SIZE = 256
    }
}
