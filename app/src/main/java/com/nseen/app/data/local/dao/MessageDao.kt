package com.nseen.app.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.nseen.app.data.local.entity.MessageEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface MessageDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMessage(message: MessageEntity): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMessages(messages: List<MessageEntity>): List<Long>

    @Update
    suspend fun updateMessage(message: MessageEntity)

    @Query("SELECT * FROM messages ORDER BY timestamp DESC")
    fun getAllMessagesFlow(): Flow<List<MessageEntity>>

    @Query("SELECT * FROM messages WHERE packageName = :packageName ORDER BY timestamp DESC")
    fun getMessagesByPackageFlow(packageName: String): Flow<List<MessageEntity>>

    @Query("SELECT * FROM messages WHERE sender = :sender ORDER BY timestamp DESC")
    fun getMessagesBySenderFlow(sender: String): Flow<List<MessageEntity>>

    @Query("SELECT * FROM messages WHERE packageName = :packageName AND conversation = :conversation ORDER BY timestamp ASC")
    fun getConversationMessagesFlow(packageName: String, conversation: String): Flow<List<MessageEntity>>

    @Query("SELECT * FROM messages WHERE isDeleted = 1 ORDER BY timestamp DESC")
    fun getDeletedMessagesFlow(): Flow<List<MessageEntity>>

    @Query("""
        SELECT * FROM messages 
        WHERE text LIKE '%' || :query || '%' 
           OR sender LIKE '%' || :query || '%' 
           OR conversation LIKE '%' || :query || '%' 
        ORDER BY timestamp DESC
    """)
    fun searchMessagesFlow(query: String): Flow<List<MessageEntity>>

    @Query("""
        SELECT * FROM messages 
        WHERE packageName = :packageName 
          AND sender = :sender 
          AND text = :text 
          AND timestamp >= :sinceTimestamp 
        ORDER BY timestamp DESC 
        LIMIT 1
    """)
    suspend fun findRecentDuplicate(
        packageName: String,
        sender: String,
        text: String,
        sinceTimestamp: Long
    ): MessageEntity?

    @Query("""
        SELECT * FROM messages 
        WHERE packageName = :packageName 
          AND sender = :sender 
          AND isDeleted = 0 
        ORDER BY timestamp DESC 
        LIMIT 1
    """)
    suspend fun getLatestActiveMessageFromSender(
        packageName: String,
        sender: String
    ): MessageEntity?

    @Query("UPDATE messages SET isDeleted = 1 WHERE id = :id")
    suspend fun markMessageAsDeleted(id: Long)

    @Query("UPDATE messages SET isRead = 1 WHERE packageName = :packageName AND conversation = :conversation")
    suspend fun markConversationAsRead(packageName: String, conversation: String)

    @Query("DELETE FROM messages WHERE id = :id")
    suspend fun deleteById(id: Long)

    @Query("DELETE FROM messages WHERE packageName = :packageName AND conversation = :conversation")
    suspend fun deleteConversation(packageName: String, conversation: String)

    @Query("DELETE FROM messages")
    suspend fun clearAll()

    @Query("DELETE FROM messages WHERE timestamp < :cutoffTimestamp")
    suspend fun deleteOlderThan(cutoffTimestamp: Long): Int

    @Query("SELECT COUNT(*) FROM messages")
    suspend fun getMessageCount(): Int
}
