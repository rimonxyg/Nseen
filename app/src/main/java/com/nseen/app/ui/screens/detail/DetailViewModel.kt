package com.nseen.app.ui.screens.detail

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.nseen.app.data.local.entity.MessageEntity
import com.nseen.app.data.repository.MessageRepository
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class DetailUiState(
    val messages: List<MessageEntity> = emptyList(),
    val isLoading: Boolean = true
)

class DetailViewModel(
    private val repository: MessageRepository,
    private val packageName: String,
    private val conversation: String
) : ViewModel() {

    val uiState: StateFlow<DetailUiState> =
        repository.getConversationMessagesFlow(packageName, conversation)
            .map { messages ->
                // Mark all as read when opened
                if (messages.isNotEmpty()) {
                    viewModelScope.launch {
                        repository.markConversationAsRead(packageName, conversation)
                    }
                }
                DetailUiState(messages = messages, isLoading = false)
            }
            .stateIn(
                scope = viewModelScope,
                started = SharingStarted.WhileSubscribed(5000),
                initialValue = DetailUiState(isLoading = true)
            )

    fun deleteMessage(id: Long) {
        viewModelScope.launch {
            repository.deleteById(id)
        }
    }
}
