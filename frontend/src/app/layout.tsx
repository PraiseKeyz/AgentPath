import type { Metadata } from 'next'
import React from 'react'
import NextTopLoader from 'nextjs-toploader'
import { Providers } from '@/providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'AgentPath — Your AI Mentor',
  description:
    'AI-powered mentorship and opportunity guidance for first-generation Nigerian university students.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'AgentPath — Your AI Mentor',
    description:
      'AI-powered mentorship and opportunity guidance for first-generation Nigerian university students.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgentPath — Your AI Mentor',
    description:
      'AI-powered mentorship and opportunity guidance for first-generation Nigerian university students.',
    images: ['/twitter-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NextTopLoader color="#0075DE" showSpinner={false} />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
