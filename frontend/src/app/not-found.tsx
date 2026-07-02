import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import { FileQuestion } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Page not found — AgentPath',
  description: 'The page you are looking for could not be found.',
}

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F6F5F4] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.04)] p-8 max-w-sm w-full flex flex-col items-center">
        <div className="w-12 h-12 rounded-2xl bg-[#FEF3F1] text-[#F77463] flex items-center justify-center mb-4">
          <FileQuestion size={24} />
        </div>
        
        <h1 className="text-xl font-bold text-[#000000] mb-2">Page not found</h1>
        <p className="text-[#787774] text-sm mb-6 leading-relaxed">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/"
          className="w-full bg-[#0075DE] text-white rounded-lg py-2.5 font-semibold text-sm hover:bg-[#097FE8] transition-all duration-200 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}
