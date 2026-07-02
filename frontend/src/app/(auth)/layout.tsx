import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function AuthRouteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F6F5F4] flex flex-col">
      <header className="py-6 px-6 flex justify-center">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="AgentPath" width={28} height={28} />
          <span className="text-[#000000] font-bold text-lg">AgentPath</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        {children}
      </main>
    </div>
  )
}
