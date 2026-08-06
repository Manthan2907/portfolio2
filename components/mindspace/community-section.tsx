'use client'

import { motion } from 'framer-motion'
import { Shield, Users, HeartHandshake } from 'lucide-react'

const communitySnippets = [
  {
    text: "Does anyone else find evenings the hardest? Mornings feel hopeful but nights feel heavy...",
    reactions: ['3 people felt this', 'Peaceful after'],
    initials: 'AL',
    gradient: 'linear-gradient(135deg, oklch(0.68 0.125 322), oklch(0.70 0.165 282))',
  },
  {
    text: "7 days of journaling streak. I keep it short — just one honest sentence. It adds up.",
    reactions: ['12 inspired', 'Hopeful'],
    initials: 'TM',
    gradient: 'linear-gradient(135deg, oklch(0.70 0.165 282), oklch(0.68 0.090 200))',
  },
  {
    text: "Tried the breathing exercise before my presentation. Actually worked. Actually.",
    reactions: ['8 high-fives', 'Calm'],
    initials: 'RS',
    gradient: 'linear-gradient(135deg, oklch(0.68 0.090 200), oklch(0.72 0.095 160))',
  },
]

const sectionVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}

export function CommunitySection() {
  return (
    <section
      id="community"
      className="relative overflow-hidden py-24 sm:py-32 px-5 sm:px-8"
      aria-labelledby="community-heading"
    >
      {/* Full-width soft background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, oklch(0.10 0.028 268) 0%, oklch(0.13 0.038 270) 50%, oklch(0.10 0.028 268) 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="orb w-[500px] h-[500px] top-0 right-0 opacity-15 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, oklch(0.70 0.165 282 / 0.45) 0%, transparent 70%)',
          // @ts-expect-error CSS custom property
          '--orb-duration': '22s',
          '--orb-delay': '3s',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* Left: Text */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-70px' }}
            className="flex flex-col gap-6"
          >
            <motion.div variants={itemVariant}>
              <span className="text-xs tracking-widest uppercase text-primary/70 font-medium">
                Community &amp; Support
              </span>
              <h2
                id="community-heading"
                className="font-serif text-4xl sm:text-5xl text-foreground mt-3 text-balance leading-tight"
              >
                You are never{' '}
                <em
                  className="not-italic"
                  style={{
                    background: 'linear-gradient(135deg, oklch(0.68 0.125 322), oklch(0.70 0.165 282))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  alone in this.
                </em>
              </h2>
            </motion.div>

            <motion.p variants={itemVariant} className="text-muted-foreground leading-relaxed">
              The MindSpace community is a quiet corner of the internet — anonymous, judgment-free, and full of people simply doing their best.
            </motion.p>

            <motion.div variants={sectionVariants} className="flex flex-col gap-3">
              {[
                { icon: <Users size={15} />, text: 'Anonymous peer sharing — no profiles, no pressure' },
                { icon: <HeartHandshake size={15} />, text: 'Moderated with care for emotional safety' },
                { icon: <Shield size={15} />, text: 'Private by design — your identity is always protected' },
              ].map((item) => (
                <motion.div
                  key={item.text}
                  variants={itemVariant}
                  className="flex items-center gap-3 text-sm text-muted-foreground"
                >
                  <span className="text-primary/60">{item.icon}</span>
                  {item.text}
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={itemVariant} className="flex flex-col sm:flex-row gap-3 mt-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-3 rounded-full text-sm font-medium bg-primary text-primary-foreground shadow-lg shadow-primary/25"
              >
                Connect with others
              </motion.button>
              <button className="flex items-center gap-2 px-5 py-3 rounded-full text-sm text-muted-foreground hover:text-foreground border border-white/10 hover:border-white/20 transition-all">
                <Shield size={13} />
                Talk to a professional
              </button>
            </motion.div>
          </motion.div>

          {/* Right: Community snippets */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="flex flex-col gap-4"
          >
            {communitySnippets.map((s, i) => (
              <motion.div
                key={i}
                variants={itemVariant}
                whileHover={{ x: 3 }}
                className="glass-card rounded-2xl px-5 py-5 flex items-start gap-4"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0 mt-0.5"
                  style={{ background: s.gradient }}
                  aria-hidden="true"
                >
                  {s.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground/75 leading-relaxed">{s.text}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {s.reactions.map((r) => (
                      <span
                        key={r}
                        className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-muted-foreground/60 border border-white/8"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.p
              variants={itemVariant}
              className="text-xs text-muted-foreground/35 text-center pt-2"
            >
              All posts are anonymous. Community is moderated by real humans.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
