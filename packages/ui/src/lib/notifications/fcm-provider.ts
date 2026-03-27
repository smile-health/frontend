```
smile-health\frontend\packages\ui\src\lib\notifications\fcm-provider.ts

/**
 * Firebase Cloud Messaging (FCM) Provider Implementation
 * Implements the NotificationProvider interface using Firebase SDK
 */

import { initializeApp, FirebaseApp } from 'firebase/app'
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging'
import {
  NotificationProvider,
  NotificationProviderConfig,
  NotificationCallback,
} from './types'

export class FCMNotificationProvider implements NotificationProvider {
  private app: FirebaseApp | null = null
  private messaging: Messaging | null = null
  private config: NotificationProviderConfig
  private initialized = false

  constructor(config: NotificationProviderConfig) {
    this.config = config
  }

  async initialize(): Promise<void> {
    if (this.initialized) return
    if (typeof window === 'undefined') return

    if (!this.config.firebaseConfig) {
      throw new Error('Firebase configuration is required for FCM provider')
    }

    this.app = initializeApp(this.config.firebaseConfig)
    this.messaging = getMessaging(this.app)
    this.initialized = true
  }

  async getDeviceToken(): Promise<string | null> {
    if (!this.messaging) return null

    try {
      const token = await getToken(this.messaging, {
        vapidKey: this.config.vapidKey,
      })
      return token
    } catch (error) {
      console.error('Error generating FCM token:', error)
      return null
    }
  }

  onForegroundMessage(callback: NotificationCallback): void {
    if (!this.messaging || typeof window === 'undefined') return

    onMessage(this.messaging, (payload) => {
      callback({
        notification: payload.notification
          ? {
              title: payload.notification.title,
              body: payload.notification.body,
              icon: payload.notification.icon,
            }
          : undefined,
        data: payload.data,
        messageId: payload.messageId,
      })
    })
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'default'
    }

    try {
      const permission = await Notification.requestPermission()
      return permission
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return 'default'
    }
  }
}

export function createFCMProvider(
  firebaseConfig: NotificationProviderConfig['firebaseConfig'],
  vapidKey?: string
): FCMNotificationProvider {
  return new FCMNotificationProvider({
    provider: 'firebase',
    firebaseConfig,
    vapidKey,
  })
}
