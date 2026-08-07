import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '@/lib/firebase'
import type { WellnessData } from '@/lib/wellness'

function requireDb() {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase data storage is not configured for this environment.')
  }
  return db
}

function userWellnessRef(userId: string) {
  return doc(requireDb(), 'users', userId, 'private', 'wellness')
}

export async function loadPrivateWellnessData(userId: string): Promise<WellnessData | null> {
  const snapshot = await getDoc(userWellnessRef(userId))
  if (!snapshot.exists()) return null
  const data = snapshot.data().data
  return data && typeof data === 'object' ? data as WellnessData : null
}

export async function savePrivateWellnessData(userId: string, data: WellnessData) {
  await setDoc(userWellnessRef(userId), {
    data,
    updatedAt: serverTimestamp(),
  }, { merge: true })
}

export async function clearPrivateWellnessData(userId: string) {
  await setDoc(userWellnessRef(userId), {
    data: {
      habits: [],
      completions: {},
      moods: [],
      journal: [],
      stress: [],
    },
    updatedAt: serverTimestamp(),
  }, { merge: true })
}
