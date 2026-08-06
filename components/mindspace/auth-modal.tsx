'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Eye, EyeOff, Mail, Lock, User, Sparkles } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/lib/authService'
import { toast } from 'sonner'

interface AuthModalProps {
  open: boolean
  onClose: () => void
  defaultTab?: 'signin' | 'signup'
}

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export function AuthModal({ open, onClose, defaultTab = 'signin' }: AuthModalProps) {
  const [tab, setTab] = useState<'signin' | 'signup'>(defaultTab)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const setUser = useAuthStore((s) => s.setUser)

  const reset = () => {
    setName('')
    setEmail('')
    setPassword('')
    setShowPassword(false)
    setLoading(false)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const switchTab = (t: 'signin' | 'signup') => {
    reset()
    setTab(t)
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (tab === 'signup') {
        if (!name.trim()) { toast.error('Please enter your name'); setLoading(false); return }
        const user = await authService.signUp(email, password, name)
        setUser(user)
        toast.success('Welcome to MindSpace!')
      } else {
        const user = await authService.signIn(email, password)
        setUser(user)
        toast.success('Welcome back.')
      }
      handleClose()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      // Surface friendly messages for common Firebase auth errors
      if (msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        toast.error('Incorrect email or password.')
      } else if (msg.includes('user-not-found')) {
        toast.error('No account found with that email.')
      } else if (msg.includes('email-already-in-use')) {
        toast.error('An account with that email already exists.')
      } else if (msg.includes('weak-password')) {
        toast.error('Password must be at least 6 characters.')
      } else {
        toast.error(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setLoading(true)
    try {
      const user = await authService.signInWithGoogle()
      if (!user) return // redirect flow started
      setUser(user)
      toast.success('Welcome to MindSpace!')
      handleClose()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-md"
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.4, ease }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Card */}
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d1a]/95 shadow-2xl backdrop-blur-2xl">
                {/* Ambient glow top */}
                <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-80 rounded-full bg-violet-500/20 blur-3xl" />

                {/* Close */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>

                <div className="relative px-8 pb-8 pt-8">
                  {/* Brand */}
                  <div className="mb-6 flex flex-col items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30">
                      <Sparkles size={18} className="text-white" />
                    </div>
                    <h2 className="font-serif text-2xl font-semibold text-white">
                      {tab === 'signin' ? 'Welcome back' : 'Begin your journey'}
                    </h2>
                    <p className="text-sm text-white/50">
                      {tab === 'signin'
                        ? 'Sign in to continue your practice.'
                        : 'Create your free MindSpace account.'}
                    </p>
                  </div>

                  {/* Tab switcher */}
                  <div className="mb-6 flex rounded-xl bg-white/5 p-1">
                    {(['signin', 'signup'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => switchTab(t)}
                        className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-200 ${
                          tab === t
                            ? 'bg-violet-600 text-white shadow-md shadow-violet-500/30'
                            : 'text-white/50 hover:text-white/80'
                        }`}
                      >
                        {t === 'signin' ? 'Sign In' : 'Sign Up'}
                      </button>
                    ))}
                  </div>

                  {/* Google button */}
                  <button
                    onClick={handleGoogle}
                    disabled={loading}
                    className="mb-5 flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                  >
                    {/* Google G icon */}
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>

                  {/* Divider */}
                  <div className="relative mb-5 flex items-center gap-3">
                    <div className="flex-1 border-t border-white/10" />
                    <span className="text-xs text-white/30">or</span>
                    <div className="flex-1 border-t border-white/10" />
                  </div>

                  {/* Form */}
                  <form onSubmit={handleEmailAuth} className="space-y-4">
                    <AnimatePresence mode="wait">
                      {tab === 'signup' && (
                        <motion.div
                          key="name-field"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease }}
                        >
                          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-violet-500/60 focus-within:bg-white/8 transition">
                            <User size={16} className="shrink-0 text-white/40" />
                            <input
                              type="text"
                              placeholder="Your name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
                              required
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-violet-500/60 transition">
                      <Mail size={16} className="shrink-0 text-white/40" />
                      <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
                        required
                      />
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-violet-500/60 transition">
                      <Lock size={16} className="shrink-0 text-white/40" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-white/30 hover:text-white/60 transition"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:opacity-90 hover:shadow-violet-500/40 disabled:opacity-50"
                    >
                      {loading
                        ? tab === 'signup'
                          ? 'Creating account...'
                          : 'Signing in...'
                        : tab === 'signup'
                          ? 'Create Account'
                          : 'Sign In'}
                    </button>
                  </form>

                  <p className="mt-4 text-center text-xs text-white/30">
                    Your data is private and encrypted.{' '}
                    {tab === 'signin' ? (
                      <>
                        No account?{' '}
                        <button onClick={() => switchTab('signup')} className="text-violet-400 hover:underline">
                          Sign up free
                        </button>
                      </>
                    ) : (
                      <>
                        Already have one?{' '}
                        <button onClick={() => switchTab('signin')} className="text-violet-400 hover:underline">
                          Sign in
                        </button>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
