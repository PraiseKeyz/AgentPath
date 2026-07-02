'use client'

import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { MessageSquare, Compass, Map, ArrowRight, Sparkles } from 'lucide-react'

const features = [
  {
    icon: MessageSquare,
    title: 'AI Mentor',
    description: 'Have real conversations about your goals. Your mentor asks what you think before suggesting — agency first.',
    color: 'bg-[#E6F3FE] text-[#0075DE]',
  },
  {
    icon: Compass,
    title: 'Opportunities',
    description: 'Discover scholarships, fellowships, and internships curated for Nigerian university students.',
    color: 'bg-[#FEF3F1] text-[#F77463]',
  },
  {
    icon: Map,
    title: 'Roadmap',
    description: 'Track milestones, set deadlines, and stay on top of every application step by step.',
    color: 'bg-[#FFF5E0] text-[#FF8A33]',
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F6F5F4]">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="AgentPath" width={28} height={28} />
          <span className="text-[#000000] font-bold text-lg">AgentPath</span>
        </div>
        <Link
          href="/auth/login"
          className="text-sm font-medium text-[#787774] hover:text-[#000000] transition-colors duration-200"
        >
          Sign in
        </Link>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-16 pb-20 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white text-[#0075DE] text-sm font-medium px-4 py-1.5 rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.06)] mb-8">
          <Sparkles size={14} />
          AI-powered mentorship
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#000000] leading-[1.1] tracking-tight mb-6">
          Your AI mentor for{' '}
          <span className="text-[#0075DE]">university success</span>
        </h1>
        <p className="text-lg md:text-xl text-[#787774] max-w-xl mb-10 leading-relaxed">
          Navigate scholarships, fellowships, and internships with an AI mentor that puts you in the driver&apos;s seat. Built for first-generation Nigerian students.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-[#0075DE] text-white rounded-lg font-semibold text-base hover:bg-[#097FE8] transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
          >
            Get started free
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center px-7 py-3 bg-white text-[#37352F] rounded-lg font-semibold text-base border border-[#E9E9E7] hover:bg-[#F6F5F4] transition-all duration-200"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, description, color }) => (
            <div
              key={title}
              className="bg-white rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)] transition-shadow duration-300"
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${color} mb-4`}>
                <Icon size={20} />
              </div>
              <h3 className="text-[#000000] font-semibold text-base mb-2">{title}</h3>
              <p className="text-[#787774] text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E9E9E7] bg-white py-6 px-6">
        <p className="text-center text-sm text-[#B4B4B0]">
          © {new Date().getFullYear()} AgentPath. Built with care for Nigerian students.
        </p>
      </footer>
    </main>
  )
}
