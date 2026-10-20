package com.nseen.app.data.repository

import com.nseen.app.data.local.dao.MessageDao
import com.nseen.app.data.local.entity.ConversationSummary
import com.nseen.app.data.local.entity.MessageEntity
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flowOn
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.withContext

/**
 * Repository handling all messaging notification data access, mutations, and grouping.
 */
class MessageRepository(
    private val messageDao: MessageDao,
    private val ioDispatcher: CoroutineDispatcher = Dispatchers.IO
) {

    /**
     * Observes all distinct conversations grouped by (packageName, conversation title/sender).
     * Automatically emits updated lists whenever any message is added or mutated.
     */
    fun getConversationsSummaryFlow(): Flow<List<ConversationSummary>> {
        return messageDao.getAllMessagesFlow()
            .map { messages ->
                messages
                    .groupBy { it.packageName to it.conversation }
                    .map { (key, groupMessages) ->
                        val (packageName, conversation) = key
                        val sorted = groupMessages.sortedByDescending { it.timestamp }
                        val latest = sorted.first()
                        val unreadCount = groupMessages.count { !it.isRead }
                        val hasDeleted = groupMessages.any { it.isDeleted }

                        ConversationSummary(
                            conversation = conversation,
                            packageName = packageName,
                            lastSender = latest.sender,
                            lastMessageText = latest.text,
                            lastTimestamp = latest.timestamp,
                            unreadCount = unreadCount,
                            totalCount = groupMessages.size,
                            hasDeletedMessages = hasDeleted
                        )
                    }
                    .sortedByDescending { it.lastTimestamp }
            }
            .flowOn(ioDispatcher)
    }

    /**
     * Observes messages belonging to a specific conversation chronologically.
     */
    fun getConversationMessagesFlow(packageName: String, conversation: String): Flow<List<MessageEntity>> {
        return messageDao.getConversationMessagesFlow(packageName, conversation)
            .flowOn(ioDispatcher)
    }

    /**
     * Observes all messages filtered by app package.
     */
    fun getMessagesByPackageFlow(packageName: String): Flow<List<MessageEntity>> {
        return messageDao.getMessagesByPackageFlow(packageName)
            .flowOn(ioDispatcher)
    }

    /**
     * Observes only deleted messages across all apps.
     */
    fun getDeletedMessagesFlow(): Flow<List<MessageEntity>> {
        return messageDao.getDeletedMessagesFlow()
            .flowOn(ioDispatcher)
    }

    /**
     * Searches messages matching a query text.
     */
    fun searchMessagesFlow(query: String): Flow<List<MessageEntity>> {
        return messageDao.searchMessagesFlow(query)
            .flowOn(ioDispatcher)
    }

    /**
     * Inserts a new captured message on IO thread.
     */
    suspend fun insertMessage(message: MessageEntity): Long = withContext(ioDispatcher) {
        messageDao.insertMessage(message)
    }

    /**
     * Checks if an identical message arrived in the recent past (for deduplication).
     */
    suspend fun findRecentDuplicate(
        packageName: String,
        sender: String,
        text: String,
        sinceTimestamp: Long
    ): MessageEntity? = withContext(ioDispatcher) {
        messageDao.findRecentDuplicate(packageName, sender, text, sinceTimestamp)
    }

    /**
     * Finds the latest non-deleted message from a sender to mark it as deleted.
     */
    suspend fun getLatestActiveMessageFromSender(
        packageName: String,
        sender: String
    ): MessageEntity? = withContext(ioDispatcher) {
        messageDao.getLatestActiveMessageFromSender(packageName, sender)
    }

    /**
     * Marks a specific message as deleted.
     */
    suspend fun markMessageAsDeleted(id: Long) = withContext(ioDispatcher) {
        messageDao.markMessageAsDeleted(id)
    }

    /**
     * Marks all messages in a conversation as read.
     */
    suspend fun markConversationAsRead(packageName: String, conversation: String) = withContext(ioDispatcher) {
        messageDao.markConversationAsRead(packageName, conversation)
    }

    /**
     * Deletes a single message by ID.
     */
    suspend fun deleteById(id: Long) = withContext(ioDispatcher) {
        messageDao.deleteById(id)
    }

    /**
     * Deletes all messages in a conversation.
     */
    suspend fun deleteConversation(packageName: String, conversation: String) = withContext(ioDispatcher) {
        messageDao.deleteConversation(packageName, conversation)
    }

    /**
     * Clears all saved messages from database.
     */
    suspend fun clearAll() = withContext(ioDispatcher) {
        messageDao.clearAll()
    }

    /**
     * Deletes messages older than cutoff timestamp (auto-retention cleanup).
     */
    suspend fun deleteOlderThan(cutoffTimestamp: Long): Int = withContext(ioDispatcher) {
        messageDao.deleteOlderThan(cutoffTimestamp)
    }
}
