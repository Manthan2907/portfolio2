'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthForm } from '@/components/auth/auth-form'
import { useAuthStore } from '@/store/authStore'

export default function SignupPage() {
  const router = useRouter()
  const { user, loading } = useAuthStore()

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard')
  }, [loading, user, router])

  return <AuthForm mode="signup" />
}
