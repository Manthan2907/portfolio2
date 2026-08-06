'use client'

export type Habit = {
  id: string
  name: string
  color: string
  target: number
  reminder?: string
  createdAt: string
}

export type WellnessData = {
  habits: Habit[]
  completions: Record<string, string[]>
  moods: { id: string; label: string; score: number; date: string }[]
  journal: { id: string; text: string; date: string }[]
  stress: { score: number; date: string }[]
}

export const emptyWellnessData: WellnessData = {
  habits: [],
  completions: {},
  moods: [],
  journal: [],
  stress: [],
}

const colors = ['violet', 'rose', 'teal', 'amber', 'indigo']

export function storageKey(userId: string) {
  return `mindspace-wellness:${userId}`
}

export function loadWellnessData(userId: string): WellnessData {
  if (typeof window === 'undefined') return emptyWellnessData
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey(userId)) || 'null')
    return parsed ? { ...emptyWellnessData, ...parsed } : emptyWellnessData
  } catch {
    return emptyWellnessData
  }
}

export function saveWellnessData(userId: string, data: WellnessData) {
  if (typeof window !== 'undefined') localStorage.setItem(storageKey(userId), JSON.stringify(data))
}

export function newHabit(name: string, target = 7): Habit {
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    color: colors[Math.floor(Math.random() * colors.length)],
    target,
    createdAt: new Date().toISOString(),
  }
}

export function daysInMonth(month: Date) {
  return new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
}

export function dateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function habitMetrics(data: WellnessData, month: Date) {
  const totalDays = daysInMonth(month)
  const monthPrefix = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`
  const days = Object.entries(data.completions).filter(([key]) => key.startsWith(monthPrefix))
  const completed = days.reduce((sum, [, ids]) => sum + ids.length, 0)
  const possible = Math.max(1, data.habits.length * totalDays)
  const trend = Array.from({ length: totalDays }, (_, index) => {
    const key = dateKey(month.getFullYear(), month.getMonth(), index + 1)
    return { day: index + 1, count: data.completions[key]?.length || 0 }
  })
  let best = 0
  let current = 0
  trend.forEach((item) => {
    if (item.count > 0) { current += 1; best = Math.max(best, current) } else current = 0
  })
  return { percent: Math.round((completed / possible) * 100), best, trend }
}
