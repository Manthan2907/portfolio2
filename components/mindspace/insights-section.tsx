'use client'

import { motion } from 'framer-motion'
import { TrendingUp, BookOpen, BarChart2, Sparkles } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { useAuthStore } from '@/store/authStore'
import { moodService, firestoreService, type MoodEntry, type JournalEntry } from '@/lib/firestoreService'

// ── Mini SVG sparkline ─────────────────────────────────────────────────────────
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
        <linearGradient id={`sg-${color.replace(/[^a-z0-9]/gi, '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${color.replace(/[^a-z0-9]/gi, '')})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="3" fill={color} />
    </svg>
  )
}

// ── Circular progress ─────────────────────────────────────────────────────────
function CircleProgress({ value, max = 10, color }: { value: number; max?: number; color: string }) {
  const r = 26
  const circ = 2 * Math.PI * r
  const stroke = circ * (1 - Math.min(value, max) / max)
  return (
    <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90" aria-hidden="true">
      <circle cx="32" cy="32" r={r} fill="none" stroke="currentColor" strokeWidth="4" className="text-white/8" />
      <circle
        cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={`${circ}`}
        strokeDashoffset={stroke}
        style={{ transition: 'stroke-dashoffset 1.2s ease' }}
      />
    </svg>
  )
}

// ── Mini bar chart ─────────────────────────────────────────────────────────────
function BarChart({ values, colors }: { values: number[]; colors: string[] }) {
  const max = Math.max(...values, 1)
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

const moodToValue: Record<string, number> = {
  joyful: 90, hopeful: 75, peaceful: 65, numb: 50, anxious: 35, heavy: 20,
}

const moodColor: Record<string, string> = {
  peaceful: 'oklch(0.68 0.145 280)',
  anxious: 'oklch(0.66 0.095 50)',
  joyful: 'oklch(0.78 0.120 50)',
  heavy: 'oklch(0.55 0.080 300)',
  hopeful: 'oklch(0.65 0.115 322)',
  numb: 'oklch(0.55 0.025 270)',
}

const sectionVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const cardVariant = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

const weekDayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

/** Map entries to 7 day slots (0=6 days ago … 6=today) */
function buildWeekSlots(entries: (MoodEntry & { id: string })[]): Array<{ color: string; label: string } | null> {
  const slots: Array<{ color: string; label: string } | null> = Array(7).fill(null)
  const today = new Date()
  entries.forEach((e) => {
    if (!e.createdAt) return
    const daysAgo = Math.round((today.getTime() - new Date(e.createdAt).getTime()) / 86400000)
    const slot = 6 - Math.min(daysAgo, 6)
    slots[slot] = { color: moodColor[e.moodId] ?? 'oklch(0.50 0.040 265)', label: e.moodLabel ?? e.moodId }
  })
  return slots
}

/** Compute journal streak (consecutive days with at least one entry, backwards from today) */
function computeStreak(entries: (JournalEntry & { id: string })[]): number {
  if (!entries.length) return 0
  const daySet = new Set<string>()
  entries.forEach((e) => {
    if (e.createdAt) daySet.add(new Date(e.createdAt).toDateString())
  })
  let streak = 0
  const d = new Date()
  while (daySet.has(d.toDateString())) {
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
}

export function InsightsSection() {
  const { user } = useAuthStore()
  const [moodEntries, setMoodEntries] = useState<(MoodEntry & { id: string })[]>([])
  const [journalEntries, setJournalEntries] = useState<(JournalEntry & { id: string })[]>([])

  // Subscribe to 7-day mood + up to 30 journal entries
  useEffect(() => {
    if (!user) return
    const unsubMood = moodService.subscribe(user.uid, 7, setMoodEntries)
    const unsubJournal = firestoreService.subscribeToUserDocuments(
      'journals', user.uid,
      (docs) => setJournalEntries(docs as unknown as (JournalEntry & { id: string })[]),
      30
    )
    return () => { unsubMood(); unsubJournal() }
  }, [user])

  const weekSlots = useMemo(() => buildWeekSlots(moodEntries), [moodEntries])
  const streak = useMemo(() => computeStreak(journalEntries), [journalEntries])

  // Build sparkline values from mood entries (slot-by-slot)
  const moodSparkline = useMemo(() =>
    weekSlots.map((s) => s ? (moodToValue[Object.entries(moodColor).find(([, c]) => c === s.color)?.[0] ?? ''] ?? 50) : 50),
    [weekSlots]
  )

  // Stress bar chart: days ordered M-Su, values from mood inverse
  const stressBarValues = useMemo(() =>
    weekSlots.map((s) => {
      if (!s) return 30
      const val = moodToValue[Object.entries(moodColor).find(([, c]) => c === s.color)?.[0] ?? ''] ?? 50
      return 100 - val
    }),
    [weekSlots]
  )

  const latestMoodSummary = useMemo(() => {
    if (!moodEntries.length) return "You haven't logged any moods yet this week."
    const recent = [...moodEntries].sort((a, b) => (b.createdAt ?? '') > (a.createdAt ?? '') ? 1 : -1)
    return `Your most recent mood was ${recent[0].moodLabel}.`
  }, [moodEntries])

  const moodTrend = useMemo(() => {
    if (moodEntries.length < 2) return 'Not enough data yet'
    const vals = moodEntries.map((e) => moodToValue[e.moodId] ?? 50)
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length
    return avg >= 60 ? 'Positive trend' : avg >= 45 ? 'Steady trend' : 'Worth checking in'
  }, [moodEntries])

  const insightCards = [
    {
      icon: <TrendingUp size={16} />,
      label: 'Mood Trends',
      summary: latestMoodSummary,
      detail: moodEntries.length ? 'Based on your check-ins this week.' : 'Log your first mood above to start tracking.',
      color: 'oklch(0.68 0.145 280)',
      visual: <Sparkline values={moodSparkline} color="oklch(0.68 0.145 280)" />,
    },
    {
      icon: <BookOpen size={16} />,
      label: 'Journal Streak',
      summary: streak > 0 ? `${streak} consecutive reflection${streak !== 1 ? 's' : ''}` : 'Start your streak today',
      detail: streak > 0 ? "You've been showing up for yourself consistently." : 'Write your first entry to begin your streak.',
      color: 'oklch(0.65 0.115 322)',
      visual: (
        <div className="flex items-center gap-3">
          <CircleProgress value={streak} max={10} color="oklch(0.65 0.115 322)" />
          <div>
            <p className="text-2xl font-serif text-foreground font-semibold">{streak}</p>
            <p className="text-xs text-muted-foreground/60">day streak</p>
          </div>
        </div>
      ),
    },
    {
      icon: <BarChart2 size={16} />,
      label: 'Stress Awareness',
      summary: moodEntries.length ? 'Based on your mood patterns' : 'No data yet this week',
      detail: "Awareness is the first step. You're already doing the work.",
      color: 'oklch(0.68 0.090 200)',
      visual: (
        <BarChart
          values={stressBarValues}
          colors={stressBarValues.map((v) =>
            v > 65 ? 'oklch(0.65 0.115 322)' : 'oklch(0.68 0.090 200)'
          )}
        />
      ),
    },
  ]

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
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
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
            {user
              ? 'Soft patterns, no pressure. A gentle reflection of how you have been moving through your days.'
              : 'Sign in to see your personal wellness insights and patterns.'}
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
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: `${card.color.replace(')', ' / 0.15)')}` }}
                >
                  <span style={{ color: card.color }}>{card.icon}</span>
                </div>
                <span className="text-sm font-medium text-foreground/80">{card.label}</span>
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
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          viewport={{ once: true, margin: '-40px' }}
          className="glass-card rounded-3xl p-7 sm:p-9"
        >
          <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
            <div>
              <p className="text-xs text-muted-foreground/50 font-medium uppercase tracking-widest">
                Weekly Summary
              </p>
              <p className="font-serif text-xl sm:text-2xl text-foreground mt-1">
                {moodEntries.length ? 'Your week at a glance' : 'No check-ins logged yet'}
              </p>
            </div>
            {moodEntries.length > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles size={12} className="text-primary" />
                <span className="text-xs text-primary font-medium">{moodTrend}</span>
              </div>
            )}
          </div>

          {/* Day-by-day mood dots */}
          <div className="grid grid-cols-7 gap-2" role="list" aria-label="Mood for each day of the week">
            {weekDayLabels.map((day, i) => {
              const slot = weekSlots[i]
              const bg = slot
                ? `${slot.color.replace(')', ' / 0.18)')}`
                : 'oklch(0.55 0.030 265 / 0.12)'
              const border = slot
                ? `1px solid ${slot.color.replace(')', ' / 0.30)')}`
                : '1px solid oklch(0.55 0.030 265 / 0.18)'
              return (
                <div key={i} className="flex flex-col items-center gap-2" role="listitem">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.06, type: 'spring', stiffness: 200 }}
                    viewport={{ once: true }}
                    className="w-full aspect-square rounded-2xl flex items-center justify-center"
                    style={{ background: bg, border }}
                    title={slot?.label ?? 'No entry'}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: slot?.color ?? 'oklch(0.55 0.030 265 / 0.35)' }}
                      aria-label={slot?.label ?? 'No entry'}
                    />
                  </motion.div>
                  <span className="text-[10px] text-muted-foreground/45 font-medium">{day}</span>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-5 flex flex-wrap gap-3">
            {Object.entries(moodColor).map(([label, color]) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: color }} aria-hidden="true" />
                <span className="text-[11px] text-muted-foreground/50 capitalize">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
