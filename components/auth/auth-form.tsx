'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import { authService } from '@/lib/authService'
import { useAuthStore } from '@/store/authStore'

interface AuthFormProps {
  mode: 'signin' | 'signup'
}

function friendlyAuthError(error: unknown) {
  const code = (error as { code?: string } | null)?.code ?? ''
  if (code.includes('invalid-credential') || code.includes('wrong-password')) return 'That email or password is not correct.'
  if (code.includes('user-not-found')) return 'No account exists for that email yet.'
  if (code.includes('email-already-in-use')) return 'That email already has an account. Try signing in.'
  if (code.includes('weak-password')) return 'Use a password with at least 6 characters.'
  if (code.includes('invalid-email')) return 'Enter a valid email address.'
  if (code.includes('operation-not-allowed')) return 'Enable this sign-in method in Firebase Console.'
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.'
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const isSignup = mode === 'signup'

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    try {
      const user = isSignup
        ? await authService.signUp(email.trim(), password, name.trim())
        : await authService.signIn(email.trim(), password)
      setUser(user)
      toast.success(isSignup ? 'Your private space is ready.' : 'Welcome back.')
      router.push('/dashboard')
    } catch (error) {
      toast.error(friendlyAuthError(error))
    } finally {
      setBusy(false)
    }
  }

  async function continueWithGoogle() {
    setBusy(true)
    try {
      const user = await authService.signInWithGoogle()
      if (user) {
        setUser(user)
        router.push('/dashboard')
      }
    } catch (error) {
      toast.error(friendlyAuthError(error))
    } finally {
      setBusy(false)
    }
  }

  async function resetPassword() {
    if (!email.trim()) {
      toast.error('Enter your email first, then request a reset link.')
      return
    }
    setBusy(true)
    try {
      await authService.resetPassword(email.trim())
      setResetSent(true)
      toast.success('Password reset email sent.')
    } catch (error) {
      toast.error(friendlyAuthError(error))
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground lg:px-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-between gap-12">
        <header className="flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl tracking-tight">MindSpace<span className="text-primary">.</span></Link>
          <Link href={isSignup ? '/login' : '/signup'} className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            {isSignup ? 'Already have an account?' : 'New here? Create an account'}
          </Link>
        </header>

        <section className="grid items-center gap-12 lg:grid-cols-[1fr_430px]">
          <div className="max-w-xl">
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.24em] text-primary">A quieter way forward</p>
            <h1 className="max-w-lg font-serif text-5xl leading-[0.98] tracking-tight sm:text-7xl">{isSignup ? 'Make room for yourself.' : 'Welcome back to your quiet place.'}</h1>
            <p className="mt-7 max-w-md text-base leading-7 text-muted-foreground">{isSignup ? 'Build a private rhythm for your mood, habits, studies, reflections, and support.' : 'Pick up your reflections, habits, tasks, and gentle progress exactly where you left them.'}</p>
            <div className="mt-10 flex flex-wrap gap-2 text-xs text-muted-foreground">
              {['Private by default', 'No judgment', 'Small steps count'].map((item) => <span key={item} className="border border-border px-3 py-2">{item}</span>)}
            </div>
          </div>

          <div className="border border-border bg-card p-6 shadow-[8px_8px_0_hsl(var(--primary)/0.16)] sm:p-8">
            <div className="mb-8">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{isSignup ? 'Start here' : 'Sign in'}</p>
              <h2 className="mt-3 font-serif text-3xl">{isSignup ? 'Your space, your pace.' : 'Good to see you.'}</h2>
            </div>
            <button type="button" onClick={continueWithGoogle} disabled={busy} className="flex w-full items-center justify-center gap-3 border border-border bg-background px-4 py-3 text-sm transition hover:border-primary disabled:opacity-50">
              <span className="font-bold">G</span> Continue with Google
            </button>
            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>
            <form onSubmit={submit} className="flex flex-col gap-4">
              {isSignup && <label className="flex items-center gap-3 border border-border px-3 py-3 focus-within:border-primary"><UserRound className="size-4 text-muted-foreground" /><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" required className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" /></label>}
              <label className="flex items-center gap-3 border border-border px-3 py-3 focus-within:border-primary"><Mail className="size-4 text-muted-foreground" /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" required className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" /></label>
              <label className="flex items-center gap-3 border border-border px-3 py-3 focus-within:border-primary"><LockKeyhole className="size-4 text-muted-foreground" /><input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" minLength={6} required className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></label>
              <button disabled={busy} className="group flex items-center justify-between bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50">{busy ? 'Please wait…' : isSignup ? 'Create my space' : 'Enter MindSpace'}<ArrowRight className="size-4 transition group-hover:translate-x-1" /></button>
            </form>
            {!isSignup && <div className="mt-5 text-center text-xs text-muted-foreground">{resetSent ? 'Check your inbox for the reset link.' : <button type="button" onClick={resetPassword} disabled={busy} className="underline underline-offset-4 hover:text-foreground">Forgot your password?</button>}</div>}
          </div>
        </section>

        <footer className="flex items-center justify-between border-t border-border pt-5 text-xs text-muted-foreground"><span>MindSpace / personal wellbeing studio</span><span>© 2026</span></footer>
      </div>
    </main>
  )
}
