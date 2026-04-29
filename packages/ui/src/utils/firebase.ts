/**
 * Firebase Cloud Messaging Utilities
 *
 * This file is now a thin wrapper around the NotificationProvider abstraction.
 * It maintains backward compatibility while delegating to the provider.
 *
 * @deprecated Use the NotificationProvider from '#lib/notifications' instead for new code
 */

import {
  initializeNotificationProvider,
  getNotificationProvider,
  NotificationMessage,
} from '../lib/notifications'

// Initialize the notification provider with Firebase config from environment
const provider = initializeNotificationProvider()

/**
 * Generate FCM device token
 * @returns Promise that resolves to the FCM token or null
 * @deprecated Use NotificationProvider.getDeviceToken() instead
 */
export const generateToken = async (): Promise<string | null> => {
  return provider.getDeviceToken()
}

/**
 * Register callback for foreground messages
 * @param callback - Function to call when foreground message received
 * @deprecated Use NotificationProvider.onForegroundMessage() instead
 */
export const onMessageReceived = (
  callback: (payload: NotificationMessage) => void
): void => {
  provider.onForegroundMessage(callback)
}

/**
 * Request notification permission from user
 * @returns Promise that resolves to permission status
 * @deprecated Use NotificationProvider.requestPermission() instead
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  return provider.requestPermission()
}

// Re-export types for convenience
export type { NotificationMessage, NotificationCallback } from '../lib/notifications'
