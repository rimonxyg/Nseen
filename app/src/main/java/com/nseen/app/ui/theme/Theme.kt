package com.nseen.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val NseenDarkColorScheme = darkColorScheme(
    primary = NseenGreen,
    onPrimary = UnreadBadgeText,
    primaryContainer = NseenGreenContainer,
    onPrimaryContainer = NseenGreen,
    secondary = NseenGreenDark,
    onSecondary = NseenOnSurface,
    secondaryContainer = NseenGreenContainer,
    onSecondaryContainer = NseenOnSurface,
    tertiary = DeletedBadgeColor,
    onTertiary = NseenOnSurface,
    background = NseenSurface,
    onBackground = NseenOnSurface,
    surface = NseenSurface,
    onSurface = NseenOnSurface,
    surfaceVariant = NseenSurfaceVariant,
    onSurfaceVariant = NseenOnSurfaceVariant,
    outline = NseenOutline,
    error = DeletedBadgeColor
)

@Composable
fun NseenTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = NseenDarkColorScheme,
        typography = NseenTypography,
        content = content
    )
}
