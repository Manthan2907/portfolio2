'use client'

import { motion } from 'framer-motion'
import { Wind, Moon, Coffee, Cloud } from 'lucide-react'

/* ── Semicircular gauge ── */
function StressGauge({ value }: { value: number }) {
  const r = 70
  const strokeW = 10
  const circ = Math.PI * r
  const offset = circ * (1 - value / 100)

  const getColor = (v: number) => {
    if (v < 35) return 'oklch(0.68 0.090 200)'
    if (v < 60) return 'oklch(0.76 0.095 60)'
    return 'oklch(0.65 0.115 322)'
  }
  const color = getColor(value)

  const label = value < 35 ? 'Low' : value < 60 ? 'Moderate' : 'Elevated'

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-48 h-28">
        <svg
          viewBox="0 0 160 90"
          className="w-full h-full overflow-visible"
          aria-label={`Stress level: ${label} at ${value} percent`}
        >
          <defs>
            <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="oklch(0.68 0.090 200)" />
              <stop offset="50%" stopColor="oklch(0.76 0.095 60)" />
              <stop offset="100%" stopColor="oklch(0.65 0.115 322)" />
            </linearGradient>
          </defs>
          {/* Track */}
          <path
            d="M 10 85 A 70 70 0 0 1 150 85"
            fill="none"
            stroke="currentColor"
            className="text-white/8"
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
          {/* Progress */}
          <path
            d="M 10 85 A 70 70 0 0 1 150 85"
            fill="none"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeDasharray={`${circ}`}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.5s ease, stroke 0.8s ease' }}
            opacity="0.9"
          />
          {/* Center label */}
          <text x="80" y="75" textAnchor="middle" className="fill-current" fontSize="22" fontWeight="600" style={{ fill: color }}>
            {value}
          </text>
          <text x="80" y="88" textAnchor="middle" fontSize="9" style={{ fill: 'oklch(0.62 0.038 265)' }}>
            {label}
          </text>
        </svg>
      </div>
      <p className="text-xs text-muted-foreground/50 text-center max-w-[180px]">
        Your stress level right now, based on your recent check-ins
      </p>
    </div>
  )
}

const suggestions = [
  {
    icon: <Wind size={15} />,
    title: 'Try a 2-min breath',
    description: 'A short breathing exercise can calm your nervous system noticeably.',
    color: 'oklch(0.70 0.165 282)',
  },
  {
    icon: <Moon size={15} />,
    title: 'Rest when you can',
    description: "Your body communicates through tension. It's okay to slow down.",
    color: 'oklch(0.68 0.145 280)',
  },
  {
    icon: <Coffee size={15} />,
    title: 'Limit stimulants',
    description: 'Afternoon caffeine can amplify stress responses. Water is your friend.',
    color: 'oklch(0.68 0.090 200)',
  },
]

const stressFactors = [
  { icon: <Moon size={12} />, label: 'Sleep', level: 65 },
  { icon: <Cloud size={12} />, label: 'Work', level: 80 },
  { icon: <Coffee size={12} />, label: 'Social', level: 40 },
  { icon: <Wind size={12} />, label: 'Weather', level: 30 },
]

const sectionVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const itemVariant = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

export function StressSection() {
  return (
    <section
      id="stress"
      className="relative overflow-hidden py-24 sm:py-32 px-5 sm:px-8"
      aria-labelledby="stress-heading"
    >
      <div
        className="orb w-[420px] h-[420px] bottom-0 left-0 opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, oklch(0.68 0.090 200 / 0.45) 0%, transparent 70%)',
          // @ts-expect-error CSS custom property
          '--orb-duration': '19s',
          '--orb-delay': '1s',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* Left: Text + suggestions */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-70px' }}
            className="flex flex-col gap-6"
          >
            <motion.div variants={itemVariant}>
              <span className="text-xs tracking-widest uppercase text-primary/70 font-medium">
                Stress Awareness
              </span>
              <h2
                id="stress-heading"
                className="font-serif text-4xl sm:text-5xl text-foreground mt-3 text-balance"
              >
                Awareness,{' '}
                <em
                  className="not-italic"
                  style={{
                    background: 'linear-gradient(135deg, oklch(0.68 0.090 200), oklch(0.70 0.165 282))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  not judgment.
                </em>
              </h2>
            </motion.div>

            <motion.p variants={itemVariant} className="text-muted-foreground leading-relaxed">
              Stress is a signal worth listening to. MindSpace helps you notice it early and respond with gentleness — not force.
            </motion.p>

            {/* Factors this week */}
            <motion.div variants={itemVariant} className="glass-card rounded-2xl p-5">
              <p className="text-xs text-muted-foreground/50 font-medium mb-4 uppercase tracking-widest">
                Factors this week
              </p>
              <div className="flex flex-col gap-3">
                {stressFactors.map((f) => (
                  <div key={f.label} className="flex items-center gap-3">
                    <div className="flex items-center gap-2 w-20">
                      <span className="text-muted-foreground/50">{f.icon}</span>
                      <span className="text-xs text-muted-foreground/70">{f.label}</span>
                    </div>
                    <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${f.level}%` }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.3 }}
                        viewport={{ once: true }}
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, oklch(0.68 0.090 200), oklch(0.65 0.115 322))`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground/40 w-8 text-right">{f.level}%</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Suggestions */}
            <motion.div variants={sectionVariants} className="flex flex-col gap-3">
              {suggestions.map((s) => (
                <motion.div
                  key={s.title}
                  variants={itemVariant}
                  whileHover={{ x: 3 }}
                  className="glass-card rounded-2xl px-5 py-4 flex items-start gap-4"
                >
                  <div
                    className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center mt-0.5"
                    style={{ background: `${s.color.replace(')', ' / 0.12)')}` }}
                    aria-hidden="true"
                  >
                    <span style={{ color: s.color }}>{s.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground/85">{s.title}</p>
                    <p className="text-xs text-muted-foreground/60 mt-0.5 leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Gauge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.15 }}
            viewport={{ once: true, margin: '-60px' }}
            className="flex flex-col items-center gap-6"
          >
            <div className="glass-card rounded-3xl p-10 flex flex-col items-center gap-8 w-full max-w-sm mx-auto">
              <div>
                <p className="text-xs text-muted-foreground/50 text-center uppercase tracking-widest mb-1">
                  Current stress level
                </p>
              </div>
              <StressGauge value={42} />

              <div className="w-full border-t border-white/8 pt-5">
                <div
                  className="rounded-2xl px-4 py-3 text-center"
                  style={{ background: 'oklch(0.68 0.090 200 / 0.10)', border: '1px solid oklch(0.68 0.090 200 / 0.20)' }}
                >
                  <p className="text-sm text-foreground/80 font-medium">You seem relatively calm today</p>
                  <p className="text-xs text-muted-foreground/55 mt-1">
                    Your stress is in a manageable range. Keep going.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground/35 text-center max-w-xs">
              Stress levels are estimated from your mood check-ins and journaling patterns — not clinical measurements.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
