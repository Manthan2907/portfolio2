'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { consultationService, type ConsultationBooking } from '@/lib/featureService'
import { useAuthStore } from '@/store/authStore'

const counselors = [
  { id: 'maya', name: 'Maya Patel', role: 'Student wellbeing counsellor', focus: 'Academic pressure and transitions' },
  { id: 'jon', name: 'Jon Bell', role: 'Mindfulness practitioner', focus: 'Anxiety, focus, and routines' },
  { id: 'rhea', name: 'Rhea Thomas', role: 'Peer support coach', focus: 'Motivation and accountability' },
]

export function ConsultationBooking() {
  const user = useAuthStore((state) => state.user)
  const [counselorId, setCounselorId] = useState(counselors[0].id)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('10:00')
  const [topic, setTopic] = useState('')
  const [bookings, setBookings] = useState<(ConsultationBooking & { id: string })[]>([])

  useEffect(() => {
    if (!user) return
    consultationService.list(user.uid).then(setBookings).catch(() => toast.error('Could not load your bookings.'))
  }, [user])

  async function book() {
    if (!user || !date || !topic.trim()) return toast.error('Choose a date and add a topic first.')
    const counselor = counselors.find((item) => item.id === counselorId) ?? counselors[0]
    try {
      const id = await consultationService.book(user.uid, { counselorId, counselorName: counselor.name, date, time, topic: topic.trim() })
      setBookings((current) => [{ id, userId: user.uid, counselorId, counselorName: counselor.name, date, time, topic: topic.trim(), status: 'requested' }, ...current])
      setTopic(''); toast.success('Consultation request sent privately.')
    } catch { toast.error('Could not create your booking.') }
  }

  return (
    <section className="flex flex-col gap-6" aria-labelledby="consultation-title">
      <div><p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Human support</p><h2 id="consultation-title" className="mt-3 text-3xl font-semibold">You do not have to carry it alone.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Browse a small, calm directory and request a private conversation when you need a little more support.</p></div>
      <div className="grid gap-4 md:grid-cols-3">{counselors.map((counselor) => <button type="button" key={counselor.id} onClick={() => setCounselorId(counselor.id)} className={`rounded-3xl border p-5 text-left transition ${counselorId === counselor.id ? 'border-primary bg-primary/10' : 'border-white/10 bg-white/[0.045] hover:bg-white/[0.08]'}`}><span className="flex size-11 items-center justify-center rounded-full bg-primary/15 text-lg text-primary">{counselor.name.charAt(0)}</span><h3 className="mt-5 font-semibold">{counselor.name}</h3><p className="mt-1 text-sm text-muted-foreground">{counselor.role}</p><p className="mt-4 text-xs leading-5 text-muted-foreground">{counselor.focus}</p></button>)}</div>
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-6"><h3 className="text-xl font-semibold">Request a conversation</h3><div className="mt-5 flex flex-col gap-3"><label className="text-xs text-muted-foreground" htmlFor="consult-date">Preferred date</label><input id="consult-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} className="rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-sm" /><label className="text-xs text-muted-foreground" htmlFor="consult-time">Preferred time</label><select id="consult-time" value={time} onChange={(event) => setTime(event.target.value)} className="rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-sm"><option>10:00</option><option>13:00</option><option>16:00</option></select><label className="text-xs text-muted-foreground" htmlFor="consult-topic">What would you like support with?</label><textarea id="consult-topic" rows={3} value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="A sentence is enough" className="resize-none rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-sm" /><button type="button" onClick={book} className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">Request booking</button></div></div>
        <div className="rounded-3xl border border-primary/20 bg-primary/10 p-6"><p className="text-xs uppercase tracking-[0.22em] text-primary">Your requests</p><div className="mt-5 flex flex-col gap-3">{bookings.length === 0 ? <p className="text-sm leading-6 text-muted-foreground">Your consultation history will appear here after you request a time.</p> : bookings.map((booking) => <div key={booking.id} className="rounded-2xl border border-white/10 bg-background/20 p-4"><div className="flex items-center justify-between gap-3"><p className="font-medium">{booking.counselorName}</p><span className="text-xs capitalize text-primary">{booking.status}</span></div><p className="mt-1 text-sm text-muted-foreground">{booking.date} at {booking.time}</p><p className="mt-3 text-sm leading-6 text-muted-foreground">{booking.topic}</p></div>)}</div></div>
      </div>
    </section>
  )
}
