package com.nseen.app.ui.screens.home

import android.content.Intent
import android.provider.Settings
import androidx.compose.animation.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nseen.app.data.local.entity.ConversationSummary
import com.nseen.app.data.preferences.AppPreferences
import com.nseen.app.ui.theme.*
import com.nseen.app.ui.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    uiState: HomeUiState,
    onConversationClick: (String, String) -> Unit,
    onSettingsClick: () -> Unit,
    onFilterChipClick: (String) -> Unit,
    onDeletedOnlyToggle: (Boolean) -> Unit,
    onSearchQueryChange: (String) -> Unit,
    onDeleteConversation: (String, String) -> Unit
) {
    val context = LocalContext.current
    val listenerEnabled = PermissionUtils.isNotificationListenerEnabled(context)

    Scaffold(
        containerColor = NseenSurface,
        topBar = {
            Column {
                TopAppBar(
                    title = {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(32.dp)
                                    .clip(CircleShape)
                                    .background(NseenGreenContainer),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Filled.Visibility,
                                    contentDescription = null,
                                    tint = NseenGreen,
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                            Spacer(Modifier.width(10.dp))
                            Text(
                                text = "Nseen",
                                color = NseenOnSurface,
                                fontWeight = FontWeight.Bold,
                                fontSize = 22.sp
                            )
                            Spacer(Modifier.width(8.dp))
                            Surface(
                                color = NseenGreenContainer,
                                shape = RoundedCornerShape(6.dp),
                                border = BorderStroke(1.dp, NseenGreen.copy(alpha = 0.5f))
                            ) {
                                Text(
                                    text = "PRO 150৳",
                                    color = NseenGreen,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                        }
                    },
                    actions = {
                        IconButton(onClick = onSettingsClick) {
                            Icon(Icons.Filled.Settings, contentDescription = "Settings", tint = NseenOnSurfaceVariant)
                        }
                    },
                    colors = TopAppBarDefaults.topAppBarColors(containerColor = NseenSurface)
                )

                // Permission warning banner
                if (!listenerEnabled) {
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable {
                                context.startActivity(Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS))
                            },
                        color = Color(0xFF3D2000)
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Filled.Warning, contentDescription = null, tint = Color(0xFFFF9A00), modifier = Modifier.size(18.dp))
                            Spacer(Modifier.width(8.dp))
                            Text(
                                text = "Notification access not granted — tap to fix",
                                color = Color(0xFFFFCC70),
                                fontSize = 13.sp,
                                modifier = Modifier.weight(1f)
                            )
                            Icon(Icons.Filled.ChevronRight, contentDescription = null, tint = Color(0xFFFF9A00), modifier = Modifier.size(18.dp))
                        }
                    }
                }
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            // Search bar
            TextField(
                value = uiState.searchQuery,
                onValueChange = onSearchQueryChange,
                placeholder = { Text("Search messages…", color = NseenOnSurfaceVariant) },
                leadingIcon = { Icon(Icons.Filled.Search, contentDescription = null, tint = NseenOnSurfaceVariant) },
                trailingIcon = {
                    if (uiState.searchQuery.isNotEmpty()) {
                        IconButton(onClick = { onSearchQueryChange("") }) {
                            Icon(Icons.Filled.Clear, contentDescription = "Clear", tint = NseenOnSurfaceVariant)
                        }
                    }
                },
                singleLine = true,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                shape = RoundedCornerShape(14.dp),
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = NseenSurfaceCard,
                    unfocusedContainerColor = NseenSurfaceCard,
                    focusedTextColor = NseenOnSurface,
                    unfocusedTextColor = NseenOnSurface,
                    focusedIndicatorColor = Color.Transparent,
                    unfocusedIndicatorColor = Color.Transparent
                )
            )

            // App filter chips
            val apps = listOf(
                AppPreferences.PACKAGE_WHATSAPP,
                AppPreferences.PACKAGE_WHATSAPP_BUSINESS,
                AppPreferences.PACKAGE_MESSENGER,
                AppPreferences.PACKAGE_INSTAGRAM,
                AppPreferences.PACKAGE_TELEGRAM
            )
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 4.dp)
            ) {
                items(apps) { pkg ->
                    val selected = uiState.filteredPackage == pkg
                    FilterChip(
                        selected = selected,
                        onClick = { onFilterChipClick(pkg) },
                        label = { Text(packageLabel(pkg), fontSize = 13.sp) },
                        leadingIcon = {
                            Text(packageEmoji(pkg), fontSize = 14.sp)
                        },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = NseenGreenContainer,
                            selectedLabelColor = NseenGreen,
                            containerColor = NseenSurfaceCard,
                            labelColor = NseenOnSurfaceVariant
                        ),
                        border = FilterChipDefaults.filterChipBorder(
                            enabled = true,
                            selected = selected,
                            selectedBorderColor = NseenGreen,
                            borderColor = NseenOutline
                        )
                    )
                }

                // Deleted-only toggle chip
                item {
                    FilterChip(
                        selected = uiState.showDeletedOnly,
                        onClick = { onDeletedOnlyToggle(!uiState.showDeletedOnly) },
                        label = { Text("Deleted", fontSize = 13.sp) },
                        leadingIcon = {
                            Icon(Icons.Filled.Delete, contentDescription = null, modifier = Modifier.size(16.dp))
                        },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = DeletedBadgeBg,
                            selectedLabelColor = DeletedBadgeColor,
                            containerColor = NseenSurfaceCard,
                            labelColor = NseenOnSurfaceVariant
                        ),
                        border = FilterChipDefaults.filterChipBorder(
                            enabled = true,
                            selected = uiState.showDeletedOnly,
                            selectedBorderColor = DeletedBadgeColor,
                            borderColor = NseenOutline
                        )
                    )
                }
            }

            Spacer(Modifier.height(4.dp))

            if (uiState.isLoading) {
                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = NseenGreen)
                }
            } else if (uiState.conversations.isEmpty()) {
                EmptyState(hasFilter = uiState.filteredPackage != null || uiState.showDeletedOnly || uiState.searchQuery.isNotEmpty())
            } else {
                LazyColumn(
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(
                        items = uiState.conversations,
                        key = { "${it.packageName}/${it.conversation}" }
                    ) { convo ->
                        ConversationRow(
                            summary = convo,
                            onClick = { onConversationClick(convo.packageName, convo.conversation) },
                            onDelete = { onDeleteConversation(convo.packageName, convo.conversation) }
                        )
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalFoundationApi::class)
@Composable
private fun ConversationRow(
    summary: ConversationSummary,
    onClick: () -> Unit,
    onDelete: () -> Unit
) {
    var showDeleteDialog by remember { mutableStateOf(false) }

    if (showDeleteDialog) {
        AlertDialog(
            onDismissRequest = { showDeleteDialog = false },
            title = { Text("Delete Conversation", color = NseenOnSurface) },
            text = { Text("Delete all messages from ${summary.conversation}?", color = NseenOnSurfaceVariant) },
            confirmButton = {
                TextButton(onClick = { onDelete(); showDeleteDialog = false }) {
                    Text("Delete", color = DeletedBadgeColor)
                }
            },
            dismissButton = {
                TextButton(onClick = { showDeleteDialog = false }) {
                    Text("Cancel", color = NseenOnSurfaceVariant)
                }
            },
            containerColor = NseenSurfaceCard
        )
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .combinedClickable(onClick = onClick, onLongClick = { showDeleteDialog = true }),
        colors = CardDefaults.cardColors(containerColor = NseenSurfaceCard),
        shape = RoundedCornerShape(16.dp)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // App icon badge
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(CircleShape)
                    .background(NseenSurfaceHighlight),
                contentAlignment = Alignment.Center
            ) {
                Text(packageEmoji(summary.packageName), fontSize = 24.sp)
            }

            Spacer(Modifier.width(14.dp))

            Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = summary.conversation,
                        fontWeight = FontWeight.SemiBold,
                        color = NseenOnSurface,
                        fontSize = 15.sp,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                        modifier = Modifier.weight(1f)
                    )
                    Spacer(Modifier.width(8.dp))
                    Text(
                        text = formatTimestamp(summary.lastTimestamp),
                        color = NseenOnSurfaceVariant,
                        fontSize = 11.sp
                    )
                }

                Spacer(Modifier.height(4.dp))

                Row(verticalAlignment = Alignment.CenterVertically) {
                    if (summary.hasDeletedMessages) {
                        Surface(
                            color = DeletedBadgeBg,
                            shape = RoundedCornerShape(4.dp),
                            modifier = Modifier.padding(end = 6.dp)
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 5.dp, vertical = 2.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    Icons.Filled.Delete,
                                    contentDescription = null,
                                    tint = DeletedBadgeColor,
                                    modifier = Modifier.size(10.dp)
                                )
                                Spacer(Modifier.width(3.dp))
                                Text(
                                    text = "DELETED",
                                    color = DeletedBadgeColor,
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = 0.5.sp
                                )
                            }
                        }
                    }
                    Text(
                        text = summary.lastMessageText,
                        color = NseenOnSurfaceVariant,
                        fontSize = 13.sp,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                        modifier = Modifier.weight(1f)
                    )
                }

                Spacer(Modifier.height(4.dp))
                Text(
                    text = "via ${packageLabel(summary.packageName)} · ${summary.totalCount} msgs",
                    color = NseenOutline,
                    fontSize = 11.sp
                )
            }

            if (summary.unreadCount > 0) {
                Spacer(Modifier.width(10.dp))
                Surface(
                    shape = CircleShape,
                    color = UnreadBadgeBg,
                    modifier = Modifier.size(22.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Text(
                            text = if (summary.unreadCount > 99) "99+" else summary.unreadCount.toString(),
                            color = UnreadBadgeText,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun EmptyState(hasFilter: Boolean) {
    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(32.dp)) {
            Icon(
                imageVector = if (hasFilter) Icons.Filled.FilterAltOff else Icons.Filled.Inbox,
                contentDescription = null,
                tint = NseenOutline,
                modifier = Modifier.size(64.dp)
            )
            Spacer(Modifier.height(16.dp))
            Text(
                text = if (hasFilter) "No messages match your filter" else "No messages yet",
                color = NseenOnSurfaceVariant,
                fontSize = 16.sp,
                fontWeight = FontWeight.SemiBold
            )
            Spacer(Modifier.height(8.dp))
            Text(
                text = if (hasFilter) "Try clearing your filters." else "Messages from WhatsApp, Telegram, Instagram, Messenger & WhatsApp Business will appear here.",
                color = NseenOutline,
                fontSize = 13.sp,
                lineHeight = 18.sp
            )
        }
    }
}
