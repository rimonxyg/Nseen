package com.nseen.app.ui.screens.detail

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nseen.app.data.local.entity.MessageEntity
import com.nseen.app.ui.theme.*
import com.nseen.app.ui.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DetailScreen(
    uiState: DetailUiState,
    conversation: String,
    packageName: String,
    onBack: () -> Unit,
    onDeleteMessage: (Long) -> Unit
) {
    val listState = rememberLazyListState()

    // Scroll to bottom when messages change
    LaunchedEffect(uiState.messages.size) {
        if (uiState.messages.isNotEmpty()) {
            listState.animateScrollToItem(uiState.messages.size - 1)
        }
    }

    Scaffold(
        containerColor = NseenSurface,
        topBar = {
            TopAppBar(
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Filled.ArrowBack, contentDescription = "Back", tint = NseenGreen)
                    }
                },
                title = {
                    Column {
                        Text(
                            text = conversation,
                            fontWeight = FontWeight.Bold,
                            color = NseenOnSurface,
                            fontSize = 16.sp
                        )
                        Text(
                            text = "via ${packageLabel(packageName)}",
                            color = NseenOnSurfaceVariant,
                            fontSize = 11.sp
                        )
                    }
                },
                actions = {
                    Text(
                        text = packageEmoji(packageName),
                        fontSize = 22.sp,
                        modifier = Modifier.padding(end = 16.dp)
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = NseenSurfaceVariant)
            )
        }
    ) { padding ->
        if (uiState.isLoading) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = NseenGreen)
            }
        } else if (uiState.messages.isEmpty()) {
            Box(Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
                Text("No messages", color = NseenOnSurfaceVariant)
            }
        } else {
            LazyColumn(
                state = listState,
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 12.dp),
                verticalArrangement = Arrangement.spacedBy(6.dp),
                modifier = Modifier.fillMaxSize().padding(padding)
            ) {
                items(
                    items = uiState.messages,
                    key = { it.id }
                ) { message ->
                    MessageBubble(message = message, onDelete = { onDeleteMessage(message.id) })
                }
            }
        }
    }
}

@Composable
private fun MessageBubble(
    message: MessageEntity,
    onDelete: () -> Unit
) {
    var showMenu by remember { mutableStateOf(false) }

    val bubbleColor = if (message.isDeleted) DeletedBadgeBg else NseenSurfaceCard
    val textColor = if (message.isDeleted) DeletedBadgeColor else NseenOnSurface

    Column(modifier = Modifier.fillMaxWidth()) {
        // Sender label
        Text(
            text = message.sender,
            color = NseenGreen,
            fontSize = 11.sp,
            fontWeight = FontWeight.SemiBold,
            modifier = Modifier.padding(start = 4.dp, bottom = 2.dp)
        )

        Box {
            Card(
                onClick = { showMenu = true },
                shape = RoundedCornerShape(topStart = 4.dp, topEnd = 16.dp, bottomStart = 16.dp, bottomEnd = 16.dp),
                colors = CardDefaults.cardColors(containerColor = bubbleColor),
                modifier = Modifier.widthIn(max = 300.dp)
            ) {
                Column(modifier = Modifier.padding(horizontal = 12.dp, vertical = 10.dp)) {
                    if (message.isDeleted) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                Icons.Filled.Delete,
                                contentDescription = null,
                                tint = DeletedBadgeColor,
                                modifier = Modifier.size(13.dp)
                            )
                            Spacer(Modifier.width(4.dp))
                            Text(
                                text = "DELETED MESSAGE",
                                color = DeletedBadgeColor,
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 0.8.sp
                            )
                        }
                        Spacer(Modifier.height(4.dp))
                    }
                    Text(
                        text = message.text,
                        color = textColor,
                        fontSize = 14.sp,
                        lineHeight = 20.sp
                    )
                    Spacer(Modifier.height(4.dp))
                    Text(
                        text = formatTimestamp(message.timestamp),
                        color = NseenOnSurfaceVariant.copy(alpha = 0.7f),
                        fontSize = 10.sp,
                        textAlign = TextAlign.End,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }

            DropdownMenu(
                expanded = showMenu,
                onDismissRequest = { showMenu = false },
                modifier = Modifier.background(NseenSurfaceCard)
            ) {
                DropdownMenuItem(
                    text = { Text("Delete", color = DeletedBadgeColor) },
                    leadingIcon = { Icon(Icons.Filled.Delete, contentDescription = null, tint = DeletedBadgeColor) },
                    onClick = { onDelete(); showMenu = false }
                )
            }
        }
    }
}
