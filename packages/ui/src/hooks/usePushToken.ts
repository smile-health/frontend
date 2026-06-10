/**
 * Device Push Token Hook
 *
 * Provides a vendor-neutral push notification token for the device.
 * Uses the NotificationProvider abstraction internally (currently Firebase
 * Cloud Messaging via FCMNotificationProvider), but the consuming code
 * should not depend on which provider is used.
 *
 * == Optional Capability ==
 * Push notifications are OPTIONAL. A deployer that does not need web push
 * notifications can leave the Firebase (FCM) env vars unset. In that case
 * the NoopNotificationProvider is used internally, and this hook returns
 * `{ token: null, ready: true }`.
 *
 * == Login Flow ==
 * The returned `token` is sent as `fcm_token` in the login request body.
 * The backend schema (authSchemas.ts) defines `fcm_token` as optional
 * (`z.string().optional()`), and the login handler wraps the token save in
 * a try/catch that explicitly "WONT fail the login request". Therefore
 * nothing in the login flow depends on the push token being available.
 */

import { useEffect, useState } from 'react'
import { toast } from '#components/toast'

import {
  initializeNotificationProvider,
  getNotificationProvider,
  NotificationMessage,
} from '../lib/notifications'
import { useNotification } from './useNotification'

const defaultNotificationFilter = {
  page: 1,
  paginate: 3,
}

export function usePushToken() {
  const [token, setToken] = useState<string | null>(null)
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default'
  )
  const [ready, setReady] = useState(false)

  const { refetchCount, refetchNotification } = useNotification({
    filter: defaultNotificationFilter,
  })

  // Initialize provider on mount
  useEffect(() => {
    initializeNotificationProvider()
  }, [])

  const onForegroundMessageReceived = () => {
    const provider = getNotificationProvider()
    provider.onForegroundMessage((payload: NotificationMessage) => {
      toast.success({
        type: 'notification',
        notification: {
          item: {
            user_id: payload?.data?.user_id || payload?.notification?.id,
            regency_id:
              payload?.data?.regency_id || payload?.notification?.regency_id,
            province_id:
              payload?.data?.province_id || payload?.notification?.province_id,
            entity_id:
              payload?.data?.entity_id || payload?.notification?.entity_id,
            media: payload?.data?.media || payload?.notification?.media,
            patient_id:
              payload?.data?.patient_id || payload?.notification?.patient_id,
            updated_at:
              payload?.data?.updated_at || payload?.notification?.updated_at,
            patient: payload?.data?.patient || payload?.notification?.patient,
            id: payload?.data?.id || payload?.notification?.id,
            title:
              payload?.data?.title?.split(',')?.[0] ||
              payload?.notification?.title?.split(',')?.[0],
            message:
              payload?.data?.body?.split(',')?.[0] ||
              payload?.notification?.body?.split(',')?.[0],
            created_at:
              payload?.data?.created_at || payload?.notification?.created_at,
            action_url:
              payload?.data?.action_url || payload?.notification?.action_url,
            download_url:
              payload?.data?.download_url ||
              payload?.notification?.download_url,
            read_at: payload?.data?.read_at || payload?.notification?.read_at,
            entity: payload?.data?.entity || payload?.notification?.entity,
            user: payload?.data?.user || payload?.notification?.user,
            mobile_phone:
              payload?.data?.mobile_phone ||
              payload?.notification?.mobile_phone,
            program: payload?.data?.program || payload?.notification?.program,
            type: payload?.data?.type || payload?.notification?.type,
          },
          handleNotificationItemClick: (item) => {
            console.log('Notification clicked:', item)
          },
        },
        duration: 2000,
        position: 'bottom-right',
      })
      refetchCount()
      refetchNotification()
    })
  }

  // Fetch token when permission changes to 'granted'
  useEffect(() => {
    if (permission === 'granted') {
      const provider = getNotificationProvider()
      provider.getDeviceToken().then((newToken) => {
        if (newToken) {
          setToken(newToken)
        } else {
          console.warn(
            '[usePushToken] No FCM token generated — push notifications may not be configured (firebase env vars missing).'
          )
        }
        setReady(true)
      })
    } else {
      // Permission not granted (denied or default) — mark ready immediately
      setReady(true)
    }
  }, [permission])

  // Monitor permission changes
  useEffect(() => {
    const interval = setInterval(() => {
      if ('Notification' in window) {
        const current = Notification.permission
        if (current !== permission) {
          setPermission(current)
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [permission])

  // Wrapper for generateToken that uses provider
  const generateToken = async (): Promise<string | null> => {
    const provider = getNotificationProvider()
    return provider.getDeviceToken()
  }

  return {
    token,
    ready,
    generateToken,
    onForegroundMessageReceived,
  }
}
