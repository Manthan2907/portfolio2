'use client'

import { create } from 'zustand'
import type { User } from 'firebase/auth'
import { authService } from '@/lib/authService'
import { isFirebaseConfigured } from '@/lib/firebase'

interface AuthState {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  logout: () => Promise<void>
  initializeAuth: () => () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user, loading: false }),

  logout: async () => {
    try {
      await authService.logout()
    } catch (err) {
      console.error('Logout error:', err)
    }
    set({ user: null, loading: false })
  },

  initializeAuth: () => {
    if (!isFirebaseConfigured) {
      set({ loading: false })
      return () => {}
    }

    // Handle any pending Google redirect result first
    authService.handleRedirectResult().catch(console.error)

    const unsubscribe = authService.onAuthStateChanged((user) => {
      set({ user, loading: false })
    })
    return unsubscribe
  },
}))
