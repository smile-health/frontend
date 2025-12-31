import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBU7Kv5lSHhVd-emcIgwVUQrN5bo3ZPNo8',
  authDomain: 'smile-platform.firebaseapp.com',
  projectId: 'smile-platform',
  storageBucket: 'smile-platform.firebasestorage.app',
  messagingSenderId: '39330161703',
  appId: '1:39330161703:web:097f935a8dbfa219c41a02',
  measurementId: 'G-WTEE61PVKP',
}

const app = initializeApp(firebaseConfig)

let messaging: ReturnType<typeof getMessaging> | null = null

if (typeof window !== 'undefined') {
  messaging = getMessaging(app)
}

export const generateToken = async (): Promise<string | null> => {
  if (!messaging) return null

  try {
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    })
    return token
  } catch (error) {
    console.error('Error generating FCM token:', error)
    return null
  }
}

export const onMessageReceived = (callback: (payload: any) => void) => {
  if (messaging && typeof window !== 'undefined') {
    onMessage(messaging, (payload) => {
      callback(payload)
    })
  }
}
