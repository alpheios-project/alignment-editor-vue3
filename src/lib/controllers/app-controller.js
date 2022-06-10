import { createApp } from 'vue'
import { createStore } from 'vuex'

import appVue from '@/vue/app.vue'

import L10nSingleton from '@/lib/l10n/l10n-singleton.js'
import Locales from '@/locales/locales.js'
import NotificationSingleton from '@/lib/notifications/notification-singleton'

import StoreDefinition from '@/lib/store/store-definition'

import TextsController from '@/lib/controllers/texts-controller.js'
import SettingsController from '@/lib/controllers/settings-controller.js'
import StorageController from '@/lib/controllers/storage-controller.js'

export default class AppController {
  constructor ({ appId } = {}) {
    if (!appId) {
      console.error('You should define id inside AppController initialization to start the application.')
      return
    }
    this.pageSettings = {
      appId
    }
  }

  async init () {
    this.defineStore()
    this.defineL10Support()
    this.defineNotificationSupport()
    this.defineStorageController()

    await this.defineSettingsController()

    if (this.pageSettings && this.pageSettings.appId) {
      this.attachVueComponents()
    }
  }

  defineStore () {
    this.store = createStore(StoreDefinition.defaultDefinition)
  }

  attachVueComponents () {
    const app = createApp(appVue)

    this.defineTextController(app)
    app.use(this.store)
    app.mount(`#${this.pageSettings.appId}`) 
  }

  defineTextController (app) {
    this.textC = new TextsController(this.store)
    app.provide('textC', this.textC)
  }

  async defineSettingsController () {
    await SettingsController.init(this.store)

    const uploaded = await SettingsController.uploadRemoteSettings()
    if (!uploaded) {
      const result = SettingsController.downgradeToOffline()

      if (result) {
        NotificationSingleton.addNotification({
          text: L10nSingleton.getMsgS('APP_CONTROLLER_DOWNGRADE_TO_OFFLINE'),
          type: NotificationSingleton.types.INFO
        })
      }
    } else {
      const result = SettingsController.upgradeToRemote()

      if (result) {
        NotificationSingleton.addNotification({
          text: L10nSingleton.getMsgS('APP_CONTROLLER_UPGRADE_TO_REMOTE'),
          type: NotificationSingleton.types.INFO
        })
      }
    }
  }

  defineL10Support () {
    const config = {
      defaultLocale: Locales.en_US,
      messageBundles: Locales.bundleArr(Locales.predefinedLocales())
    }

    const l10n = new L10nSingleton()
    config.messageBundles.forEach(mb => l10n.addMessageBundle(mb))
    l10n.setLocale(config.defaultLocale)
    return l10n
  }

  defineNotificationSupport () {
    const notificationSingleton = new NotificationSingleton(this.store)
    return notificationSingleton
  }

  defineStorageController () {
    StorageController.definedDBAdapter()
  }
}
