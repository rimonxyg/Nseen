package com.nseen.app.service.engine

/**
 * Detects whether an incoming notification text signals that a message was deleted.
 *
 * When a deletion is detected, the listener should NOT insert a new row. Instead,
 * it should find the most recent non-deleted message from that sender and flag it
 * as [isDeleted = true], preserving the original content.
 *
 * Patterns are checked in priority order:
 *  1. Exact known strings (fast, zero-regex overhead on the happy path)
 *  2. Broad multilingual regex as a catch-all fallback
 */
object DeletionDetector {

    // Exact known deletion strings from major messaging apps and locales
    private val KNOWN_DELETION_PHRASES = setOf(
        // WhatsApp English
        "this message was deleted",
        "you deleted this message",
        "this message was deleted by the sender",
        // WhatsApp Spanish
        "este mensaje fue eliminado",
        "eliminaste este mensaje",
        // WhatsApp Portuguese
        "esta mensagem foi apagada",
        "você apagou esta mensagem",
        // WhatsApp French
        "ce message a été supprimé",
        "vous avez supprimé ce message",
        // WhatsApp German
        "diese nachricht wurde gelöscht",
        "du hast diese nachricht gelöscht",
        // WhatsApp Arabic (simplified)
        "تم حذف هذه الرسالة",
        // WhatsApp Turkish
        "bu mesaj silindi",
        // WhatsApp Bengali (Crucial for BD market)
        "এই বার্তাটি মুছে ফেলা হয়েছে",
        "আপনি এই বার্তাটি মুছে ফেলেছেন",
        "বার্তাটি মুছে ফেলা হয়েছে",
        "এই মেসেজটি মুছে ফেলা হয়েছে",
        "মেসেজটি মুছে ফেলা হয়েছে",
        // Telegram
        "message deleted",
        // Instagram / Messenger fallback
        "unsent a message",
        "retracted a message"
    )

    // Broad multilingual regex as a fallback for other languages/OEM tweaks.
    // Designed to be permissive — a false positive (rare) is preferable to missing a deletion.
    private val DELETION_REGEX = Regex(
        pattern = """(?i).*(message|nachricht|mensaje|mensagem|رسالة|mesaj|বার্তা|মেসেজ)\s*(was\s*deleted|wurden?\s*gel[öo]scht|fue\s*eliminad[ao]|foi\s*apagad[ao]|a\s*été\s*supprimé[e]?|silindi|deleted?|মুছে\s*ফেলা\s*হয়েছে|মুছে\s*ফেলেছেন).*""",
        options = setOf(RegexOption.IGNORE_CASE)
    )

    /**
     * Returns true if [text] contains a deletion notice.
     *
     * Comparison is case-insensitive and trims whitespace.
     */
    fun isDeletion(text: String): Boolean {
        val normalized = text.trim().lowercase()

        // Fast path: check against our known phrases set (O(1) hash lookup)
        if (normalized in KNOWN_DELETION_PHRASES) return true

        // Slow path: multilingual regex fallback
        return DELETION_REGEX.containsMatchIn(normalized)
    }
}
