
/**
 * Notification Provider Factory
 * Provides a unified interface for creating and accessing notification providers
 */

import { FCMNotificationProvider, createFCMProvider } from './fcm-provider'
import {
  NotificationProvider,
  NotificationProviderConfig,
  NotificationMessage,
  NotificationCallback,
} from './types'

export * from './types'
export { FCMNotificationProvider, createFCMProvider } from './fcm-provider'

/**
 * No-op notification provider for when notifications are disabled
 * or in server-side rendering contexts
 */
class NoopNotificationProvider implements NotificationProvider {
  async initialize(): Promise<void> {
    // No-op
  }

  async getDeviceToken(): Promise<string | null> {
    return null
  }

  onForegroundMessage(_callback: NotificationCallback): void {
    // No-op
  }

  async requestPermission(): Promise<NotificationPermission> {
    return 'default'
  }
}

// Singleton instance
let notificationProviderInstance: NotificationProvider | null = null

/**
 * Create a notification provider based on configuration
 */
export function createNotificationProvider(
  config: NotificationProviderConfig
): NotificationProvider {
  switch (config.provider) {
    case 'firebase':
      return new FCMNotificationProvider(config)
    case 'noop':
    default:
      return new NoopNotificationProvider()
  }
}

/**
 * Initialize the global notification provider singleton
 * Call this once at app startup
 */
export function initializeNotificationProvider(
  config?: NotificationProviderConfig
): NotificationProvider {
  if (notificationProviderInstance) {
    return notificationProviderInstance
  }

  // Auto-configure from environment if no config provided
  if (!config) {
    const isClient = typeof window !== 'undefined'
    const hasFirebaseConfig =
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

    if (isClient && hasFirebaseConfig) {
      config = {
        provider: 'firebase',
        firebaseConfig: {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
          messagingSenderId:
            process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
          measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
        },
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      }
    } else {
      // Warn about missing configuration
      if (isClient && !hasFirebaseConfig) {
        console.warn(
          '[NotificationProvider] Firebase configuration missing. ' +
          'Push notifications will not work. ' +
          'Please set NEXT_PUBLIC_FIREBASE_API_KEY and NEXT_PUBLIC_FIREBASE_PROJECT_ID ' +
          'environment variables.'
        )
      }
      config = { provider: 'noop' }
    }
  }

  notificationProviderInstance = createNotificationProvider(config)
  return notificationProviderInstance
}

/**
 * Check if the current notification provider is the noop provider
 * (i.e., notifications are not actually enabled)
 */
export function isNoopProvider(): boolean {
  if (!notificationProviderInstance) {
    return true
  }
  // Check if it's a NoopNotificationProvider by checking method behavior
  // This is a heuristic since we don't export the class
  return !isNotificationSupported() || !process.env.NEXT_PUBLIC_FIREBASE_API_KEY
}

/**
 * Get the current notification provider instance
 * Throws if initializeNotificationProvider hasn't been called
 */
export function getNotificationProvider(): NotificationProvider {
  if (!notificationProviderInstance) {
    // Auto-initialize with default config
    return initializeNotificationProvider()
  }
  return notificationProviderInstance
}

/**
 * Check if notifications are supported in the current environment
 */
export function isNotificationSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator
  )
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'default'
  }
  return Notification.permission
}
