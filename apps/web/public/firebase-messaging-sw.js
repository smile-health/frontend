// Firebase Cloud Messaging Service Worker
// This file must be placed at the root of the public directory to work as a service worker

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js')

// Firebase configuration
// These values are injected at build time by Next.js via DefinePlugin or Workbox
// In development, they fall back to checking for injected globals
const firebaseConfig = {
  apiKey: typeof self.__FIREBASE_API_KEY__ !== 'undefined'
    ? self.__FIREBASE_API_KEY__
    : '%NEXT_PUBLIC_FIREBASE_API_KEY%',
  authDomain: typeof self.__FIREBASE_AUTH_DOMAIN__ !== 'undefined'
    ? self.__FIREBASE_AUTH_DOMAIN__
    : '%NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN%',
  projectId: typeof self.__FIREBASE_PROJECT_ID__ !== 'undefined'
    ? self.__FIREBASE_PROJECT_ID__
    : '%NEXT_PUBLIC_FIREBASE_PROJECT_ID%',
  messagingSenderId: typeof self.__FIREBASE_MESSAGING_SENDER_ID__ !== 'undefined'
    ? self.__FIREBASE_MESSAGING_SENDER_ID__
    : '%NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID%',
  appId: typeof self.__FIREBASE_APP_ID__ !== 'undefined'
    ? self.__FIREBASE_APP_ID__
    : '%NEXT_PUBLIC_FIREBASE_APP_ID%',
}

// Detect environment
const isDevelopment = self.location.hostname === 'localhost' ||
                      self.location.hostname === '127.0.0.1'

// Validate configuration
const hasValidConfig = firebaseConfig.apiKey &&
                       firebaseConfig.apiKey.length > 10 &&
                       firebaseConfig.apiKey !== '%NEXT_PUBLIC_FIREBASE_API_KEY%' &&
                       firebaseConfig.projectId &&
                       firebaseConfig.projectId !== '%NEXT_PUBLIC_FIREBASE_PROJECT_ID%' &&
                       firebaseConfig.projectId !== 'your-project-id'

let messaging = null

if (hasValidConfig) {
  try {
    firebase.initializeApp(firebaseConfig)
    messaging = firebase.messaging()
    console.log('[firebase-messaging-sw.js] Firebase initialized successfully')
  } catch (err) {
    console.error('[firebase-messaging-sw.js] Firebase initialization failed:', err)
  }
} else {
  const errorMsg = '[firebase-messaging-sw.js] Invalid or missing Firebase configuration. ' +
    'Push notifications will not work. ' +
    'Please ensure NEXT_PUBLIC_FIREBASE_* environment variables are set.'

  if (isDevelopment) {
    console.warn(errorMsg)
    console.warn('Config received:', {
      apiKey: firebaseConfig.apiKey ? '***present***' : 'MISSING',
      projectId: firebaseConfig.projectId || 'MISSING',
      authDomain: firebaseConfig.authDomain || 'MISSING',
    })
  } else {
    console.error(errorMsg)
  }
}

const processedMessages = new Set()

// Only set up background message handler if messaging is available
if (messaging) {
  messaging.onBackgroundMessage(function (payload) {
    const messageId = payload.messageId || payload.data?.messageId || Date.now().toString()

    // Deduplication
    if (processedMessages.has(messageId)) {
      console.log(`[firebase-messaging-sw.js] Message already processed (ID: ${messageId}). Skipping.`)
      return
    }

    processedMessages.add(messageId)

    // Prevent memory leaks - limit set size
    if (processedMessages.size > 100) {
      const firstItem = processedMessages.values().next().value
      processedMessages.delete(firstItem)
    }

    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      let lang = 'id'

      if (clients.length > 0) {
        const activeClient = clients[0]
        const url = new URL(activeClient.url)
        const pathSegments = url.pathname.split('/').filter((segment) => segment)
        lang = pathSegments[0] || 'id'
      } else {
        console.log('No active clients found. Using default lang:', lang)
      }

      const title = payload.data?.title?.split(',')?.[0] ||
                    payload.notification?.title?.split(',')?.[0] ||
                    'SMILE Health Notification'

      const body = payload.data?.body?.split(',')?.[0] ||
                   payload.notification?.body?.split(',')?.[0] ||
                   'You have a new notification'

      const icon = payload.data?.icon?.split(',')?.[0] ||
                   payload.notification?.icon?.split(',')?.[0] ||
                   '/icon-192x192.png'

      const url = payload.data?.url?.split(',')?.[0] ||
                  payload.notification?.url?.split(',')?.[0] ||
                  `/${lang}/v5/notification`

      const notificationOptions = {
        body: body,
        icon: icon,
        badge: '/icon-72x72.png',
        tag: messageId,
        requireInteraction: false,
        data: {
          url: url,
          messageId: messageId,
          ...payload.data
        },
      }

      self.registration.showNotification(title, notificationOptions)
    })
  })
}

// Always register notification click handler (even if Firebase failed)
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked')
  event.notification.close()

  const urlToOpen = event.notification.data?.url || '/v5/notification'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Try to focus existing tab
      for (const client of windowClients) {
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          console.log('[firebase-messaging-sw.js] Focusing existing tab:', urlToOpen)
          return client.focus()
        }
      }

      // Open new tab if no existing one
      if (self.clients.openWindow) {
        console.log('[firebase-messaging-sw.js] Opening new tab:', urlToOpen)
        return self.clients.openWindow(urlToOpen)
      }
    })
  )
})

// Service worker lifecycle logging
self.addEventListener('install', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker installing')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker activating')
  event.waitUntil(self.clients.claim())
})
