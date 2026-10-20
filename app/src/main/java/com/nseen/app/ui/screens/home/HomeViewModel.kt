package com.nseen.app.ui.screens.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.nseen.app.data.local.entity.ConversationSummary
import com.nseen.app.data.preferences.AppPreferences
import com.nseen.app.data.repository.MessageRepository
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class HomeUiState(
    val conversations: List<ConversationSummary> = emptyList(),
    val filteredPackage: String? = null,
    val showDeletedOnly: Boolean = false,
    val searchQuery: String = "",
    val isLoading: Boolean = true
)

@OptIn(ExperimentalCoroutinesApi::class)
class HomeViewModel(
    private val repository: MessageRepository
) : ViewModel() {

    private val _filterPackage = MutableStateFlow<String?>(null)
    private val _showDeletedOnly = MutableStateFlow(false)
    private val _searchQuery = MutableStateFlow("")

    val uiState: StateFlow<HomeUiState> = combine(
        _filterPackage,
        _showDeletedOnly,
        _searchQuery
    ) { pkg, deletedOnly, query ->
        Triple(pkg, deletedOnly, query)
    }.flatMapLatest { (pkg, deletedOnly, query) ->
        when {
            query.isNotBlank() -> repository.searchMessagesFlow(query)
                .map { messages ->
                    messages
                        .groupBy { it.packageName to it.conversation }
                        .map { (key, groupMessages) ->
                            val (packageName, conversation) = key
                            val sorted = groupMessages.sortedByDescending { it.timestamp }
                            val latest = sorted.first()
                            ConversationSummary(
                                conversation = conversation,
                                packageName = packageName,
                                lastSender = latest.sender,
                                lastMessageText = latest.text,
                                lastTimestamp = latest.timestamp,
                                unreadCount = groupMessages.count { !it.isRead },
                                totalCount = groupMessages.size,
                                hasDeletedMessages = groupMessages.any { it.isDeleted }
                            )
                        }.sortedByDescending { it.lastTimestamp }
                }
            pkg != null -> repository.getMessagesByPackageFlow(pkg)
                .map { messages ->
                    val filtered = if (deletedOnly) messages.filter { it.isDeleted } else messages
                    filtered
                        .groupBy { it.packageName to it.conversation }
                        .map { (key, groupMessages) ->
                            val (packageName, conversation) = key
                            val sorted = groupMessages.sortedByDescending { it.timestamp }
                            val latest = sorted.first()
                            ConversationSummary(
                                conversation = conversation,
                                packageName = packageName,
                                lastSender = latest.sender,
                                lastMessageText = latest.text,
                                lastTimestamp = latest.timestamp,
                                unreadCount = groupMessages.count { !it.isRead },
                                totalCount = groupMessages.size,
                                hasDeletedMessages = groupMessages.any { it.isDeleted }
                            )
                        }.sortedByDescending { it.lastTimestamp }
                }
            deletedOnly -> repository.getDeletedMessagesFlow()
                .map { messages ->
                    messages
                        .groupBy { it.packageName to it.conversation }
                        .map { (key, groupMessages) ->
                            val (packageName, conversation) = key
                            val sorted = groupMessages.sortedByDescending { it.timestamp }
                            val latest = sorted.first()
                            ConversationSummary(
                                conversation = conversation,
                                packageName = packageName,
                                lastSender = latest.sender,
                                lastMessageText = latest.text,
                                lastTimestamp = latest.timestamp,
                                unreadCount = groupMessages.count { !it.isRead },
                                totalCount = groupMessages.size,
                                hasDeletedMessages = true
                            )
                        }.sortedByDescending { it.lastTimestamp }
                }
            else -> repository.getConversationsSummaryFlow()
        }.map { convos ->
            HomeUiState(
                conversations = convos,
                filteredPackage = pkg,
                showDeletedOnly = deletedOnly,
                searchQuery = query,
                isLoading = false
            )
        }
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = HomeUiState(isLoading = true)
    )

    fun setFilter(packageName: String?) {
        _filterPackage.value = if (_filterPackage.value == packageName) null else packageName
    }

    fun setShowDeletedOnly(show: Boolean) {
        _showDeletedOnly.value = show
    }

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun deleteConversation(packageName: String, conversation: String) {
        viewModelScope.launch {
            repository.deleteConversation(packageName, conversation)
        }
    }
}
