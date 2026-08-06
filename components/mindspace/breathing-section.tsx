'use client'

import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Pause, Play } from 'lucide-react'

type Phase = 'idle' | 'inhale' | 'hold' | 'exhale'

const phases: { phase: Phase; label: string; instruction: string; duration: number }[] = [
  { phase: 'inhale', label: 'Breathe in', instruction: 'Slowly fill your lungs...', duration: 4 },
  { phase: 'hold', label: 'Hold', instruction: 'Hold softly...', duration: 7 },
  { phase: 'exhale', label: 'Breathe out', instruction: 'Let everything go...', duration: 8 },
]

const circleVariants: Variants = {
  idle: { scale: 0.75, opacity: 0.65 },
  inhale: {
    scale: 1.22,
    opacity: 1,
    transition: { duration: 4, ease: 'easeInOut' },
  },
  hold: {
    scale: 1.22,
    opacity: 1,
    transition: { duration: 7, ease: 'linear' },
  },
  exhale: {
    scale: 0.75,
    opacity: 0.65,
    transition: { duration: 8, ease: 'easeInOut' },
  },
}

export function BreathingSection() {
  const [isActive, setIsActive] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [currentPhase, setCurrentPhase] = useState<Phase>('idle')
  const [countdown, setCountdown] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!isActive) {
      setCurrentPhase('idle')
      setCountdown(0)
      if (timerRef.current) clearTimeout(timerRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    const runPhase = (idx: number) => {
      const p = phases[idx % phases.length]
      setCurrentPhase(p.phase)
      setCountdown(p.duration)

      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = setInterval(() => {
        setCountdown((c) => (c <= 1 ? 0 : c - 1))
      }, 1000)

      timerRef.current = setTimeout(() => {
        setPhaseIndex((prev) => {
          const next = (prev + 1) % phases.length
          runPhase(next)
          return next
        })
      }, p.duration * 1000)
    }

    runPhase(phaseIndex)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive])

  const activePhase = phases.find((p) => p.phase === currentPhase)

  return (
    <section
      id="breathing"
      className="relative overflow-hidden py-28 sm:py-36 px-5 sm:px-8"
      aria-labelledby="breathing-heading"
      style={{
        background:
          'radial-gradient(ellipse 120% 100% at 50% 50%, oklch(0.13 0.040 268) 0%, oklch(0.10 0.028 268) 100%)',
      }}
    >
      {/* Deep background orbs */}
      <div
        className="orb w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, oklch(0.50 0.185 282 / 0.50) 0%, transparent 65%)',
          // @ts-expect-error CSS custom property
          '--orb-duration': '15s',
        }}
        aria-hidden="true"
      />
      <div
        className="orb w-[300px] h-[300px] top-8 right-8 opacity-15 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, oklch(0.68 0.125 322 / 0.60) 0%, transparent 70%)',
          // @ts-expect-error CSS custom property
          '--orb-duration': '22s',
          '--orb-delay': '5s',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center text-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-60px' }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-xs tracking-widest uppercase text-primary/70 font-medium">
            Guided Breathing
          </span>
          <h2
            id="breathing-heading"
            className="font-serif text-4xl sm:text-5xl text-white"
          >
            Take a moment.{' '}
            <em
              className="not-italic"
              style={{
                background: 'linear-gradient(135deg, oklch(0.72 0.105 300), oklch(0.72 0.090 200))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Just breathe.
            </em>
          </h2>
          <p className="text-foreground/50 text-sm max-w-xs">
            The 4-7-8 technique calms your nervous system and brings you back to the present.
          </p>
        </motion.div>

        {/* Breathing circle */}
        <div className="relative flex items-center justify-center w-56 h-56">
          {/* Ripple rings */}
          {isActive && (currentPhase === 'inhale' || currentPhase === 'hold') && (
            <>
              <div
                className="absolute inset-0 rounded-full border border-primary/20"
                style={{ animation: 'ripple-out 3.5s ease-out infinite' }}
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 rounded-full border border-primary/10"
                style={{ animation: 'ripple-out 3.5s ease-out infinite 1.2s' }}
                aria-hidden="true"
              />
            </>
          )}

          {/* Outer glow ring */}
          <motion.div
            animate={currentPhase}
            variants={circleVariants}
            className="absolute w-48 h-48 rounded-full"
            style={{
              background:
                'radial-gradient(circle, oklch(0.50 0.185 282 / 0.25) 0%, oklch(0.68 0.125 322 / 0.10) 60%, transparent 100%)',
              boxShadow: isActive
                ? '0 0 60px 20px oklch(0.50 0.185 282 / 0.25), 0 0 120px 40px oklch(0.50 0.185 282 / 0.10)'
                : 'none',
            }}
            aria-hidden="true"
          />

          {/* Main breathing circle */}
          <motion.div
            animate={currentPhase}
            variants={circleVariants}
            className="relative w-36 h-36 rounded-full flex items-center justify-center"
            style={{
              background:
                'radial-gradient(circle, oklch(0.62 0.160 282) 0%, oklch(0.55 0.145 300) 50%, oklch(0.50 0.125 320) 100%)',
              boxShadow: '0 4px 40px oklch(0.50 0.185 282 / 0.40)',
            }}
            aria-hidden="true"
          >
            <div className="text-center">
              <AnimatePresence mode="wait">
                {isActive && countdown > 0 ? (
                  <motion.span
                    key={countdown}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.3 }}
                    transition={{ duration: 0.3 }}
                    className="text-3xl font-serif text-white font-medium"
                  >
                    {countdown}
                  </motion.span>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    className="w-4 h-4 rounded-full bg-white/50"
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Phase label */}
        <div className="flex flex-col items-center gap-1.5 h-12">
          <AnimatePresence mode="wait">
            {isActive && activePhase ? (
              <motion.div
                key={currentPhase}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-1"
              >
                <p className="text-base font-medium text-foreground/85">{activePhase.label}</p>
                <p className="text-xs text-foreground/45">{activePhase.instruction}</p>
              </motion.div>
            ) : (
              <motion.p
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-foreground/40"
              >
                Press start when you&apos;re ready
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Control button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsActive(!isActive)}
          aria-label={isActive ? 'Pause breathing exercise' : 'Start breathing exercise'}
          className="flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-medium border border-white/15 hover:border-white/25 bg-white/5 hover:bg-white/8 text-foreground/80 hover:text-foreground transition-all duration-200 backdrop-blur-sm"
        >
          {isActive ? (
            <>
              <Pause size={15} />
              Pause
            </>
          ) : (
            <>
              <Play size={15} />
              Begin exercise
            </>
          )}
        </motion.button>

        <p className="text-[11px] text-foreground/25 max-w-xs">
          Inhale 4s · Hold 7s · Exhale 8s — repeat as many cycles as feels right
        </p>
      </div>
    </section>
  )
}
