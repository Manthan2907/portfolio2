'use client'

import { motion } from 'framer-motion'
import { Heart, PenLine, Wind, TrendingUp, AlertCircle, BookMarked } from 'lucide-react'

const features = [
  {
    icon: <Heart size={20} />,
    title: 'Mood Tracking',
    description:
      'Daily emotional check-ins that take under 30 seconds. Notice patterns without the pressure of performance.',
    color: 'oklch(0.65 0.115 322)',
    gradientFrom: 'oklch(0.65 0.115 322 / 0.15)',
    gradientTo: 'oklch(0.65 0.115 322 / 0.03)',
  },
  {
    icon: <PenLine size={20} />,
    title: 'Guided Journaling',
    description:
      'Thoughtful prompts when the blank page feels too empty. Or write freely — both are welcome.',
    color: 'oklch(0.70 0.165 282)',
    gradientFrom: 'oklch(0.70 0.165 282 / 0.15)',
    gradientTo: 'oklch(0.70 0.165 282 / 0.03)',
  },
  {
    icon: <Wind size={20} />,
    title: 'Breathing Exercises',
    description:
      'Guided breathing techniques grounded in science, designed to calm your nervous system in minutes.',
    color: 'oklch(0.68 0.090 200)',
    gradientFrom: 'oklch(0.68 0.090 200 / 0.15)',
    gradientTo: 'oklch(0.68 0.090 200 / 0.03)',
  },
  {
    icon: <TrendingUp size={20} />,
    title: 'Wellness Insights',
    description:
      'Gentle patterns revealed over time. No dashboards full of numbers — just soft, meaningful summaries.',
    color: 'oklch(0.72 0.095 160)',
    gradientFrom: 'oklch(0.72 0.095 160 / 0.15)',
    gradientTo: 'oklch(0.72 0.095 160 / 0.03)',
  },
  {
    icon: <AlertCircle size={20} />,
    title: 'Stress Awareness',
    description:
      'Understand your personal stress triggers and when they tend to surface — then respond with care.',
    color: 'oklch(0.66 0.095 60)',
    gradientFrom: 'oklch(0.66 0.095 60 / 0.15)',
    gradientTo: 'oklch(0.66 0.095 60 / 0.03)',
  },
  {
    icon: <BookMarked size={20} />,
    title: 'Supportive Resources',
    description:
      'Curated affirmations, exercises, and reading — gently surfaced when you might need them most.',
    color: 'oklch(0.68 0.120 300)',
    gradientFrom: 'oklch(0.68 0.120 300 / 0.15)',
    gradientTo: 'oklch(0.68 0.120 300 / 0.03)',
  },
]

const sectionVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const cardVariant = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative overflow-hidden py-24 sm:py-32 px-5 sm:px-8"
      aria-labelledby="features-heading"
    >
      {/* Subtle section background tint */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 100% 60% at 50% 100%, oklch(0.15 0.030 268) 0%, transparent 70%)',
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
            Everything you need
          </span>
          <h2
            id="features-heading"
            className="font-serif text-4xl sm:text-5xl text-foreground mt-3 text-balance"
          >
            Tending to your mind,{' '}
            <em
              className="not-italic"
              style={{
                background: 'linear-gradient(135deg, oklch(0.70 0.165 282), oklch(0.68 0.125 322))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              gently.
            </em>
          </h2>
          <p className="text-muted-foreground text-base mt-4 max-w-lg mx-auto">
            Six thoughtfully designed tools that work quietly in the background of your day.
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={cardVariant}
              whileHover={{ y: -5, scale: 1.01 }}
              className="glass-card rounded-3xl p-7 flex flex-col gap-5 group relative overflow-hidden"
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-7 right-7 h-px rounded-full"
                style={{ background: `linear-gradient(90deg, transparent, ${f.color}, transparent)` }}
                aria-hidden="true"
              />

              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${f.gradientFrom}, ${f.gradientTo})`,
                  border: `1px solid ${f.color.replace(')', ' / 0.25)')}`,
                }}
                aria-hidden="true"
              >
                <span style={{ color: f.color }}>{f.icon}</span>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="font-serif text-lg text-foreground/90 font-medium">{f.title}</h3>
                <p className="text-sm text-muted-foreground/70 leading-relaxed">{f.description}</p>
              </div>

              <button
                className="mt-auto text-xs font-medium transition-colors duration-200 text-left"
                style={{ color: `${f.color.replace(')', ' / 0.70)')}` }}
                aria-label={`Learn more about ${f.title}`}
              >
                Explore &rarr;
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
