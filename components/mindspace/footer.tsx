'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, Lock, Heart } from 'lucide-react'

const footerLinks = {
  Product: ['Mood Tracking', 'Journaling', 'Breathing', 'Insights', 'Community'],
  Resources: ['Getting Started', 'Mental Health Guide', 'Crisis Support', 'Affirmations', 'Blog'],
  Company: ['About', 'Privacy Policy', 'Terms of Service', 'Accessibility', 'Contact'],
}

const trustBadges = [
  { icon: <Lock size={13} />, text: 'End-to-end encrypted' },
  { icon: <Shield size={13} />, text: 'HIPAA-aware design' },
  { icon: <Heart size={13} />, text: 'No data selling, ever' },
]

export function Footer() {
  return (
    <footer
      className="relative overflow-hidden border-t border-white/8"
      aria-label="Site footer"
    >
      {/* Subtle gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, oklch(0.08 0.022 265) 0%, oklch(0.10 0.028 268) 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">

          {/* Brand column */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2.5 w-fit group">
              <svg
                viewBox="0 0 32 32"
                fill="none"
                className="w-7 h-7"
                aria-hidden="true"
              >
                <path
                  d="M16 3 C16 3 23 8 23 16 C23 24 16 29 16 29 C16 29 9 24 9 16 C9 8 16 3 16 3Z"
                  fill="url(#footerGrad)"
                  opacity="0.85"
                />
                <defs>
                  <linearGradient id="footerGrad" x1="9" y1="3" x2="23" y2="29" gradientUnits="userSpaceOnUse">
                    <stop stopColor="oklch(0.70 0.165 282)" />
                    <stop offset="1" stopColor="oklch(0.68 0.125 322)" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="font-serif text-lg font-semibold text-foreground/85">MindSpace</span>
            </Link>
            <p className="text-sm text-muted-foreground/60 leading-relaxed max-w-xs">
              A quiet space for your mind — to breathe, reflect, and slowly begin to understand yourself a little better.
            </p>

            {/* Trust badges */}
            <div className="flex flex-col gap-2 mt-1">
              {trustBadges.map((b) => (
                <div key={b.text} className="flex items-center gap-2 text-xs text-muted-foreground/45">
                  <span className="text-primary/45">{b.icon}</span>
                  {b.text}
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="flex flex-col gap-4">
              <p className="text-xs font-semibold text-foreground/40 uppercase tracking-widest">
                {category}
              </p>
              <ul className="flex flex-col gap-2.5" role="list">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground/55 hover:text-muted-foreground transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/35 text-center sm:text-left">
            &copy; {new Date().getFullYear()} MindSpace. Made with care for your mental wellbeing.
          </p>

          <div className="flex items-center gap-1">
            {/* Social links — minimal SVG icons */}
            {[
              {
                label: 'Twitter / X',
                path: 'M4 4l7.5 10.5L4.5 22H6l5.3-6.5L16 22h4.5L13 11l6.8-7H18l-5 6L8.5 4H4z',
              },
              {
                label: 'Instagram',
                path: 'M8 2.5h8A5.5 5.5 0 0121.5 8v8A5.5 5.5 0 0116 21.5H8A5.5 5.5 0 012.5 16V8A5.5 5.5 0 018 2.5zm0 1.5A4 4 0 004 8v8a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-4-4H8zm4 3.25a4.25 4.25 0 110 8.5 4.25 4.25 0 010-8.5zM12 9a3 3 0 100 6 3 3 0 000-6zm4.5-1a.75.75 0 110 1.5.75.75 0 010-1.5z',
              },
            ].map((s) => (
              <motion.a
                key={s.label}
                href="#"
                aria-label={s.label}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground/35 hover:text-muted-foreground/65 hover:bg-white/5 transition-all"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                >
                  <path d={s.path} />
                </svg>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
