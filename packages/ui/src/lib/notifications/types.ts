smile-health\frontend\packages\ui\src\lib\notifications\types.ts
```

/**
 * Notification Provider Interface
 * Abstracts Firebase Cloud Messaging (FCM) behind a provider-agnostic interface
 * Allows switching notification backends without changing consuming code
 */

export interface NotificationMessage {
  notification?: {
    title?: string
    body?: string
    icon?: string
  }
  data?: {
    [key: string]: string | undefined
  }
  messageId?: string
}

export type NotificationCallback = (payload: NotificationMessage) => void

export interface NotificationProvider {
  /**
   * Initialize the notification provider
   * @returns Promise that resolves when initialization is complete
   */
  initialize(): Promise<void>

  /**
   * Get the device token for push notifications
   * @returns Promise that resolves to the device token or null if unavailable
   */
  getDeviceToken(): Promise<string | null>

  /**
   * Register a callback for foreground messages
   * @param callback - Function to call when a foreground message is received
   */
  onForegroundMessage(callback: NotificationCallback): void

  /**
   * Request permission from the user to send notifications
   * @returns Promise that resolves to the permission status
   */
  requestPermission(): Promise<NotificationPermission>
}

export interface NotificationProviderConfig {
  provider: 'firebase' | 'noop'
  firebaseConfig?: {
    apiKey: string
    authDomain: string
    projectId: string
    storageBucket: string
    messagingSenderId: string
    appId: string
    measurementId?: string
  }
  vapidKey?: string
}
