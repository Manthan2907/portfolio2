'use client'

import Link from 'next/link'
import { ArrowLeft, ClipboardList, GraduationCap, HandHeart, Sparkles } from 'lucide-react'

const links = [
  { href: '/dashboard/academic-stress', label: 'Academic care', icon: GraduationCap },
  { href: '/dashboard/tasks', label: 'Tasks', icon: ClipboardList },
  { href: '/dashboard/consultation', label: 'Consultation', icon: HandHeart },
]

export function FeaturePageShell({ children, eyebrow, title, description }: { children: React.ReactNode; eyebrow: string; title: string; description: string }) {
  return (
    <main className="min-h-screen bg-background px-5 py-6 text-foreground sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-foreground/10 pb-5">
          <Link href="/dashboard" className="flex items-center gap-2 font-serif text-xl" aria-label="Back to MindSpace dashboard">
            <Sparkles className="text-primary" size={18} />
            MindSpace
          </Link>
          <nav className="flex flex-wrap items-center gap-2" aria-label="Wellness tools">
            {links.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className="flex items-center gap-2 rounded-full border border-foreground/10 px-3 py-2 text-xs text-muted-foreground transition hover:border-primary/50 hover:text-foreground">
                <Icon size={14} />
                {label}
              </Link>
            ))}
          </nav>
        </header>
        <div className="flex flex-col gap-2 py-12 sm:py-16">
          <Link href="/dashboard" className="flex w-fit items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"><ArrowLeft size={13} /> Dashboard</Link>
          <p className="pt-5 text-xs font-medium uppercase tracking-[0.24em] text-primary">{eyebrow}</p>
          <h1 className="max-w-3xl text-balance font-serif text-4xl leading-tight sm:text-6xl">{title}</h1>
          <p className="max-w-2xl text-pretty text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>
        </div>
        {children}
      </div>
    </main>
  )
}
