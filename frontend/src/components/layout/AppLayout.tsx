'use client'

import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import AppShell from './AppShell'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, isLoading, logout } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F6F5F4] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          {/* Notion-style minimalistic loading spinner */}
          <div className="w-6 h-6 border-2 border-[#0075DE] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#787774] font-medium tracking-tight">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <AppShell user={user} logout={logout}>
      {children}
    </AppShell>
  )
}
