'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Lock, Shield, Sparkles } from 'lucide-react'
import { useMemo } from 'react'

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.3 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

const trustItems = [
  { icon: <Shield size={13} />, label: '10 000+ minds at peace' },
  { icon: <Lock size={13} />, label: 'Privacy-first, always' },
  { icon: <Sparkles size={13} />, label: 'No judgment, ever' },
]

function Stars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 2.5 + 1,
        duration: `${Math.random() * 4 + 2.5}s`,
        delay: `${Math.random() * 5}s`,
        opacity: Math.random() * 0.5 + 0.15,
      })),
    [],
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {stars.map((s) => (
        <span
          key={s.id}
          className="star"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            // @ts-expect-error CSS custom property
            '--tw-star-dur': s.duration,
            '--tw-star-delay': s.delay,
          }}
        />
      ))}
    </div>
  )
}

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* Deep celestial background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 120% 80% at 50% 0%, oklch(0.18 0.055 282) 0%, oklch(0.12 0.040 268) 40%, oklch(0.08 0.022 265) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Ambient orbs */}
      <div
        className="orb w-[600px] h-[600px] -top-40 -left-20"
        style={{
          background: 'radial-gradient(circle, oklch(0.50 0.185 282 / 0.28) 0%, transparent 70%)',
          // @ts-expect-error CSS custom property
          '--orb-duration': '16s',
          '--orb-delay': '0s',
        }}
        aria-hidden="true"
      />
      <div
        className="orb w-[500px] h-[500px] top-1/4 -right-32"
        style={{
          background: 'radial-gradient(circle, oklch(0.68 0.125 322 / 0.20) 0%, transparent 70%)',
          // @ts-expect-error CSS custom property
          '--orb-duration': '20s',
          '--orb-delay': '4s',
        }}
        aria-hidden="true"
      />
      <div
        className="orb w-[400px] h-[400px] bottom-10 left-1/4"
        style={{
          background: 'radial-gradient(circle, oklch(0.68 0.090 200 / 0.18) 0%, transparent 70%)',
          // @ts-expect-error CSS custom property
          '--orb-duration': '18s',
          '--orb-delay': '8s',
        }}
        aria-hidden="true"
      />

      <Stars />

      {/* Thin horizontal shimmer line */}
      <div
        className="absolute top-1/2 left-0 w-full h-px opacity-20 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, oklch(0.70 0.165 282) 30%, oklch(0.68 0.125 322) 70%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center gap-6"
        >
          {/* Pill badge */}
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border border-white/12 bg-white/5 text-muted-foreground backdrop-blur-sm">
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: 'oklch(0.68 0.125 322)' }}
              />
              Your personal wellness sanctuary
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            variants={fadeUp}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold text-white leading-tight"
          >
            Your mind deserves{' '}
            <em
              className="not-italic"
              style={{
                background:
                  'linear-gradient(135deg, oklch(0.78 0.130 280), oklch(0.72 0.130 322) 55%, oklch(0.72 0.090 200))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              a quiet place
            </em>{' '}
            to breathe.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={fadeUp}
            className="max-w-xl text-base sm:text-lg text-foreground/60 leading-relaxed"
          >
            Gently track your mood, reflect through journaling, and discover the patterns that shape your wellbeing — in a space that feels like yours.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center gap-3 mt-2"
          >
            <motion.a
              href="#mood"
              whileHover={{ scale: 1.04, boxShadow: '0 12px 40px oklch(0.50 0.185 282 / 0.45)' }}
              whileTap={{ scale: 0.97 }}
              className="group flex items-center gap-2 px-8 py-4 rounded-full font-medium text-sm bg-primary text-primary-foreground shadow-xl shadow-primary/30 transition-all duration-300"
            >
              Start Reflecting
              <ArrowRight
                size={15}
                className="group-hover:translate-x-1 transition-transform duration-200"
              />
            </motion.a>
            <motion.a
              href="#features"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-full text-sm font-medium text-foreground/70 border border-white/10 hover:border-white/20 hover:text-foreground hover:bg-white/4 transition-all duration-200 backdrop-blur-sm"
            >
              Explore Features
            </motion.a>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4"
          >
            {trustItems.map((item) => (
              <span
                key={item.label}
                className="flex items-center gap-1.5 text-xs text-foreground/45"
              >
                <span className="text-foreground/35">{item.icon}</span>
                {item.label}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="text-[10px] tracking-[0.15em] uppercase text-foreground/30 font-medium">
          scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-white/12 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-white/25" />
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade into next section */}
      <div
        className="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, var(--background))',
        }}
        aria-hidden="true"
      />
    </section>
  )
}
