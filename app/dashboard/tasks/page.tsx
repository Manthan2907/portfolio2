'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TaskPlanner } from '@/components/features/task-planner'
import { FeaturePageShell } from '@/components/features/feature-page-shell'
import { useAuthStore } from '@/store/authStore'

export default function TasksPage() {
  const router = useRouter()
  const { user, loading } = useAuthStore()
  useEffect(() => { if (!loading && !user) router.replace('/login') }, [loading, user, router])
  if (loading || !user) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading your private space...</div>
  return <FeaturePageShell eyebrow="Academic rhythm" title="Make the next step visible." description="Keep coursework and care in the same private workspace, with a clear place for what matters next."><TaskPlanner /></FeaturePageShell>
}
