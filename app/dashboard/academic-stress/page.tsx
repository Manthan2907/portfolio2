'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AcademicStress } from '@/components/features/academic-stress'
import { FeaturePageShell } from '@/components/features/feature-page-shell'
import { useAuthStore } from '@/store/authStore'

export default function AcademicStressPage() {
  const router = useRouter()
  const { user, loading } = useAuthStore()
  useEffect(() => { if (!loading && !user) router.replace('/login') }, [loading, user, router])
  if (loading || !user) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading your private space...</div>
  return <FeaturePageShell eyebrow="Academic care" title="Notice pressure before it becomes burnout." description="A private check-in for understanding how school feels, with a small next step when the week starts to feel heavy."><AcademicStress /></FeaturePageShell>
}
