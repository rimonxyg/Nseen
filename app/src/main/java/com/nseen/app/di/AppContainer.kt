package com.nseen.app.di

import android.content.Context
import com.nseen.app.data.local.NseenDatabase
import com.nseen.app.data.preferences.AppPreferences
import com.nseen.app.data.repository.MessageRepository
import com.nseen.app.license.LicenseManager

/**
 * Dependency container providing shared single instances across ViewModels, Services, and Workers.
 */
class AppContainer(private val context: Context) {

    val database: NseenDatabase by lazy {
        NseenDatabase.getInstance(context)
    }

    val messageRepository: MessageRepository by lazy {
        MessageRepository(database.messageDao())
    }

    val appPreferences: AppPreferences by lazy {
        AppPreferences(context)
    }

    val licenseManager: LicenseManager by lazy {
        LicenseManager(context)
    }
}
