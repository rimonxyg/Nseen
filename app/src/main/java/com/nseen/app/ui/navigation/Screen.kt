package com.nseen.app.ui.navigation

sealed class Screen(val route: String) {
    object Onboarding : Screen("onboarding")
    object Home : Screen("home")
    object Detail : Screen("detail/{packageName}/{conversation}") {
        fun createRoute(packageName: String, conversation: String) =
            "detail/${packageName.encode()}/${conversation.encode()}"
    }
    object Settings : Screen("settings")
    object Disclosure : Screen("disclosure")
    object Paywall : Screen("paywall")

    companion object {
        private fun String.encode() = java.net.URLEncoder.encode(this, "UTF-8")
    }
}
