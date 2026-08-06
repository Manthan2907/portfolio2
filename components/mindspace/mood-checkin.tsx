'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const moods = [
  {
    id: 'peaceful',
    label: 'Peaceful',
    gradient: 'linear-gradient(135deg, oklch(0.70 0.090 200), oklch(0.75 0.080 230))',
    glow: 'oklch(0.70 0.090 200 / 0.4)',
    reflection: "That stillness you feel? It's worth honouring. Take a breath and let it settle deeper.",
    arc: [30, 28, 32, 25, 22, 20, 18],
  },
  {
    id: 'anxious',
    label: 'Anxious',
    gradient: 'linear-gradient(135deg, oklch(0.66 0.095 50), oklch(0.72 0.100 70))',
    glow: 'oklch(0.72 0.095 50 / 0.4)',
    reflection: "Anxiety is a signal, not a verdict. You're aware of it — that already takes courage.",
    arc: [20, 35, 45, 50, 55, 48, 60],
  },
  {
    id: 'joyful',
    label: 'Joyful',
    gradient: 'linear-gradient(135deg, oklch(0.78 0.120 50), oklch(0.80 0.095 80))',
    glow: 'oklch(0.78 0.120 50 / 0.4)',
    reflection: 'Joy is your natural state. Notice what brought you here — and remember it.',
    arc: [40, 50, 60, 75, 82, 88, 90],
  },
  {
    id: 'heavy',
    label: 'Heavy',
    gradient: 'linear-gradient(135deg, oklch(0.42 0.060 270), oklch(0.48 0.080 300))',
    glow: 'oklch(0.48 0.080 300 / 0.4)',
    reflection: "Heavy days are real days. You don't have to carry this alone — you're here, and that matters.",
    arc: [60, 58, 55, 52, 50, 48, 45],
  },
  {
    id: 'hopeful',
    label: 'Hopeful',
    gradient: 'linear-gradient(135deg, oklch(0.68 0.125 322), oklch(0.72 0.110 280))',
    glow: 'oklch(0.68 0.125 322 / 0.4)',
    reflection: "Hope is a practice. You're already doing it.",
    arc: [35, 38, 42, 50, 60, 68, 75],
  },
  {
    id: 'numb',
    label: 'Numb',
    gradient: 'linear-gradient(135deg, oklch(0.50 0.025 270), oklch(0.55 0.030 250))',
    glow: 'oklch(0.50 0.025 270 / 0.4)',
    reflection: "Feeling nothing is still feeling something. This space is here whenever you're ready.",
    arc: [50, 49, 48, 50, 48, 49, 50],
  },
]

const sectionVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const itemVariant = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

function MoodArc({ values, color }: { values: number[]; color: string }) {
  const max = 100
  const w = 260
  const h = 60
  const pts = values.map((v, i) => ({
    x: (i / (values.length - 1)) * w,
    y: h - (v / max) * h,
  }))
  const pathD = pts.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`
    const prev = pts[i - 1]
    const cx = (prev.x + pt.x) / 2
    return `${acc} C ${cx} ${prev.y} ${cx} ${pt.y} ${pt.x} ${pt.y}`
  }, '')

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full h-10 overflow-visible"
      aria-hidden="true"
    >
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="3.5" fill={color} opacity="0.9" />
    </svg>
  )
}

export function MoodCheckin() {
  const [selected, setSelected] = useState<string | null>(null)
  const activeMood = moods.find((m) => m.id === selected) ?? null

  return (
    <section
      id="mood"
      className="relative overflow-hidden py-24 sm:py-32 px-5 sm:px-8"
      aria-labelledby="mood-heading"
    >
      {/* Section orb */}
      <div
        className="orb w-[400px] h-[400px] -top-20 right-0 opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, oklch(0.68 0.125 322 / 0.35) 0%, transparent 70%)',
          // @ts-expect-error CSS custom property
          '--orb-duration': '18s',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="flex flex-col items-center text-center gap-3 mb-14"
        >
          <motion.span
            variants={itemVariant}
            className="text-xs tracking-widest uppercase text-primary/70 font-medium"
          >
            Daily Check-in
          </motion.span>
          <motion.h2
            variants={itemVariant}
            id="mood-heading"
            className="font-serif text-4xl sm:text-5xl text-foreground text-balance"
          >
            How are you feeling{' '}
            <em
              className="not-italic"
              style={{
                background: 'linear-gradient(135deg, oklch(0.70 0.165 282), oklch(0.68 0.125 322))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              right now?
            </em>
          </motion.h2>
          <motion.p
            variants={itemVariant}
            className="text-muted-foreground text-base max-w-md text-balance"
          >
            No right or wrong answers. Just a gentle check-in with yourself.
          </motion.p>
        </motion.div>

        {/* Mood chips */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="flex flex-wrap justify-center gap-3 mb-10"
          role="group"
          aria-label="Select your current mood"
        >
          {moods.map((mood) => (
            <motion.button
              key={mood.id}
              variants={itemVariant}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelected(selected === mood.id ? null : mood.id)}
              aria-pressed={selected === mood.id}
              className="relative px-6 py-3 rounded-full text-sm font-medium text-white transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary"
              style={{
                background: mood.gradient,
                boxShadow:
                  selected === mood.id
                    ? `0 0 0 2px white, 0 0 28px 6px ${mood.glow}, 0 4px 16px ${mood.glow}`
                    : `0 2px 12px ${mood.glow}`,
              }}
            >
              {mood.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Reflection panel */}
        <AnimatePresence mode="wait">
          {activeMood && (
            <motion.div
              key={activeMood.id}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card rounded-3xl p-7 sm:p-10 max-w-2xl mx-auto"
            >
              <div className="flex flex-col sm:flex-row gap-8 items-start">
                <div className="flex-1 flex flex-col gap-4">
                  <p className="font-serif text-xl sm:text-2xl text-foreground/90 leading-snug italic">
                    &ldquo;{activeMood.reflection}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <div
                      className="w-7 h-7 rounded-full flex-shrink-0"
                      style={{ background: activeMood.gradient }}
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        You selected{' '}
                        <span className="text-foreground font-medium">{activeMood.label}</span>
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-0.5">
                        {new Date().toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mini mood arc */}
                <div className="w-full sm:w-48 flex-shrink-0">
                  <p className="text-xs text-muted-foreground mb-2">This week&apos;s arc</p>
                  <MoodArc
                    values={activeMood.arc}
                    color={`oklch(0.72 0.130 ${activeMood.id === 'peaceful' ? '200' : activeMood.id === 'joyful' ? '60' : '300'})`}
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground/50 mt-1">
                    <span>Mon</span>
                    <span>Today</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-white/8 flex flex-col sm:flex-row items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-5 py-2.5 rounded-full text-sm font-medium bg-primary text-primary-foreground shadow-md shadow-primary/25"
                >
                  Save check-in
                </motion.button>
                <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Add a reflection note
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!selected && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-xs text-muted-foreground/50 mt-6"
          >
            Select a mood above to see your reflection
          </motion.p>
        )}
      </div>
    </section>
  )
}
