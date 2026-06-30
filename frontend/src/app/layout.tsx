import type { Metadata } from 'next'
import React from 'react'
import NextTopLoader from 'nextjs-toploader'
import { Providers } from '@/providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'AgentPath — Your AI Mentor',
  description: 'AI-powered mentorship and opportunity guidance for first-generation Nigerian university students.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NextTopLoader color="#1a6b3c" showSpinner={false} />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
