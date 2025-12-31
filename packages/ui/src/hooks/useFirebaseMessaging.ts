import { useEffect, useState } from 'react'
import { toast } from '#components/toast'

import { generateToken, onMessageReceived } from '../utils/firebase'
import { useNotification } from './useNotification'

const defaultNotificationFilter = {
  page: 1,
  paginate: 3,
}

export function useFirebaseMessaging() {
  const [token, setToken] = useState<string | null>(null)
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default'
  )

  const { refetchCount, refetchNotification } = useNotification({
    filter: defaultNotificationFilter,
  })

  const onForegroundMessageReceived = () =>
    onMessageReceived((payload) => {
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

  // Fetch token saat permission berubah ke 'granted'
  useEffect(() => {
    if (permission === 'granted') {
      generateToken().then((newToken) => {
        if (newToken) {
          setToken(newToken)
        } else {
          console.error('❌ Failed to generate FCM token')
        }
      })
    }
  }, [permission])

  // Monitor perubahan permission
  useEffect(() => {
    const interval = setInterval(() => {
      if ('Notification' in window) {
        const current = Notification.permission
        if (current !== permission) {
          // console.log(`[🔄] Notification permission changed: ${current}`)
          setPermission(current)
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [permission])

  return {
    token,
    generateToken,
    onForegroundMessageReceived,
  }
}
