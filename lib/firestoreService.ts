import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

// Convert Firestore Timestamps to ISO strings for easy serialisation
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
    const docRef = doc(db, collectionName, docId)
    const snap = await getDoc(docRef)
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
    const docRef = doc(db, collectionName, docId)
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() })
  },

  deleteDocument: async (collectionName: string, docId: string) => {
    await deleteDoc(doc(db, collectionName, docId))
  },

  getUserDocuments: async (collectionName: string, userId: string) => {
    const q = query(
      collection(db, collectionName),
      where('userId', '==', userId)
    )
    const snap = await getDocs(q)
    const docs = snap.docs.map((d) => ({
      id: d.id,
      ...convertTimestamps(d.data() as Record<string, unknown>),
    }))
    // Sort client-side by createdAt descending (avoids composite index requirement)
    return docs.sort((a, b) => {
      const aTime = (a as { createdAt?: string }).createdAt ?? ''
      const bTime = (b as { createdAt?: string }).createdAt ?? ''
      return bTime.localeCompare(aTime)
    })
  },
}
