import { BreathingSection } from '@/components/mindspace/breathing-section'
import { CTASection } from '@/components/mindspace/cta-section'
import { CommunitySection } from '@/components/mindspace/community-section'
import { FeaturesSection } from '@/components/mindspace/features-section'
import { Footer } from '@/components/mindspace/footer'
import { HeroSection } from '@/components/mindspace/hero-section'
import { InsightsSection } from '@/components/mindspace/insights-section'
import { JournalSection } from '@/components/mindspace/journal-section'
import { MoodCheckin } from '@/components/mindspace/mood-checkin'
import { Nav } from '@/components/mindspace/nav'
import { StressSection } from '@/components/mindspace/stress-section'
import { Testimonials } from '@/components/mindspace/testimonials'

export default function Page() {
  return (
    <>
      {/* Fixed navigation */}
      <Nav />

      <main id="main-content">
        {/* 1 — Immersive hero with celestial starfield */}
        <HeroSection />

        {/* 2 — Daily mood check-in + emotional reflection */}
        <MoodCheckin />

        {/* 3 — Journal / writing space */}
        <JournalSection />

        {/* 4 — Guided breathing exercise */}
        <BreathingSection />

        {/* 5 — Wellness insights + emotional patterns */}
        <InsightsSection />

        {/* 6 — Stress monitoring + coping suggestions */}
        <StressSection />

        {/* 7 — Feature overview cards */}
        <FeaturesSection />

        {/* 8 — Community voices + support */}
        <CommunitySection />

        {/* 9 — Social proof / testimonials */}
        <Testimonials />

        {/* 10 — Final CTA */}
        <CTASection />
      </main>

      <Footer />
    </>
  )
}
