package com.nseen.app.ui

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.*
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.nseen.app.NseenApplication
import com.nseen.app.data.preferences.AppPreferences
import com.nseen.app.license.LicenseManager
import com.nseen.app.license.LicenseState
import com.nseen.app.ui.navigation.Screen
import com.nseen.app.ui.screens.detail.DetailScreen
import com.nseen.app.ui.screens.detail.DetailViewModel
import com.nseen.app.ui.screens.home.HomeScreen
import com.nseen.app.ui.screens.home.HomeViewModel
import com.nseen.app.ui.screens.onboarding.OnboardingScreen
import com.nseen.app.ui.screens.paywall.PaywallScreen
import com.nseen.app.ui.screens.settings.SettingsScreen
import com.nseen.app.ui.theme.NseenTheme
import com.nseen.app.ui.util.PermissionUtils
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.net.URLDecoder

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val container = (applicationContext as NseenApplication).container

        setContent {
            NseenTheme {
                val navController = rememberNavController()
                val coroutineScope = rememberCoroutineScope()
                val preferences = remember { container.appPreferences }
                val repository = remember { container.messageRepository }
                val licenseManager = remember { container.licenseManager }
                val licenseState by licenseManager.licenseState.collectAsState()

                val isLicensed = licenseState is LicenseState.Active || licenseState is LicenseState.OfflineGrace

                val startDestination = if (
                    !preferences.isOnboardingCompleted ||
                    !PermissionUtils.isNotificationListenerEnabled(this)
                ) {
                    Screen.Onboarding.route
                } else if (isLicensed) {
                    Screen.Home.route
                } else {
                    Screen.Paywall.route
                }

                // Auto-cleanup retention check on app launch
                LaunchedEffect(preferences.retentionDays) {
                    val days = preferences.retentionDays
                    if (days > 0) {
                        coroutineScope.launch(Dispatchers.IO) {
                            val cutoff = System.currentTimeMillis() - (days * 24L * 60L * 60L * 1000L)
                            repository.deleteOlderThan(cutoff)
                        }
                    }
                }

                NavHost(navController = navController, startDestination = startDestination) {

                    // ── Onboarding ────────────────────────────────────────────
                    composable(Screen.Onboarding.route) {
                        OnboardingScreen(
                            onPermissionGranted = {
                                preferences.isOnboardingCompleted = true
                                val nextRoute = if (isLicensed) Screen.Home.route else Screen.Paywall.route
                                navController.navigate(nextRoute) {
                                    popUpTo(Screen.Onboarding.route) { inclusive = true }
                                }
                            }
                        )
                    }

                    // ── Paywall (150 BDT Lifetime) ────────────────────────────
                    composable(Screen.Paywall.route) {
                        PaywallScreen(
                            licenseManager = licenseManager,
                            onBack = {
                                if (isLicensed) {
                                    navController.popBackStack()
                                } else {
                                    finish()
                                }
                            },
                            onLicenseUnlocked = {
                                navController.navigate(Screen.Home.route) {
                                    popUpTo(Screen.Paywall.route) { inclusive = true }
                                }
                            }
                        )
                    }

                    // ── Home ──────────────────────────────────────────────────
                    composable(Screen.Home.route) {
                        val viewModel: HomeViewModel = viewModel(
                            factory = object : androidx.lifecycle.ViewModelProvider.Factory {
                                override fun <T : androidx.lifecycle.ViewModel> create(modelClass: Class<T>): T {
                                    @Suppress("UNCHECKED_CAST")
                                    return HomeViewModel(repository) as T
                                }
                            }
                        )
                        val uiState by viewModel.uiState.collectAsState()

                        HomeScreen(
                            uiState = uiState,
                            onConversationClick = { pkg, convo ->
                                navController.navigate(Screen.Detail.createRoute(pkg, convo))
                            },
                            onSettingsClick = { navController.navigate(Screen.Settings.route) },
                            onFilterChipClick = viewModel::setFilter,
                            onDeletedOnlyToggle = viewModel::setShowDeletedOnly,
                            onSearchQueryChange = viewModel::setSearchQuery,
                            onDeleteConversation = viewModel::deleteConversation
                        )
                    }

                    // ── Detail ────────────────────────────────────────────────
                    composable(
                        route = Screen.Detail.route,
                        arguments = listOf(
                            navArgument("packageName") { type = NavType.StringType },
                            navArgument("conversation") { type = NavType.StringType }
                        )
                    ) { backStackEntry ->
                        val packageName = URLDecoder.decode(
                            backStackEntry.arguments?.getString("packageName") ?: "",
                            "UTF-8"
                        )
                        val conversation = URLDecoder.decode(
                            backStackEntry.arguments?.getString("conversation") ?: "",
                            "UTF-8"
                        )

                        val viewModel: DetailViewModel = viewModel(
                            factory = object : androidx.lifecycle.ViewModelProvider.Factory {
                                override fun <T : androidx.lifecycle.ViewModel> create(modelClass: Class<T>): T {
                                    @Suppress("UNCHECKED_CAST")
                                    return DetailViewModel(repository, packageName, conversation) as T
                                }
                            }
                        )
                        val uiState by viewModel.uiState.collectAsState()

                        DetailScreen(
                            uiState = uiState,
                            conversation = conversation,
                            packageName = packageName,
                            onBack = { navController.popBackStack() },
                            onDeleteMessage = viewModel::deleteMessage
                        )
                    }

                    // ── Settings ──────────────────────────────────────────────
                    composable(Screen.Settings.route) {
                        SettingsScreen(
                            preferences = preferences,
                            licenseManager = licenseManager,
                            onBack = { navController.popBackStack() },
                            onOpenPaywall = { navController.navigate(Screen.Paywall.route) },
                            onClearAll = {
                                coroutineScope.launch(Dispatchers.IO) {
                                    repository.clearAll()
                                }
                            },
                            onRetentionDaysChanged = { days ->
                                if (days > 0) {
                                    coroutineScope.launch(Dispatchers.IO) {
                                        val cutoff = System.currentTimeMillis() - (days * 24L * 60L * 60L * 1000L)
                                        repository.deleteOlderThan(cutoff)
                                    }
                                }
                            }
                        )
                    }
                }
            }
        }
    }
}
