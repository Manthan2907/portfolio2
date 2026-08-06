'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { BookOpen, PenLine, Clock, ChevronRight } from 'lucide-react'
import { useRef, useState } from 'react'

const recentEntries = [
  {
    date: 'Yesterday',
    time: '9:14 pm',
    mood: 'Hopeful',
    moodColor: 'oklch(0.68 0.125 322)',
    preview:
      "I noticed that when I paused this afternoon instead of rushing, the whole rest of the day felt easier. Maybe slow is actually fast...",
  },
  {
    date: 'Monday',
    time: '7:52 am',
    mood: 'Peaceful',
    moodColor: 'oklch(0.70 0.090 200)',
    preview:
      "The morning light came in differently today. I sat with my coffee and just... let myself be still. No phone. Just light and warmth.",
  },
]

const sectionVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}

const itemVariant = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

export function JournalSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [currentText, setCurrentText] = useState('')
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const quoteY = useTransform(scrollYProgress, [0, 1], [30, -30])

  return (
    <section
      id="journal"
      ref={sectionRef}
      className="relative overflow-hidden py-24 sm:py-32 px-5 sm:px-8"
      aria-labelledby="journal-heading"
    >
      {/* Section backdrop orb */}
      <div
        className="orb w-[500px] h-[500px] -bottom-24 -left-24 opacity-25 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, oklch(0.60 0.185 282 / 0.35) 0%, transparent 70%)',
          // @ts-expect-error CSS custom property
          '--orb-duration': '20s',
          '--orb-delay': '3s',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: Editorial quote */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="flex flex-col gap-6"
          >
            <motion.span
              variants={itemVariant}
              className="text-xs tracking-widest uppercase text-primary/70 font-medium"
            >
              Journaling
            </motion.span>

            <motion.div variants={itemVariant} style={{ y: quoteY }}>
              <h2
                id="journal-heading"
                className="font-serif text-4xl sm:text-5xl lg:text-[3.2rem] text-foreground leading-tight"
              >
                Some days, the most important thing is to just{' '}
                <em
                  className="not-italic"
                  style={{
                    background: 'linear-gradient(135deg, oklch(0.70 0.165 282), oklch(0.68 0.125 322))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  write it down.
                </em>
              </h2>
            </motion.div>

            <motion.p
              variants={itemVariant}
              className="text-muted-foreground text-base leading-relaxed max-w-md"
            >
              Your journal is a private place where nothing needs to be perfect. Write freely — about your day, your fears, your small victories. It&apos;s all welcome here.
            </motion.p>

            <motion.div variants={itemVariant} className="flex flex-col gap-3">
              {[
                { icon: <PenLine size={15} />, text: 'Guided reflection prompts' },
                { icon: <BookOpen size={15} />, text: 'Private, encrypted entries' },
                { icon: <Clock size={15} />, text: 'Review past entries anytime' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="text-primary/60">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </motion.div>

            <motion.div variants={itemVariant} className="flex items-center gap-4 mt-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-primary text-primary-foreground shadow-lg shadow-primary/25"
              >
                Open Journal
                <ChevronRight
                  size={14}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </motion.button>
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                View past entries
              </button>
            </motion.div>
          </motion.div>

          {/* Right: Journal card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.15 }}
            viewport={{ once: true, margin: '-60px' }}
            className="relative"
          >
            {/* Floating ambient orb behind card */}
            <div
              className="absolute -inset-8 rounded-3xl pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 80% 80% at 50% 50%, oklch(0.50 0.185 282 / 0.12) 0%, transparent 70%)',
              }}
              aria-hidden="true"
            />

            {/* Active entry card */}
            <div className="glass-card rounded-3xl p-7 sm:p-8 relative">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs text-muted-foreground/60 font-medium">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-foreground/75 font-medium mt-0.5">Today&apos;s reflection</p>
                </div>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'oklch(0.68 0.125 322 / 0.15)' }}
                >
                  <PenLine size={14} className="text-accent" />
                </div>
              </div>

              <textarea
                value={currentText}
                onChange={(e) => setCurrentText(e.target.value)}
                placeholder="What&apos;s on your mind today? Begin anywhere..."
                aria-label="Journal entry text area"
                rows={5}
                className="w-full bg-transparent border-none outline-none resize-none text-sm text-foreground/80 placeholder:text-muted-foreground/40 leading-relaxed font-sans"
              />

              <div className="mt-4 pt-4 border-t border-white/8 flex items-center justify-between">
                <span className="text-xs text-muted-foreground/40">
                  {currentText.length > 0
                    ? `${currentText.split(/\s+/).filter(Boolean).length} words`
                    : 'Start writing...'}
                </span>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="px-4 py-1.5 rounded-full text-xs font-medium bg-primary/15 text-primary hover:bg-primary/25 transition-colors"
                >
                  Save entry
                </motion.button>
              </div>
            </div>

            {/* Recent entries */}
            <div className="mt-4 flex flex-col gap-3">
              <p className="text-xs text-muted-foreground/50 px-1 font-medium">Recent entries</p>
              {recentEntries.map((entry, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.01, x: 2 }}
                  className="glass-card rounded-2xl px-5 py-4 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: entry.moodColor }}
                        aria-hidden="true"
                      />
                      <span className="text-xs font-medium text-foreground/70">{entry.mood}</span>
                    </div>
                    <span className="text-xs text-muted-foreground/40">
                      {entry.date} · {entry.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground/65 leading-relaxed line-clamp-2">
                    {entry.preview}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
