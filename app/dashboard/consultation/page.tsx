'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ConsultationBooking } from '@/components/features/consultation-booking'
import { FeaturePageShell } from '@/components/features/feature-page-shell'
import { useAuthStore } from '@/store/authStore'

export default function ConsultationPage() {
  const router = useRouter()
  const { user, loading } = useAuthStore()
  useEffect(() => { if (!loading && !user) router.replace('/login') }, [loading, user, router])
  if (loading || !user) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading your private space...</div>
  return <FeaturePageShell eyebrow="Human support" title="You do not have to carry it alone." description="Browse a small, calm directory and request a private conversation when you need a little more support."><ConsultationBooking /></FeaturePageShell>
}
