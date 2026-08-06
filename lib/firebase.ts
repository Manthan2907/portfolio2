import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getAuth, setPersistence, browserLocalPersistence, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const requiredConfig = Object.values(firebaseConfig)
export const isFirebaseConfigured = requiredConfig.every(
  (value): value is string => typeof value === 'string' && value.trim().length > 0
)

// Firebase configuration is optional in preview environments. Keep the app
// renderable when credentials are not configured, and fail only when an auth
// or data operation is explicitly requested.
const app: FirebaseApp | null = isFirebaseConfigured
  ? !getApps().length
    ? initializeApp(firebaseConfig)
    : getApp()
  : null
const auth: Auth | null = app ? getAuth(app) : null
const db: Firestore | null = app ? getFirestore(app) : null

// Set persistence to LOCAL so sessions survive page reloads.
// Only runs in the browser — Firebase auth APIs are client-only.
if (auth && typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.error('Failed to set auth persistence:', err)
  })
}

export { app, auth, db }
