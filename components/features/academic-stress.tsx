'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { academicStressService } from '@/lib/featureService'
import { useAuthStore } from '@/store/authStore'

const questions = [
  'I can keep up with my coursework without sacrificing rest.',
  'I know what to do when academic pressure starts building.',
  'My workload feels manageable this week.',
]

export function AcademicStress() {
  const user = useAuthStore((state) => state.user)
  const [answers, setAnswers] = useState<number[]>([2, 2, 2])
  const [saved, setSaved] = useState(false)
  const score = answers.reduce((sum, answer) => sum + answer, 0)
  const level = score >= 10 ? 'steady' : score >= 6 ? 'stretched' : 'overloaded'
  const levelCopy = {
    steady: 'You have a stable base. Protect the routines that are helping.',
    stretched: 'You are carrying a lot. A small reset can make the week feel lighter.',
    overloaded: 'Your load deserves support. Start with one task and one person you trust.',
  }[level]

  async function saveAssessment() {
    if (!user) return
    try {
      await academicStressService.save(user.uid, { score, level, answers: Object.fromEntries(answers.map((value, index) => [`q${index + 1}`, value])) })
      setSaved(true)
      toast.success('Your check-in was saved privately.')
    } catch {
      toast.error('Could not save your check-in. Please try again.')
    }
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]" aria-labelledby="stress-title">
      <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-xl shadow-black/10">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Academic care</p>
        <h2 id="stress-title" className="mt-3 text-2xl font-semibold">How is school feeling this week?</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">A private three-question check-in helps you notice pressure before it becomes burnout.</p>
        <div className="mt-7 flex flex-col gap-6">
          {questions.map((question, index) => (
            <fieldset key={question} className="flex flex-col gap-3">
              <legend className="text-sm leading-6">{question}</legend>
              <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label={question}>
                {['Not yet', 'Sometimes', 'Usually', 'Always'].map((label, option) => {
                  const value = option + 1
                  return (
                    <button key={label} type="button" aria-pressed={answers[index] === value} onClick={() => setAnswers((current) => current.map((answer, item) => item === index ? value : answer))} className={`rounded-2xl border px-3 py-2 text-xs transition ${answers[index] === value ? 'border-primary bg-primary/15 text-primary' : 'border-white/10 text-muted-foreground hover:bg-white/5'}`}>
                      {label}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          ))}
        </div>
        <button type="button" onClick={saveAssessment} className="mt-7 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90">{saved ? 'Saved check-in' : 'Save private check-in'}</button>
      </div>
      <aside className="rounded-3xl border border-primary/20 bg-primary/10 p-6">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Your signal</p>
        <p className="mt-5 text-5xl font-semibold">{score}<span className="text-lg text-muted-foreground">/12</span></p>
        <h3 className="mt-4 text-xl font-semibold capitalize">{level}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{levelCopy}</p>
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-background/70"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(score / 12) * 100}%` }} /></div>
      </aside>
    </section>
  )
}
