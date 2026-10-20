package com.nseen.app

import android.app.Application
import com.nseen.app.di.AppContainer

class NseenApplication : Application() {

    lateinit var container: AppContainer
        private set

    override fun onCreate() {
        super.onCreate()
        container = AppContainer(this)
    }
}
