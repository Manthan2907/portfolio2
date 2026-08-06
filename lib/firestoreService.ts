import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  type Query,
  type DocumentData,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MoodEntry {
  id?: string
  userId: string
  moodId: string
  moodLabel: string
  note?: string
  createdAt?: string
}

export interface JournalEntry {
  id?: string
  userId: string
  content: string
  wordCount: number
  createdAt?: string
}

export interface BreathingSession {
  id?: string
  userId: string
  cycles: number
  durationSeconds: number
  createdAt?: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function convertTimestamps(data: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Timestamp) {
      result[key] = value.toDate().toISOString()
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = convertTimestamps(value as Record<string, unknown>)
    } else {
      result[key] = value
    }
  }
  return result
}

// ── Generic CRUD ──────────────────────────────────────────────────────────────

export const firestoreService = {
  addDocument: async (
    collectionName: string,
    userId: string,
    data: Record<string, unknown>
  ) => {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      userId,
      createdAt: serverTimestamp(),
    })
    return docRef.id
  },

  getDocument: async (collectionName: string, docId: string) => {
    const snap = await getDoc(doc(db, collectionName, docId))
    if (snap.exists()) {
      return { id: snap.id, ...convertTimestamps(snap.data() as Record<string, unknown>) }
    }
    return null
  },

  updateDocument: async (
    collectionName: string,
    docId: string,
    data: Record<string, unknown>
  ) => {
    await updateDoc(doc(db, collectionName, docId), { ...data, updatedAt: serverTimestamp() })
  },

  deleteDocument: async (collectionName: string, docId: string) => {
    await deleteDoc(doc(db, collectionName, docId))
  },

  /** One-time fetch — user scoped, sorted newest-first */
  getUserDocuments: async (collectionName: string, userId: string) => {
    const q = query(
      collection(db, collectionName),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({
      id: d.id,
      ...convertTimestamps(d.data() as Record<string, unknown>),
    }))
  },

  /** Real-time listener — user scoped, sorted newest-first, optional limit */
  subscribeToUserDocuments: (
    collectionName: string,
    userId: string,
    callback: (docs: (Record<string, unknown> & { id: string })[]) => void,
    maxDocs?: number
  ) => {
    let q: Query<DocumentData> = query(
      collection(db, collectionName),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    if (maxDocs) q = query(q, limit(maxDocs))

    return onSnapshot(q, (snap) => {
      callback(
        snap.docs.map((d) => ({
          id: d.id,
          ...convertTimestamps(d.data() as Record<string, unknown>),
        }))
      )
    })
  },
}

// ── Typed collection helpers ──────────────────────────────────────────────────

export const moodService = {
  save: (userId: string, moodId: string, moodLabel: string, note = '') =>
    firestoreService.addDocument('moods', userId, { moodId, moodLabel, note }),

  /** Get entries from the last N days */
  getRecent: async (userId: string, days = 7): Promise<(MoodEntry & { id: string })[]> => {
    const since = new Date()
    since.setDate(since.getDate() - days)
    const q = query(
      collection(db, 'moods'),
      where('userId', '==', userId),
      where('createdAt', '>=', Timestamp.fromDate(since)),
      orderBy('createdAt', 'asc')
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({
      id: d.id,
      ...(convertTimestamps(d.data() as Record<string, unknown>) as Omit<MoodEntry, 'id'>),
    }))
  },

  subscribe: (
    userId: string,
    days: number,
    callback: (entries: (MoodEntry & { id: string })[]) => void
  ) => {
    const since = new Date()
    since.setDate(since.getDate() - days)
    const q = query(
      collection(db, 'moods'),
      where('userId', '==', userId),
      where('createdAt', '>=', Timestamp.fromDate(since)),
      orderBy('createdAt', 'asc')
    )
    return onSnapshot(q, (snap) => {
      callback(
        snap.docs.map((d) => ({
          id: d.id,
          ...(convertTimestamps(d.data() as Record<string, unknown>) as Omit<MoodEntry, 'id'>),
        }))
      )
    })
  },
}

export const journalService = {
  save: (userId: string, content: string) =>
    firestoreService.addDocument('journals', userId, {
      content,
      wordCount: content.split(/\s+/).filter(Boolean).length,
    }),

  subscribe: (
    userId: string,
    callback: (entries: (JournalEntry & { id: string })[]) => void,
    maxDocs = 5
  ) =>
    firestoreService.subscribeToUserDocuments(
      'journals',
      userId,
      (docs) => callback(docs as unknown as (JournalEntry & { id: string })[]),
      maxDocs
    ),
}

export const breathingService = {
  save: (userId: string, cycles: number, durationSeconds: number) =>
    firestoreService.addDocument('breathing_sessions', userId, { cycles, durationSeconds }),
}
