import React from 'react'
import { AppSidebar } from '@/components/AppSidebar'

export default function RoadmapLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AppSidebar />
      <main className="flex-1 overflow-auto bg-white">{children}</main>
    </div>
  )
}
