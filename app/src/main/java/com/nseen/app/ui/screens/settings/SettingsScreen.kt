package com.nseen.app.ui.screens.settings

import android.content.Intent
import android.net.Uri
import android.provider.Settings
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nseen.app.data.preferences.AppPreferences
import com.nseen.app.ui.theme.*
import com.nseen.app.ui.util.packageLabel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    preferences: AppPreferences,
    licenseManager: com.nseen.app.license.LicenseManager,
    onBack: () -> Unit,
    onClearAll: () -> Unit,
    onOpenPaywall: () -> Unit,
    onRetentionDaysChanged: ((Int) -> Unit)? = null
) {
    val context = LocalContext.current
    val licenseState by licenseManager.licenseState.collectAsState()
    val displayDeviceId = remember { com.nseen.app.license.DeviceFingerprintHelper.getDisplayDeviceId(context) }
    var showClearDialog by remember { mutableStateOf(false) }
    var monitoredApps by remember {
        mutableStateOf(
            AppPreferences.DEFAULT_SUPPORTED_PACKAGES.associateWith { preferences.isAppMonitored(it) }
        )
    }
    var retentionDays by remember {
        val current = preferences.retentionDays
        val valid = if (current == 1 || current == 2 || current == -1) current else 1
        if (valid != current) preferences.retentionDays = valid
        mutableIntStateOf(valid)
    }
    var biometricEnabled by remember { mutableStateOf(preferences.isBiometricLockEnabled) }

    if (showClearDialog) {
        AlertDialog(
            onDismissRequest = { showClearDialog = false },
            title = { Text("Clear All Data", color = NseenOnSurface) },
            text = { Text("This will permanently delete all saved messages. This cannot be undone.", color = NseenOnSurfaceVariant) },
            confirmButton = {
                TextButton(onClick = { onClearAll(); showClearDialog = false }) {
                    Text("Clear All", color = DeletedBadgeColor)
                }
            },
            dismissButton = {
                TextButton(onClick = { showClearDialog = false }) {
                    Text("Cancel", color = NseenOnSurfaceVariant)
                }
            },
            containerColor = NseenSurfaceCard
        )
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
                title = { Text("Settings", fontWeight = FontWeight.Bold, color = NseenOnSurface) },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = NseenSurface)
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 16.dp, vertical = 8.dp)
        ) {
            // ── Account & License (150 BDT Lifetime) ──────────────────────────
            SettingsSection(title = "Account & License") {
                val emailText = when (val state = licenseState) {
                    is com.nseen.app.license.LicenseState.Active -> state.license.email
                    is com.nseen.app.license.LicenseState.OfflineGrace -> state.license.email
                    is com.nseen.app.license.LicenseState.Unlicensed -> state.email
                    else -> "No Google account linked"
                }

                val statusText = when (licenseState) {
                    is com.nseen.app.license.LicenseState.Active -> "Active Lifetime (150 ৳)"
                    is com.nseen.app.license.LicenseState.OfflineGrace -> "Active Lifetime (Offline)"
                    is com.nseen.app.license.LicenseState.DeviceMismatch -> "Device Mismatch Error"
                    else -> "Free / Unlicensed"
                }

                val statusColor = when (licenseState) {
                    is com.nseen.app.license.LicenseState.Active,
                    is com.nseen.app.license.LicenseState.OfflineGrace -> NseenGreen
                    else -> DeletedBadgeColor
                }

                SettingsClickRow(
                    icon = Icons.Filled.WorkspacePremium,
                    label = "Status: $statusText",
                    description = "Account: $emailText\nDevice: $displayDeviceId",
                    iconTint = statusColor,
                    onClick = onOpenPaywall
                )
            }

            Spacer(Modifier.height(16.dp))

            // ── Monitored Apps ────────────────────────────────────────────────
            SettingsSection(title = "Monitored Apps") {
                AppPreferences.DEFAULT_SUPPORTED_PACKAGES.forEach { pkg ->
                    val enabled = monitoredApps[pkg] ?: true
                    SettingsSwitchRow(
                        label = packageLabel(pkg),
                        checked = enabled,
                        onCheckedChange = { checked ->
                            preferences.setAppMonitored(pkg, checked)
                            monitoredApps = monitoredApps.toMutableMap().also { it[pkg] = checked }
                        }
                    )
                }
            }

            Spacer(Modifier.height(16.dp))

            // ── Auto-delete Retention ─────────────────────────────────────────
            SettingsSection(title = "Auto-Delete Messages") {
                val options = listOf(
                    1 to "After 1 day",
                    2 to "After 2 days",
                    -1 to "Never"
                )
                options.forEach { (days, label) ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable {
                                preferences.retentionDays = days
                                retentionDays = days
                                onRetentionDaysChanged?.invoke(days)
                            }
                            .padding(vertical = 12.dp, horizontal = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = retentionDays == days,
                            onClick = {
                                preferences.retentionDays = days
                                retentionDays = days
                                onRetentionDaysChanged?.invoke(days)
                            },
                            colors = RadioButtonDefaults.colors(selectedColor = NseenGreen)
                        )
                        Spacer(Modifier.width(8.dp))
                        Text(label, color = NseenOnSurface, fontSize = 14.sp)
                    }
                }
            }

            Spacer(Modifier.height(16.dp))

            // ── Security ─────────────────────────────────────────────────────
            SettingsSection(title = "Security") {
                SettingsSwitchRow(
                    label = "Biometric App Lock",
                    description = "Require fingerprint/face to open Nseen",
                    checked = biometricEnabled,
                    onCheckedChange = { checked ->
                        preferences.isBiometricLockEnabled = checked
                        biometricEnabled = checked
                    }
                )
            }

            Spacer(Modifier.height(16.dp))

            // ── Battery & Permission ──────────────────────────────────────────
            SettingsSection(title = "Battery & Reliability") {
                SettingsClickRow(
                    icon = Icons.Filled.BatteryAlert,
                    label = "Disable Battery Optimization",
                    description = "Recommended on Xiaomi, Samsung & Oppo — prevents service from being killed",
                    iconTint = Color(0xFFFF9A00)
                ) {
                    val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply {
                        data = Uri.parse("package:${context.packageName}")
                    }
                    context.startActivity(intent)
                }

                SettingsClickRow(
                    icon = Icons.Filled.NotificationsActive,
                    label = "Notification Access",
                    description = "Open system settings to verify access is still granted",
                    iconTint = NseenGreen
                ) {
                    context.startActivity(Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS))
                }
            }

            Spacer(Modifier.height(16.dp))

            // ── Data ─────────────────────────────────────────────────────────
            SettingsSection(title = "Data") {
                SettingsClickRow(
                    icon = Icons.Filled.DeleteForever,
                    label = "Clear All Saved Messages",
                    description = "Permanently delete everything Nseen has captured",
                    iconTint = DeletedBadgeColor
                ) {
                    showClearDialog = true
                }
            }

            Spacer(Modifier.height(24.dp))

            Text(
                text = "Nseen v1.1.0 · Messages remain 100% on-device · Internet strictly for license verification",
                color = NseenOutline,
                fontSize = 11.sp,
                modifier = Modifier.fillMaxWidth(),
                textAlign = androidx.compose.ui.text.style.TextAlign.Center
            )
            Spacer(Modifier.height(24.dp))
        }
    }
}

@Composable
private fun SettingsSection(title: String, content: @Composable ColumnScope.() -> Unit) {
    Text(
        text = title.uppercase(),
        color = NseenGreen,
        fontSize = 11.sp,
        fontWeight = FontWeight.Bold,
        letterSpacing = 1.sp,
        modifier = Modifier.padding(bottom = 8.dp, start = 4.dp)
    )
    Card(
        colors = CardDefaults.cardColors(containerColor = NseenSurfaceCard),
        shape = RoundedCornerShape(16.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(vertical = 4.dp)) {
            content()
        }
    }
}

@Composable
private fun SettingsSwitchRow(
    label: String,
    description: String? = null,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onCheckedChange(!checked) }
            .padding(horizontal = 16.dp, vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(label, color = NseenOnSurface, fontSize = 14.sp)
            if (description != null) {
                Text(description, color = NseenOnSurfaceVariant, fontSize = 12.sp)
            }
        }
        Switch(
            checked = checked,
            onCheckedChange = onCheckedChange,
            colors = SwitchDefaults.colors(checkedThumbColor = NseenSurface, checkedTrackColor = NseenGreen)
        )
    }
}

@Composable
private fun SettingsClickRow(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    description: String? = null,
    iconTint: Color = NseenOnSurface,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp, vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(icon, contentDescription = null, tint = iconTint, modifier = Modifier.size(22.dp))
        Spacer(Modifier.width(14.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(label, color = NseenOnSurface, fontSize = 14.sp)
            if (description != null) {
                Text(description, color = NseenOnSurfaceVariant, fontSize = 12.sp, lineHeight = 16.sp)
            }
        }
        Icon(Icons.Filled.ChevronRight, contentDescription = null, tint = NseenOutline)
    }
}
