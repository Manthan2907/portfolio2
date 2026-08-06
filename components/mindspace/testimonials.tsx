'use client'

import { motion } from 'framer-motion'

const testimonials = [
  {
    quote:
      "I never thought I'd be someone who journals, but MindSpace made it feel safe rather than performative. I look forward to my evening check-in now.",
    name: 'Maya R.',
    since: 'Member since spring 2024',
    initials: 'MR',
    gradient: 'linear-gradient(135deg, oklch(0.68 0.125 322), oklch(0.70 0.165 282))',
    mood: 'Hopeful',
    moodColor: 'oklch(0.68 0.125 322)',
  },
  {
    quote:
      "The breathing exercise alone changed my mornings. I used to spiral before work. Now I take three minutes with MindSpace and I actually feel ready.",
    name: 'Daniel K.',
    since: 'Member since summer 2023',
    initials: 'DK',
    gradient: 'linear-gradient(135deg, oklch(0.70 0.165 282), oklch(0.68 0.090 200))',
    mood: 'Calm',
    moodColor: 'oklch(0.68 0.090 200)',
  },
  {
    quote:
      "What I love most is that it never tells me how I should feel. It just reflects things back. That absence of judgment made all the difference.",
    name: 'Priya S.',
    since: 'Member since winter 2024',
    initials: 'PS',
    gradient: 'linear-gradient(135deg, oklch(0.68 0.090 200), oklch(0.72 0.095 160))',
    mood: 'Peaceful',
    moodColor: 'oklch(0.72 0.095 160)',
  },
]

const sectionVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const cardVariant = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative overflow-hidden py-24 sm:py-32 px-5 sm:px-8"
      aria-labelledby="testimonials-heading"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, oklch(0.14 0.035 268) 0%, transparent 80%)',
        }}
        aria-hidden="true"
      />
      <div
        className="orb w-[350px] h-[350px] -top-10 left-0 opacity-15 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, oklch(0.68 0.125 322 / 0.50) 0%, transparent 70%)',
          // @ts-expect-error CSS custom property
          '--orb-duration': '21s',
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
            The Community
          </span>
          <h2
            id="testimonials-heading"
            className="font-serif text-4xl sm:text-5xl text-foreground mt-3 text-balance"
          >
            Voices from the{' '}
            <em
              className="not-italic"
              style={{
                background: 'linear-gradient(135deg, oklch(0.68 0.125 322), oklch(0.70 0.165 282))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              MindSpace community
            </em>
          </h2>
          <p className="text-muted-foreground text-sm mt-4 max-w-sm mx-auto">
            Names changed for privacy. Real experiences, shared with permission.
          </p>
        </motion.div>

        {/* Testimonial cards */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={cardVariant}
              whileHover={{ y: -4 }}
              className="glass-card rounded-3xl p-7 flex flex-col gap-6"
            >
              {/* Quote mark */}
              <svg
                width="28"
                height="22"
                viewBox="0 0 28 22"
                fill="none"
                aria-hidden="true"
                className="opacity-30"
              >
                <path
                  d="M0 22V13.2C0 9.6 0.8 6.6 2.4 4.2C4 1.8 6.4 0.4 9.6 0L11.2 2.4C8.8 3.2 7.2 4.4 6.4 6C5.6 7.6 5.2 9.2 5.2 10.8H10.4V22H0ZM16.8 22V13.2C16.8 9.6 17.6 6.6 19.2 4.2C20.8 1.8 23.2 0.4 26.4 0L28 2.4C25.6 3.2 24 4.4 23.2 6C22.4 7.6 22 9.2 22 10.8H27.2V22H16.8Z"
                  fill="currentColor"
                />
              </svg>

              <p className="text-sm text-foreground/75 leading-relaxed flex-1 font-serif italic">
                {t.quote}
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-white/8">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
                  style={{ background: t.gradient }}
                  aria-hidden="true"
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground/85">{t.name}</p>
                  <p className="text-xs text-muted-foreground/50">{t.since}</p>
                </div>
                <div className="ml-auto">
                  <span
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{
                      background: `${t.moodColor.replace(')', ' / 0.12)')}`,
                      color: t.moodColor,
                      border: `1px solid ${t.moodColor.replace(')', ' / 0.25)')}`,
                    }}
                  >
                    {t.mood}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Privacy note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center text-xs text-muted-foreground/35 mt-8"
        >
          Your privacy is sacred. We never sell, share, or analyse your personal data for anything other than helping you.
        </motion.p>
      </div>
    </section>
  )
}
