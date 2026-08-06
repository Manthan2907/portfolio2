import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'

const googleProvider = new GoogleAuthProvider()

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
  const ref = doc(db, 'users', user.uid)
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
      const result = await signInWithPopup(auth, googleProvider)
      if (!result?.user) throw new Error('Google sign-in returned no user')
      await createUserDocument(result.user)
      return result.user
    } catch (error) {
      if (isRedirectFallback(error)) {
        await signInWithRedirect(auth, googleProvider)
        return null
      }
      throw error
    }
  },

  /** Call on every page load to finish a redirect-based Google sign-in. */
  handleRedirectResult: async () => {
    try {
      const result = await getRedirectResult(auth)
      if (result?.user) await createUserDocument(result.user)
    } catch (error) {
      console.error('Redirect sign-in result error:', error)
    }
  },

  /** Email/password sign-up — creates Firestore user document. */
  signUp: async (email: string, password: string, name: string): Promise<User> => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await createUserDocument(result.user, { name })
    return result.user
  },

  /** Email/password sign-in. */
  signIn: async (email: string, password: string): Promise<User> => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result.user
  },

  /** Sign out. */
  logout: async () => {
    await signOut(auth)
  },

  /** Subscribe to auth state changes. Returns unsubscribe function. */
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback)
  },
}
