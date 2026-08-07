'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { taskService, type PersonalTask } from '@/lib/featureService'
import { useAuthStore } from '@/store/authStore'

export function TaskPlanner() {
  const user = useAuthStore((state) => state.user)
  const [tasks, setTasks] = useState<(PersonalTask & { id: string })[]>([])
  const [title, setTitle] = useState('')
  const [course, setCourse] = useState('')
  const [priority, setPriority] = useState<PersonalTask['priority']>('medium')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    taskService.list(user.uid).then(setTasks).catch(() => toast.error('Could not load your tasks.')).finally(() => setLoading(false))
  }, [user])

  async function addTask() {
    if (!user || !title.trim()) return
    try {
      const id = await taskService.create(user.uid, { title: title.trim(), course: course.trim() || 'General', priority })
      setTasks((current) => [{ id, userId: user.uid, title: title.trim(), course: course.trim() || 'General', priority, completed: false }, ...current])
      setTitle(''); setCourse(''); toast.success('Task added.')
    } catch { toast.error('Could not save this task.') }
  }

  async function toggleTask(task: PersonalTask & { id: string }) {
    try {
      await taskService.update(task.id, { completed: !task.completed })
      setTasks((current) => current.map((item) => item.id === task.id ? { ...item, completed: !item.completed } : item))
    } catch { toast.error('Could not update this task.') }
  }

  async function removeTask(id: string) {
    try { await taskService.remove(id); setTasks((current) => current.filter((task) => task.id !== id)) } catch { toast.error('Could not remove this task.') }
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]" aria-labelledby="tasks-title">
      <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-xl shadow-black/10">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Academic rhythm</p>
        <h2 id="tasks-title" className="mt-3 text-2xl font-semibold">Make the next step visible.</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Keep coursework and care in the same private workspace.</p>
        <div className="mt-7 flex flex-col gap-3">
          <label className="text-xs text-muted-foreground" htmlFor="task-title">Task</label>
          <input id="task-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Read chapter 4" className="rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-sm outline-none ring-primary focus:ring-2" />
          <label className="text-xs text-muted-foreground" htmlFor="task-course">Course or context</label>
          <input id="task-course" value={course} onChange={(event) => setCourse(event.target.value)} placeholder="Psychology" className="rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-sm outline-none ring-primary focus:ring-2" />
          <label className="text-xs text-muted-foreground" htmlFor="task-priority">Priority</label>
          <select id="task-priority" value={priority} onChange={(event) => setPriority(event.target.value as PersonalTask['priority'])} className="rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-sm outline-none ring-primary focus:ring-2"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select>
          <button type="button" onClick={addTask} className="mt-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90">Add task</button>
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
        <div className="flex items-center justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">This week</p><h3 className="mt-2 text-xl font-semibold">Your workload</h3></div><span className="text-sm text-muted-foreground">{tasks.filter((task) => !task.completed).length} open</span></div>
        <div className="mt-6 flex flex-col gap-3">{loading ? <p className="text-sm text-muted-foreground">Loading tasks...</p> : tasks.length === 0 ? <p className="rounded-2xl border border-dashed border-white/10 p-5 text-sm text-muted-foreground">No tasks yet. Add one small next step.</p> : tasks.map((task) => <div key={task.id} className="flex items-center gap-3 rounded-2xl border border-white/10 p-4"><button type="button" aria-label={task.completed ? `Reopen ${task.title}` : `Complete ${task.title}`} aria-pressed={task.completed} onClick={() => toggleTask(task)} className={`size-5 rounded-full border ${task.completed ? 'border-primary bg-primary' : 'border-white/20'}`} /><div className="min-w-0 flex-1"><p className={`truncate text-sm ${task.completed ? 'text-muted-foreground line-through' : ''}`}>{task.title}</p><p className="mt-1 text-xs text-muted-foreground">{task.course} · {task.priority} priority</p></div><button type="button" onClick={() => removeTask(task.id)} className="text-xs text-muted-foreground hover:text-foreground">Remove</button></div>)}</div>
      </div>
    </section>
  )
}
