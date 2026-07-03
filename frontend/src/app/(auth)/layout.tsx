import React from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'

export default function AuthRouteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F6F5F4] flex flex-col justify-between relative overflow-hidden select-none">
      {/* Subtle background decorative shapes */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#0075DE]/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-[#62AEF0]/5 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="py-8 px-6 flex justify-center z-10">
        <Link href="/" className="flex items-center group">
          <Logo
            size={22}
            markClassName="group-hover:scale-105 transition-transform duration-200"
            textClassName="font-extrabold"
          />
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-6 pb-8 z-10">
        {children}
      </main>

      {/* Footer disclaimer */}
      <footer className="py-6 px-6 text-center z-10">
        <p className="text-[10px] text-[#B4B4B0] font-medium max-w-xs mx-auto leading-normal">
          By continuing, you agree to AgentPath's{' '}
          <Link href="#" className="hover:text-[#787774] transition-colors underline decoration-[#B4B4B0]/40">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="#" className="hover:text-[#787774] transition-colors underline decoration-[#B4B4B0]/40">
            Privacy Policy
          </Link>
          .
        </p>
      </footer>
    </div>
  )
}
