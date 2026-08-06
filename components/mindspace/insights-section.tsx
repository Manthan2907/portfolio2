'use client'

import { motion } from 'framer-motion'
import { TrendingUp, BookOpen, BarChart2, Sparkles } from 'lucide-react'

/* ── Mini SVG sparkline ── */
function Sparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const w = 120
  const h = 36
  const pts = values.map((v, i) => ({
    x: (i / (values.length - 1)) * w,
    y: h - ((v - min) / range) * h,
  }))
  const d = pts.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`
    const prev = pts[i - 1]
    const cx = (prev.x + pt.x) / 2
    return `${acc} C ${cx} ${prev.y} ${cx} ${pt.y} ${pt.x} ${pt.y}`
  }, '')
  const area = `${d} L ${w} ${h} L 0 ${h} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-9" aria-hidden="true">
      <defs>
        <linearGradient id={`sg-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${color})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="3" fill={color} />
    </svg>
  )
}

/* ── Circular progress ── */
function CircleProgress({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  const r = 26
  const circ = 2 * Math.PI * r
  const stroke = circ * (1 - value / max)
  return (
    <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90" aria-hidden="true">
      <circle cx="32" cy="32" r={r} fill="none" stroke="currentColor" strokeWidth="4" className="text-white/8" />
      <circle
        cx="32"
        cy="32"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={`${circ}`}
        strokeDashoffset={stroke}
        style={{ transition: 'stroke-dashoffset 1.2s ease' }}
      />
    </svg>
  )
}

/* ── Mini bar chart ── */
function BarChart({ values, colors }: { values: number[]; colors: string[] }) {
  const max = Math.max(...values)
  return (
    <div className="flex items-end gap-1 h-10" aria-hidden="true">
      {values.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-full transition-all duration-700"
          style={{
            height: `${(v / max) * 100}%`,
            background: colors[i] ?? colors[0],
            opacity: 0.75 + (i / values.length) * 0.25,
          }}
        />
      ))}
    </div>
  )
}

const insightCards = [
  {
    icon: <TrendingUp size={16} />,
    label: 'Mood Trends',
    summary: 'This week you\'ve been mostly calm',
    detail: 'Your mood has been trending upward since Wednesday.',
    color: 'oklch(0.68 0.145 280)',
    visual: (
      <Sparkline
        values={[42, 50, 45, 62, 70, 66, 75]}
        color="oklch(0.68 0.145 280)"
      />
    ),
  },
  {
    icon: <BookOpen size={16} />,
    label: 'Journal Streak',
    summary: '7 consecutive reflections',
    detail: 'You\'ve written every day this week. Beautiful consistency.',
    color: 'oklch(0.65 0.115 322)',
    visual: (
      <div className="flex items-center gap-3">
        <CircleProgress value={7} max={10} color="oklch(0.65 0.115 322)" />
        <div>
          <p className="text-2xl font-serif text-foreground font-semibold">7</p>
          <p className="text-xs text-muted-foreground/60">day streak</p>
        </div>
      </div>
    ),
  },
  {
    icon: <BarChart2 size={16} />,
    label: 'Stress Awareness',
    summary: 'Stress peaks on Sunday evenings',
    detail: 'Awareness is the first step. You\'re already doing the work.',
    color: 'oklch(0.68 0.090 200)',
    visual: (
      <BarChart
        values={[30, 45, 40, 50, 38, 42, 65]}
        colors={[
          'oklch(0.68 0.090 200)',
          'oklch(0.68 0.090 200)',
          'oklch(0.68 0.090 200)',
          'oklch(0.68 0.090 200)',
          'oklch(0.68 0.090 200)',
          'oklch(0.68 0.090 200)',
          'oklch(0.65 0.115 322)',
        ]}
      />
    ),
  },
]

const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const weekMoods = [
  { color: 'oklch(0.68 0.090 200)', label: 'Calm' },
  { color: 'oklch(0.68 0.090 200)', label: 'Calm' },
  { color: 'oklch(0.65 0.115 322)', label: 'Hopeful' },
  { color: 'oklch(0.68 0.145 280)', label: 'Peaceful' },
  { color: 'oklch(0.68 0.145 280)', label: 'Peaceful' },
  { color: 'oklch(0.66 0.095 50)', label: 'Anxious' },
  { color: 'oklch(0.65 0.115 322)', label: 'Hopeful' },
]

const sectionVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const cardVariant = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}

export function InsightsSection() {
  return (
    <section
      id="insights"
      className="relative overflow-hidden py-24 sm:py-32 px-5 sm:px-8"
      aria-labelledby="insights-heading"
    >
      <div
        className="orb w-[450px] h-[450px] -top-20 -right-24 opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, oklch(0.70 0.165 282 / 0.50) 0%, transparent 70%)',
          // @ts-expect-error CSS custom property
          '--orb-duration': '17s',
          '--orb-delay': '2s',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: '-60px' }}
          className="text-center mb-14"
        >
          <span className="text-xs tracking-widest uppercase text-primary/70 font-medium">
            Wellness Insights
          </span>
          <h2
            id="insights-heading"
            className="font-serif text-4xl sm:text-5xl text-foreground mt-3 text-balance"
          >
            Your emotional landscape,{' '}
            <em
              className="not-italic"
              style={{
                background: 'linear-gradient(135deg, oklch(0.70 0.165 282), oklch(0.68 0.090 200))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              gently revealed.
            </em>
          </h2>
          <p className="text-muted-foreground text-base mt-4 max-w-lg mx-auto">
            Soft patterns, no pressure. Just a gentle reflection of how you&apos;ve been moving through your days.
          </p>
        </motion.div>

        {/* 3 insight cards */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
        >
          {insightCards.map((card) => (
            <motion.div
              key={card.label}
              variants={cardVariant}
              whileHover={{ y: -4, scale: 1.01 }}
              className="glass-card rounded-3xl p-6 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: `${card.color.replace(')', ' / 0.15)')}` }}
                  >
                    <span style={{ color: card.color }}>{card.icon}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground/80">{card.label}</span>
                </div>
              </div>

              <div>{card.visual}</div>

              <div className="border-t border-white/8 pt-3">
                <p className="text-sm font-medium text-foreground/85">{card.summary}</p>
                <p className="text-xs text-muted-foreground/60 mt-1 leading-relaxed">{card.detail}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Weekly emotional summary */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: '-40px' }}
          className="glass-card rounded-3xl p-7 sm:p-9"
        >
          <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
            <div>
              <p className="text-xs text-muted-foreground/50 font-medium uppercase tracking-widest">
                Weekly Summary
              </p>
              <p className="font-serif text-xl sm:text-2xl text-foreground mt-1">
                A week of quiet growth
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles size={12} className="text-primary" />
              <span className="text-xs text-primary font-medium">Positive trend</span>
            </div>
          </div>

          {/* Day-by-day mood dots */}
          <div
            className="grid grid-cols-7 gap-2"
            role="list"
            aria-label="Mood for each day of the week"
          >
            {weekDays.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-2" role="listitem">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.06, type: 'spring', stiffness: 200 }}
                  viewport={{ once: true }}
                  className="w-full aspect-square rounded-2xl flex items-center justify-center"
                  style={{
                    background: `${weekMoods[i].color.replace(')', ' / 0.18)')}`,
                    border: `1px solid ${weekMoods[i].color.replace(')', ' / 0.30)')}`,
                  }}
                  title={weekMoods[i].label}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: weekMoods[i].color }}
                    aria-label={weekMoods[i].label}
                  />
                </motion.div>
                <span className="text-[10px] text-muted-foreground/45 font-medium">{day}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {[
              { color: 'oklch(0.68 0.145 280)', label: 'Peaceful' },
              { color: 'oklch(0.68 0.090 200)', label: 'Calm' },
              { color: 'oklch(0.65 0.115 322)', label: 'Hopeful' },
              { color: 'oklch(0.66 0.095 50)', label: 'Anxious' },
            ].map((m) => (
              <div key={m.label} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: m.color }} aria-hidden="true" />
                <span className="text-[11px] text-muted-foreground/50">{m.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
