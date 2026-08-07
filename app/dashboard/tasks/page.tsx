'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TaskPlanner } from '@/components/features/task-planner'
import { useAuthStore } from '@/store/authStore'

export default function TasksPage() {
  const router = useRouter()
  const { user, loading } = useAuthStore()
  useEffect(() => { if (!loading && !user) router.replace('/login') }, [loading, user, router])
  if (loading || !user) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading your private space...</div>
  return <main className="min-h-screen bg-background px-5 py-10 text-foreground lg:ml-64 lg:px-10"><div className="mx-auto max-w-6xl"><TaskPlanner /></div></main>
}
