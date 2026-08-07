'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { BarChart3, Check, ChevronLeft, ChevronRight, Download, HeartPulse, Home, LogOut, Plus, Settings, Sparkles, Trash2, X, GraduationCap, ClipboardList, HandHeart } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/lib/authService'
import { emptyWellnessData, type WellnessData, type Habit, newHabit, daysInMonth, dateKey, habitMetrics } from '@/lib/wellness'
import { clearPrivateWellnessData, loadPrivateWellnessData, savePrivateWellnessData } from '@/lib/wellnessRepository'

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/10 backdrop-blur-xl ${className}`}>{children}</section>
}

function MiniChart({ values }: { values: number[] }) {
  const max = Math.max(1, ...values)
  return <div className="flex h-32 items-end gap-1.5">{values.map((value, index) => <div key={index} className="flex-1 rounded-t-md bg-gradient-to-t from-violet-600 to-fuchsia-400 transition-all" style={{ height: `${Math.max(8, (value / max) * 100)}%` }} title={`${value} completed`} />)}</div>
}

export function DashboardShell({ section = 'overview' }: { section?: 'overview' | 'habits' | 'insights' | 'settings' }) {
  const user = useAuthStore((state) => state.user)
  const [data, setData] = useState<WellnessData>(emptyWellnessData)
  // Keep the server snapshot deterministic, then switch to the current month after hydration.
  const [month, setMonth] = useState(() => new Date(2024, 0, 1))
  const [habitName, setHabitName] = useState('')
  const [showHabitForm, setShowHabitForm] = useState(false)
  const [mood, setMood] = useState('')

  useEffect(() => {
    if (!user) return
    let active = true
    loadPrivateWellnessData(user.uid)
      .then((saved) => {
        if (active && saved) setData({ ...emptyWellnessData, ...saved })
      })
      .catch((error: unknown) => {
        console.error('Failed to load wellness data:', error)
        const message = error instanceof Error ? error.message : String(error)
        if (message.includes('not configured')) {
          toast.error('Firebase is not configured. Check your environment variables and deployment settings.')
        } else {
          toast.error('We could not load your private wellness data.')
        }
      })
    return () => { active = false }
  }, [user])

  useEffect(() => {
    if (!user) return
    const timeout = window.setTimeout(() => {
      savePrivateWellnessData(user.uid, data).catch((error: unknown) => {
        console.error('Failed to save wellness data:', error)
        const message = error instanceof Error ? error.message : String(error)
        if (message.includes('not configured')) {
          toast.error('Firebase is not configured. Check your environment variables and deployment settings.')
        } else {
          toast.error('Your latest change could not be saved.')
        }
      })
    }, 400)
    return () => window.clearTimeout(timeout)
  }, [data, user])

  const metrics = useMemo(() => habitMetrics(data, month), [data, month])
  const greeting = user?.displayName?.split(' ')[0] || 'friend'
  const days = daysInMonth(month)

  const toggleHabit = (habitId: string, day: number) => {
    const key = dateKey(month.getFullYear(), month.getMonth(), day)
    setData((current) => {
      const values = current.completions[key] || []
      const next = values.includes(habitId) ? values.filter((id) => id !== habitId) : [...values, habitId]
      return { ...current, completions: { ...current.completions, [key]: next } }
    })
  }

  const addHabit = () => {
    if (!habitName.trim()) return toast.error('Name your habit first.')
    setData((current) => ({ ...current, habits: [...current.habits, newHabit(habitName)] }))
    setHabitName(''); setShowHabitForm(false); toast.success('Habit added.')
  }

  const removeHabit = (id: string) => {
    setData((current) => ({ ...current, habits: current.habits.filter((habit) => habit.id !== id), completions: Object.fromEntries(Object.entries(current.completions).map(([key, ids]) => [key, ids.filter((item) => item !== id)])) }))
    toast.success('Habit removed.')
  }

  const addMood = () => {
    if (!mood) return
    setData((current) => ({ ...current, moods: [{ id: crypto.randomUUID(), label: mood, score: ['low', 'okay', 'good', 'great'].indexOf(mood) + 1, date: new Date().toISOString() }, ...current.moods].slice(0, 30) }))
    setMood(''); toast.success('Mood saved.')
  }

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ user: user?.email, exportedAt: new Date().toISOString(), ...data }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'mindspace-data.json'; link.click(); URL.revokeObjectURL(url); toast.success('Your data was exported.')
  }

  const clearData = () => {
    if (!window.confirm('Clear all your MindSpace data? This cannot be undone.')) return
    setData(emptyWellnessData)
    if (user) {
      clearPrivateWellnessData(user.uid).catch(() => toast.error('Your data could not be cleared.'))
    }
    toast.success('Your data was cleared.')
  }

  return <div className="min-h-screen bg-background text-foreground"><aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/8 bg-black/10 p-5 lg:block"><Link href="/" className="mb-10 flex items-center gap-2 font-serif text-xl"><Sparkles className="text-primary" size={19} />MindSpace</Link><nav className="space-y-2"><Link href="/dashboard" className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${section === 'overview' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-white/5'}`}><Home size={16} />Overview</Link><Link href="/dashboard/habits" className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${section === 'habits' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-white/5'}`}><Check size={16} />Habits</Link><Link href="/dashboard/insights" className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${section === 'insights' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-white/5'}`}><BarChart3 size={16} />Insights</Link><Link href="/dashboard/academic-stress" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-white/5"><GraduationCap size={16} />Academic care</Link><Link href="/dashboard/tasks" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-white/5"><ClipboardList size={16} />Tasks</Link><Link href="/dashboard/consultation" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-white/5"><HandHeart size={16} />Consultation</Link><Link href="/dashboard/settings" className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${section === 'settings' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-white/5'}`}><Settings size={16} />Settings</Link></nav><button className="mt-10 flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => authService.logout().then(() => window.location.href = '/')}><LogOut size={16} />Sign out</button></aside><main className="mx-auto max-w-6xl px-5 py-7 lg:ml-64 lg:px-10"><div className="mb-8 flex items-start justify-between gap-4"><div><p className="text-sm text-muted-foreground">Your personal space</p><h1 className="mt-1 text-3xl font-semibold">Good to see you, {greeting}.</h1></div><div className="flex gap-2"><Link href="/dashboard/settings" className="rounded-xl border border-white/10 p-2 text-muted-foreground hover:bg-white/5 lg:hidden"><Settings size={18} /></Link>{section === 'habits' && <button onClick={() => setShowHabitForm(true)} className="flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm text-primary-foreground"><Plus size={16} />New habit</button>}</div></div>{section === 'overview' && <div className="space-y-5"><div className="grid gap-5 md:grid-cols-3"><Card><p className="text-sm text-muted-foreground">Habit completion</p><p className="mt-2 text-3xl font-semibold">{metrics.percent}%</p><p className="mt-2 text-xs text-muted-foreground">{metrics.best} day personal streak</p></Card><Card><p className="text-sm text-muted-foreground">Check-ins</p><p className="mt-2 text-3xl font-semibold">{data.moods.length}</p><p className="mt-2 text-xs text-muted-foreground">Mood moments saved</p></Card><Card><p className="text-sm text-muted-foreground">Active habits</p><p className="mt-2 text-3xl font-semibold">{data.habits.length}</p><p className="mt-2 text-xs text-muted-foreground">Small steps add up</p></Card></div><div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]"><Card><div className="mb-5 flex items-center justify-between"><div><h2 className="text-xl font-semibold">Your habit rhythm</h2><p className="text-sm text-muted-foreground">Completion across this month</p></div><Link href="/dashboard/habits" className="text-sm text-primary hover:underline">Open tracker</Link></div><MiniChart values={metrics.trend.map((item) => item.count)} /></Card><Card><h2 className="text-xl font-semibold">How are you feeling?</h2><p className="mt-1 text-sm text-muted-foreground">A quick check-in, just for you.</p><div className="mt-5 flex flex-wrap gap-2">{['low', 'okay', 'good', 'great'].map((value) => <button key={value} onClick={() => setMood(value)} className={`rounded-full border px-3 py-2 text-sm capitalize ${mood === value ? 'border-primary bg-primary/15 text-primary' : 'border-white/10 text-muted-foreground hover:bg-white/5'}`}>{value}</button>)}</div><button onClick={addMood} disabled={!mood} className="mt-5 w-full rounded-xl bg-primary py-2.5 text-sm text-primary-foreground disabled:opacity-40">Save check-in</button></Card></div></div>}{section === 'habits' && <Card><div className="mb-5 flex items-center justify-between"><div><h2 className="text-xl font-semibold">Habit tracker</h2><p className="text-sm text-muted-foreground">Your data is private to {user?.email || 'this account'}.</p></div><div className="flex items-center gap-2"><button className="rounded-lg border border-white/10 p-2" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft size={16} /></button><span className="min-w-28 text-center text-sm">{month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span><button className="rounded-lg border border-white/10 p-2" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight size={16} /></button></div></div>{data.habits.length === 0 ? <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center"><HeartPulse className="mx-auto mb-3 text-primary" size={30} /><p className="font-medium">Start with one gentle habit.</p><p className="mt-1 text-sm text-muted-foreground">A walk, water, stretching, or ten quiet minutes.</p><button onClick={() => setShowHabitForm(true)} className="mt-5 rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground">Add your first habit</button></div> : <div className="overflow-x-auto"><div className="min-w-[760px]"><div className="mb-2 grid grid-cols-[180px_repeat(31,minmax(24px,1fr))] gap-1 text-center text-[10px] text-muted-foreground"><span className="text-left">Habit</span>{Array.from({ length: days }, (_, i) => <span key={i}>{i + 1}</span>)}</div>{data.habits.map((habit) => <div key={habit.id} className="group grid grid-cols-[180px_repeat(31,minmax(24px,1fr))] items-center gap-1"><div className="flex items-center gap-2 truncate pr-2 text-sm"><span className="h-2 w-2 shrink-0 rounded-full bg-primary" />{habit.name}<button onClick={() => removeHabit(habit.id)} className="ml-auto hidden text-muted-foreground hover:text-destructive group-hover:block" aria-label={`Remove ${habit.name}`}><Trash2 size={13} /></button></div>{Array.from({ length: days }, (_, i) => { const key = dateKey(month.getFullYear(), month.getMonth(), i + 1); const checked = data.completions[key]?.includes(habit.id); return <button key={i} aria-label={`${habit.name} day ${i + 1}`} onClick={() => toggleHabit(habit.id, i + 1)} className={`aspect-square rounded-md border transition ${checked ? 'border-primary bg-primary shadow-sm shadow-primary/40' : 'border-white/10 bg-white/[0.03] hover:border-primary/50'}`}><span className="sr-only">{checked ? 'Completed' : 'Not completed'}</span></button>})}</div>)}</div></div>}<div className="mt-5 flex items-center justify-between border-t border-white/8 pt-4 text-sm"><span className="text-muted-foreground">{metrics.percent}% complete · {metrics.best} day streak</span><button onClick={() => setShowHabitForm(true)} className="text-primary hover:underline">Add another habit</button></div></Card>}{section === 'insights' && <div className="space-y-5"><div className="grid gap-5 md:grid-cols-3"><Card><p className="text-sm text-muted-foreground">Monthly completion</p><p className="mt-2 text-3xl font-semibold">{metrics.percent}%</p></Card><Card><p className="text-sm text-muted-foreground">Best streak</p><p className="mt-2 text-3xl font-semibold">{metrics.best} days</p></Card><Card><p className="text-sm text-muted-foreground">Saved moods</p><p className="mt-2 text-3xl font-semibold">{data.moods.length}</p></Card></div><Card><h2 className="text-xl font-semibold">Your personal progress graph</h2><p className="mb-5 text-sm text-muted-foreground">Only your signed-in account contributes to this trend.</p><MiniChart values={metrics.trend.map((item) => item.count)} /><div className="mt-4 flex justify-between text-xs text-muted-foreground"><span>Day 1</span><span>Today</span></div></Card><Card><h2 className="text-xl font-semibold">Gentle observations</h2><div className="mt-4 grid gap-3 sm:grid-cols-3"><p className="rounded-2xl bg-primary/10 p-4 text-sm">Consistency matters more than intensity.</p><p className="rounded-2xl bg-accent/10 p-4 text-sm">Your habits create the clearest signal over time.</p><p className="rounded-2xl bg-secondary p-4 text-sm">Keep checking in without judging the result.</p></div></Card></div>}{section === 'settings' && <div className="grid gap-5 lg:grid-cols-2"><Card><h2 className="text-xl font-semibold">Your account</h2><p className="mt-2 text-sm text-muted-foreground">{user?.email || 'Preview mode'}</p><button onClick={exportData} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm hover:bg-white/5"><Download size={16} />Export my data</button></Card><Card><h2 className="text-xl font-semibold">Data controls</h2><p className="mt-2 text-sm text-muted-foreground">Clear your personal wellness data from this device.</p><button onClick={clearData} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/30 py-3 text-sm text-destructive hover:bg-destructive/10"><Trash2 size={16} />Clear all data</button></Card></div>}{showHabitForm && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5"><div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#141224] p-6 shadow-2xl"><div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Create a habit</h2><button onClick={() => setShowHabitForm(false)} aria-label="Close"><X size={18} /></button></div><label className="mt-6 block text-sm text-muted-foreground">Habit name<input value={habitName} onChange={(event) => setHabitName(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) addHabit() }} autoFocus className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-foreground outline-none focus:border-primary" placeholder="Read for 10 minutes" /></label><button onClick={addHabit} className="mt-5 w-full rounded-xl bg-primary py-3 text-sm text-primary-foreground">Create habit</button></div></div>}</main></div>
}
