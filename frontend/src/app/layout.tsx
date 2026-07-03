import type { Metadata } from 'next'
import React from 'react'
import NextTopLoader from 'nextjs-toploader'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Providers } from '@/providers'
import './globals.css'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'AgentPath — Your AI Mentor',
    template: '%s | AgentPath',
  },
  description:
    'AI-powered mentorship and opportunity guidance for first-generation Nigerian university students. Discover scholarships, fellowships, internships, and grants with a mentor that understands your journey.',
  keywords: [
    'mentorship',
    'scholarship Nigeria',
    'first-generation students',
    'Nigerian university',
    'AI mentor',
    'fellowship',
    'internship Nigeria',
    'student opportunities',
    'John Amhanesi Foundation',
    'JAF',
  ],
  authors: [{ name: 'AgentPath' }],
  creator: 'AgentPath',
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: '/',
    siteName: 'AgentPath',
    title: 'AgentPath — Your AI Mentor',
    description:
      'AI-powered mentorship and opportunity guidance for first-generation Nigerian university students.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgentPath — Your AI Mentor',
    description:
      'AI-powered mentorship and opportunity guidance for first-generation Nigerian university students.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body>
        <NextTopLoader color="#0075DE" showSpinner={false} />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
