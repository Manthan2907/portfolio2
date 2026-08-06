'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardShell } from '@/components/mindspace/dashboard-shell'
import { useAuthStore } from '@/store/authStore'

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuthStore()
  useEffect(() => { if (!loading && !user) router.replace('/') }, [loading, user, router])
  if (loading || !user) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading your private space...</div>
  return <DashboardShell section="overview" />
}
