'use client'

import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Journal', href: '#journal' },
  { label: 'Insights', href: '#insights' },
  { label: 'Community', href: '#community' },
]

export function Nav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const { scrollY } = useScroll()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 40)
  })

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6 lg:px-10 py-4"
      >
        <div
          className={`max-w-6xl mx-auto rounded-2xl transition-all duration-500 ${
            isScrolled ? 'glass-card px-5 py-3' : 'bg-transparent px-2 py-2'
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8" aria-hidden="true">
                  <circle cx="16" cy="16" r="14" stroke="url(#navGrad)" strokeWidth="1.5" opacity="0.6" />
                  <path
                    d="M16 6 C16 6 22 10 22 16 C22 22 16 26 16 26 C16 26 10 22 10 16 C10 10 16 6 16 6Z"
                    fill="url(#navGrad)" opacity="0.85"
                  />
                  <path
                    d="M11 14 C13 10 19 10 21 14"
                    stroke="oklch(0.95 0.010 262)" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"
                  />
                  <defs>
                    <linearGradient id="navGrad" x1="6" y1="6" x2="26" y2="26" gradientUnits="userSpaceOnUse">
                      <stop stopColor="oklch(0.70 0.165 282)" />
                      <stop offset="1" stopColor="oklch(0.68 0.125 322)" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="font-serif text-xl font-semibold text-foreground tracking-tight group-hover:opacity-80 transition-opacity">
                MindSpace
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Auth area — desktop */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  {/* Avatar + name */}
                  <div className="flex items-center gap-2.5">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName ?? 'User'}
                        className="h-8 w-8 rounded-full border border-white/15 object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-xs font-semibold text-white">
                        {(user.displayName ?? user.email ?? 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm text-muted-foreground max-w-[120px] truncate">
                      {user.displayName ?? user.email}
                    </span>
                  </div>

                  <Link
                    href="/dashboard"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                  >
                    <LayoutDashboard size={14} />
                    Dashboard
                  </Link>

                  <button
                    onClick={() => logout()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link href="/signup">
                    <motion.span
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-block px-5 py-2.5 rounded-full text-sm font-medium bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200"
                    >
                      Begin Your Journey
                    </motion.span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden mt-3 pt-3 border-t border-white/8"
            >
              <nav className="flex flex-col gap-1 pb-2" aria-label="Mobile navigation">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-2 mt-2 px-1">
                  {user ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="py-2.5 rounded-xl text-sm text-center text-muted-foreground border border-white/10 transition-all"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => { logout(); setMenuOpen(false) }}
                        className="py-2.5 rounded-xl text-sm text-center text-muted-foreground border border-white/10"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setMenuOpen(false)}
                        className="py-2.5 rounded-xl text-sm text-center text-muted-foreground border border-white/10 transition-all"
                      >
                        Sign in
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setMenuOpen(false)}
                        className="py-2.5 rounded-full text-sm font-medium text-center bg-primary text-primary-foreground"
                      >
                        Begin Your Journey
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </div>
      </motion.header>
    </>
  )
}
