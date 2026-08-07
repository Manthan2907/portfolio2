'use client'

import { motion } from 'framer-motion'
import { Lock, Heart, Sparkles, ArrowRight } from 'lucide-react'

const reassurances = [
  { icon: <Lock size={14} />, label: 'Private & encrypted' },
  { icon: <Heart size={14} />, label: 'No judgment, ever' },
  { icon: <Sparkles size={14} />, label: 'Personalized to you' },
]

export function CTASection() {
  return (
    <section
      id="start"
      className="relative overflow-hidden py-28 sm:py-40 px-5 sm:px-8"
      aria-labelledby="cta-heading"
    >
      {/* Deep celestial background matching hero */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 130% 90% at 50% 0%, oklch(0.18 0.055 282) 0%, oklch(0.12 0.040 268) 45%, oklch(0.08 0.022 265) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Ambient orbs */}
      <div
        className="orb w-[700px] h-[700px] -top-40 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, oklch(0.50 0.185 282 / 0.45) 0%, transparent 65%)',
          // @ts-expect-error CSS custom property
          '--orb-duration': '18s',
        }}
        aria-hidden="true"
      />
      <div
        className="orb w-[400px] h-[400px] bottom-0 left-0 opacity-15 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, oklch(0.68 0.125 322 / 0.50) 0%, transparent 70%)',
          // @ts-expect-error CSS custom property
          '--orb-duration': '24s',
          '--orb-delay': '6s',
        }}
        aria-hidden="true"
      />
      <div
        className="orb w-[350px] h-[350px] bottom-0 right-0 opacity-12 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, oklch(0.68 0.090 200 / 0.50) 0%, transparent 70%)',
          // @ts-expect-error CSS custom property
          '--orb-duration': '20s',
          '--orb-delay': '10s',
        }}
        aria-hidden="true"
      />

      {/* Stars — smaller than hero */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="star"
            style={{
              left: `${(i * 7.3 + 11) % 100}%`,
              top: `${(i * 13.7 + 5) % 100}%`,
              width: ((i * 13) % 18) / 10 + 0.8,
              height: ((i * 17) % 18) / 10 + 0.8,
              opacity: ((i * 19) % 40) / 100 + 0.1,
              // @ts-expect-error CSS custom property
              '--tw-star-dur': `${((i * 23) % 30) / 10 + 2}s`,
              '--tw-star-delay': `${((i * 29) % 40) / 10}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          viewport={{ once: true, margin: '-60px' }}
          className="flex flex-col items-center gap-5"
        >
          <h2
            id="cta-heading"
            className="font-serif text-5xl sm:text-6xl lg:text-7xl text-white leading-tight text-balance"
          >
            Begin gently.{' '}
            <em
              className="not-italic block sm:inline"
              style={{
                background:
                  'linear-gradient(135deg, oklch(0.78 0.130 280), oklch(0.72 0.130 322) 55%, oklch(0.72 0.090 200))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Begin today.
            </em>
          </h2>

          <p className="text-foreground/55 text-base sm:text-lg max-w-md leading-relaxed">
            No pressure. No performance. Just a quiet space that&apos;s always here — whenever you&apos;re ready.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-4"
        >
          <motion.a
            href="#signup"
            whileHover={{ scale: 1.04, boxShadow: '0 16px 48px oklch(0.50 0.185 282 / 0.50)' }}
            whileTap={{ scale: 0.97 }}
            className="group flex items-center gap-2.5 px-10 py-4.5 rounded-full text-base font-medium bg-primary text-primary-foreground shadow-2xl shadow-primary/35 transition-all duration-300"
            style={{ paddingTop: '1.125rem', paddingBottom: '1.125rem' }}
          >
            Start Your Journey — It&apos;s Free
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </motion.a>

          {/* Reassurance trio */}
          <div className="flex flex-wrap items-center justify-center gap-5 mt-1">
            {reassurances.map((r) => (
              <span key={r.label} className="flex items-center gap-1.5 text-xs text-foreground/40">
                <span className="text-foreground/30">{r.icon}</span>
                {r.label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Thin decorative separator */}
        <div
          className="w-24 h-px mt-4 opacity-25"
          style={{
            background: 'linear-gradient(90deg, transparent, oklch(0.70 0.165 282), transparent)',
          }}
          aria-hidden="true"
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-xs text-foreground/25 max-w-xs"
        >
          Join 10 000+ people tending to their mental wellbeing with MindSpace
        </motion.p>
      </div>
    </section>
  )
}
