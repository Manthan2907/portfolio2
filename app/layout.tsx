import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/components/providers/AuthProvider'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body-var',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display-var',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'MindSpace — Your quiet place to breathe',
  description:
    'Gently track your mood, reflect through journaling, and discover the emotional patterns that shape your wellbeing. A calm, private space built for you.',
  generator: 'v0.app',
  keywords: ['mental health', 'wellness', 'mood tracking', 'journaling', 'mindfulness', 'stress monitoring'],
  openGraph: {
    title: 'MindSpace — Your quiet place to breathe',
    description:
      'Gently track your mood, reflect through journaling, and discover the emotional patterns that shape your wellbeing.',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f5fc' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0b1a' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark ${dmSans.variable} ${playfairDisplay.variable} bg-background`}
      suppressHydrationWarning
    >
      <body className="antialiased font-sans">
        <AuthProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'oklch(0.13 0.025 262 / 0.95)',
                border: '1px solid oklch(1 0 0 / 0.10)',
                color: 'oklch(0.93 0.012 262)',
                backdropFilter: 'blur(16px)',
              },
            }}
          />
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
