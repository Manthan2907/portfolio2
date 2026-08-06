'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((s) => s.initializeAuth)

  useEffect(() => {
    const unsubscribe = initializeAuth()
    return unsubscribe
  }, [initializeAuth])

  return <>{children}</>
}
