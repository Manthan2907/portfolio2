import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { auth, db, isFirebaseConfigured } from '@/lib/firebase'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'

const googleProvider = new GoogleAuthProvider()

function requireFirebaseAuth() {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('Firebase authentication is not configured for this environment.')
  }
  return auth
}

function requireFirebaseDb() {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase data storage is not configured for this environment.')
  }
  return db
}

// Errors where popup is unreliable — fall back to full-page redirect.
const REDIRECT_FALLBACK_CODES = new Set([
  'auth/popup-blocked',
  'auth/popup-closed-by-user',
  'auth/cancelled-popup-request',
  'auth/operation-not-allowed',
])

function isRedirectFallback(error: unknown): boolean {
  const code = (error as { code?: string } | null)?.code
  return !!code && REDIRECT_FALLBACK_CODES.has(code)
}

async function createUserDocument(user: User, extra?: { name?: string }) {
  const ref = doc(requireFirebaseDb(), 'users', user.uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email,
      name: extra?.name ?? user.displayName ?? '',
      photoURL: user.photoURL ?? '',
      createdAt: serverTimestamp(),
    })
  }
}

export const authService = {
  /** Google Sign-In — returns User or null (null = redirect flow started). */
  signInWithGoogle: async (): Promise<User | null> => {
    try {
      const result = await signInWithPopup(requireFirebaseAuth(), googleProvider)
      if (!result?.user) throw new Error('Google sign-in returned no user')
      await createUserDocument(result.user)
      return result.user
    } catch (error) {
      if (isRedirectFallback(error)) {
        await signInWithRedirect(requireFirebaseAuth(), googleProvider)
        return null
      }
      throw error
    }
  },

  /** Call on every page load to finish a redirect-based Google sign-in. */
  handleRedirectResult: async () => {
    if (!isFirebaseConfigured || !auth) return
    try {
      const result = await getRedirectResult(requireFirebaseAuth())
      if (result?.user) await createUserDocument(result.user)
    } catch (error) {
      console.error('Redirect sign-in result error:', error)
    }
  },

  /** Email/password sign-up — creates Firestore user document. */
  signUp: async (email: string, password: string, name: string): Promise<User> => {
    const result = await createUserWithEmailAndPassword(requireFirebaseAuth(), email, password)
    await createUserDocument(result.user, { name })
    return result.user
  },

  /** Email/password sign-in. */
  signIn: async (email: string, password: string): Promise<User> => {
    const result = await signInWithEmailAndPassword(requireFirebaseAuth(), email, password)
    return result.user
  },

  /** Send a password reset email. */
  resetPassword: async (email: string) => {
    await sendPasswordResetEmail(requireFirebaseAuth(), email)
  },

  /** Sign out. */
  logout: async () => {
    await signOut(requireFirebaseAuth())
  },

  /** Subscribe to auth state changes. Returns unsubscribe function. */
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    if (!isFirebaseConfigured || !auth) {
      callback(null)
      return () => {}
    }
    return onAuthStateChanged(requireFirebaseAuth(), callback)
  },
}
