'use client'

import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import {
  MessageSquare,
  Compass,
  Map,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  Users,
  Award,
  BookOpen
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-[#000000] font-sans selection:bg-[#E6F3FE]">
      {/* 1. Header / Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E9E9E7] px-6 py-3.5 transition-all duration-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="AgentPath" width={24} height={24} className="object-contain" />
            <span className="text-[#000000] font-bold text-base tracking-tight">AgentPath</span>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-[#787774] hover:text-[#000000] transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-[#787774] hover:text-[#000000] transition-colors">How It Works</a>
            <a href="#opportunities" className="text-sm text-[#787774] hover:text-[#000000] transition-colors">Curated Opportunities</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm font-semibold text-[#787774] hover:text-[#000000] px-3 py-1.5 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center text-xs font-bold bg-[#0075DE] text-white hover:bg-[#097FE8] px-3.5 py-2 rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-150"
            >
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="bg-[#F6F5F4] pt-20 pb-24 px-6 border-b border-[#E9E9E7]">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Announcement pill */}
          <div className="inline-flex items-center gap-1.5 bg-white text-xs font-semibold text-[#0075DE] border border-[#E9E9E7] px-3.5 py-1.5 rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.02)] mb-8 hover:bg-[#F9F9F8] cursor-pointer transition-colors duration-200">
            <Sparkles size={12} className="text-[#0075DE]" />
            <span>Designed for first-generation Nigerian students</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#000000] leading-[1.1] max-w-3xl mb-6">
            Your AI mentor for <br />
            <span className="text-[#0075DE]">university success</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#787774] max-w-2xl mb-10 leading-relaxed font-normal">
            Navigate scholarships, fellowships, and internships with a dedicated conversational AI mentor. We put your goals and agency first.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-16">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-1.5 px-6 py-3 bg-[#0075DE] text-white rounded-lg font-semibold text-sm hover:bg-[#097FE8] transition-all duration-150 shadow-[0_1px_3px_rgba(0,0,0,0.05)] cursor-pointer"
            >
              Start Chatting Free
              <ArrowRight size={14} />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#37352F] rounded-lg font-semibold text-sm border border-[#E9E9E7] hover:bg-[#F6F5F4] transition-all duration-150 cursor-pointer"
            >
              Learn how it works
            </a>
          </div>

          {/* Interactive UI Mockup */}
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)] overflow-hidden border border-[#E9E9E7] text-left">
            {/* Header bar */}
            <div className="bg-[#F6F5F4] border-b border-[#E9E9E7] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#E9E9E7]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#E9E9E7]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#E9E9E7]" />
                <span className="text-xs text-[#787774] ml-2 font-medium">AgentPath AI Mentor</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#0075DE] font-semibold bg-[#E6F3FE] px-2.5 py-0.5 rounded-full">
                Active Mentor
              </div>
            </div>

            {/* Conversation Content Mockup */}
            <div className="p-6 flex flex-col gap-4 max-h-[360px] overflow-hidden bg-white">
              {/* Msg 1 */}
              <div className="flex justify-start">
                <div className="bg-[#F6F5F4] text-[#37352F] rounded-2xl rounded-bl-md px-4 py-3 text-sm max-w-[85%] leading-relaxed">
                  Hi Chioma! I see you are in your 3rd year studying Computer Science at UNILAG. What kind of career path or opportunities are you hoping to target after graduation?
                </div>
              </div>
              {/* Msg 2 */}
              <div className="flex justify-end">
                <div className="bg-[#0075DE] text-white rounded-2xl rounded-br-md px-4 py-3 text-sm max-w-[85%] leading-relaxed">
                  I really want to get into software engineering, but I don&apos;t have any internship experience yet. I&apos;m looking for fellowships or internships that accept beginners.
                </div>
              </div>
              {/* Msg 3 */}
              <div className="flex justify-start">
                <div className="bg-[#F6F5F4] text-[#37352F] rounded-2xl rounded-bl-md px-4 py-3 text-sm max-w-[85%] leading-relaxed">
                  That is a very common starting point. Instead of just browsing lists, let&apos;s build a custom roadmap. I recommend looking at the **ALX Software Engineering Fellowship** or the **Google STEP Internship**. 
                  <div className="mt-3 p-3.5 bg-white border border-[#E9E9E7] rounded-lg flex items-center justify-between gap-3 hover:border-[#62AEF0] transition-colors cursor-pointer">
                    <div>
                      <span className="text-xs font-bold text-[#AD6DED] bg-[#F3EDFF] px-2 py-0.5 rounded-full uppercase">Fellowship</span>
                      <h4 className="text-sm font-semibold text-[#000000] mt-1.5">ALX Software Engineering Programme</h4>
                      <p className="text-xs text-[#787774] mt-0.5">Structured fellowship offering intensive coding curriculum.</p>
                    </div>
                    <ArrowUpRight size={16} className="text-[#B4B4B0] shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Principles / Value Prop */}
      <section id="features" className="py-24 px-6 border-b border-[#E9E9E7] bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#000000] tracking-tight">The AgentPath Philosophy</h2>
            <p className="text-sm text-[#787774] mt-2 max-w-xl mx-auto">How we approach mentoring and guidance differently than standard portals.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#E6F3FE] text-[#0075DE] flex items-center justify-center">
                <Users size={20} />
              </div>
              <h3 className="text-[#000000] font-semibold text-base">Agency-First AI</h3>
              <p className="text-[#787774] text-sm leading-relaxed">
                We never lead with lists. The AI always asks what you think and what your actual goals are before suggesting matching opportunities.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#F3EDFF] text-[#AD6DED] flex items-center justify-center">
                <Award size={20} />
              </div>
              <h3 className="text-[#000000] font-semibold text-base">Curated Opportunities</h3>
              <p className="text-[#787774] text-sm leading-relaxed">
                Scholarships, fellowships, and internships handpicked and targeted specifically for first-generation Nigerian university students.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FFF5E0] text-[#FF8A33] flex items-center justify-center">
                <BookOpen size={20} />
              </div>
              <h3 className="text-[#000000] font-semibold text-base">Interactive Roadmaps</h3>
              <p className="text-[#787774] text-sm leading-relaxed">
                Break down application requirements into actionable milestones. Plan out essays, references, and test submissions easily.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 border-b border-[#E9E9E7] bg-[#F6F5F4]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#000000] tracking-tight">How it works</h2>
            <p className="text-sm text-[#787774] mt-2">Three steps to navigating your opportunities with confidence.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-[#E9E9E7] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <span className="text-xs font-bold text-[#0075DE] bg-[#E6F3FE] px-2.5 py-1 rounded-full">Step 01</span>
              <h3 className="text-[#000000] font-semibold text-base mt-4 mb-2">Build Your Profile</h3>
              <p className="text-[#787774] text-xs leading-relaxed">
                Input your university, field of study, and high-level aspirations. Our system uses this to tailor the entire mentorship experience.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#E9E9E7] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <span className="text-xs font-bold text-[#AD6DED] bg-[#F3EDFF] px-2.5 py-1 rounded-full">Step 02</span>
              <h3 className="text-[#000000] font-semibold text-base mt-4 mb-2">Converse & Discover</h3>
              <p className="text-[#787774] text-xs leading-relaxed">
                Chat with the AI mentor to align your interests. Learn which fellowships, grants, or scholarships are ideal for you.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#E9E9E7] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <span className="text-xs font-bold text-[#FF8A33] bg-[#FFF5E0] px-2.5 py-1 rounded-full">Step 03</span>
              <h3 className="text-[#000000] font-semibold text-base mt-4 mb-2">Track & Apply</h3>
              <p className="text-[#787774] text-xs leading-relaxed">
                Generate a structured roadmap with specific application milestones, due dates, and links. Never miss a deadline again.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Detailed Testimonial Callout */}
      <section className="py-24 px-6 bg-white border-b border-[#E9E9E7]">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#F9F9F8] border border-[#E9E9E7] p-8 rounded-xl flex flex-col md:flex-row gap-6 items-start">
            <div className="w-12 h-12 rounded-full bg-[#0075DE] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
              TO
            </div>
            <div>
              <blockquote className="text-base text-[#37352F] leading-relaxed italic mb-4">
                &ldquo;Before AgentPath, finding matching international scholarships felt like looking for a needle in a haystack. The conversational AI didn&apos;t just dump lists of links on me—it actually asked about my goals and helped me structure my essays step by step.&rdquo;
              </blockquote>
              <cite className="not-italic">
                <span className="block font-semibold text-sm text-[#000000]">Tobi Oladele</span>
                <span className="block text-xs text-[#787774]">Mechanical Engineering Student, University of Ibadan</span>
              </cite>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call to Action */}
      <section className="py-24 px-6 bg-[#F6F5F4] text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl font-bold text-[#000000] mb-4">Empower your academic journey today</h2>
          <p className="text-base text-[#787774] max-w-md mb-8 leading-relaxed">
            Join other Nigerian students using AgentPath to find and apply for life-changing opportunities.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center gap-1.5 px-7 py-3 bg-[#0075DE] text-white rounded-lg font-semibold text-sm hover:bg-[#097FE8] transition-all duration-150 shadow-[0_1px_3px_rgba(0,0,0,0.05)] cursor-pointer"
          >
            Create Your Free Account
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* 7. Detailed Footer */}
      <footer className="bg-white border-t border-[#E9E9E7] py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-left">
          <div className="flex flex-col gap-2.5">
            <span className="font-semibold text-xs text-[#B4B4B0] uppercase tracking-wider">Product</span>
            <a href="#features" className="text-xs text-[#787774] hover:text-[#000000] transition-colors">Features</a>
            <a href="#how-it-works" className="text-xs text-[#787774] hover:text-[#000000] transition-colors">How It Works</a>
            <Link href="/auth/login" className="text-xs text-[#787774] hover:text-[#000000] transition-colors">Sign In</Link>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="font-semibold text-xs text-[#B4B4B0] uppercase tracking-wider">Resources</span>
            <span className="text-xs text-[#B4B4B0] flex items-center gap-1">Nigeria Portal <Lock size={10} /></span>
            <span className="text-xs text-[#B4B4B0] flex items-center gap-1">Student Forum <Lock size={10} /></span>
            <span className="text-xs text-[#B4B4B0] flex items-center gap-1">Mentorship Guide <Lock size={10} /></span>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="font-semibold text-xs text-[#B4B4B0] uppercase tracking-wider">About</span>
            <span className="text-xs text-[#787774]">Our Mission</span>
            <span className="text-xs text-[#787774]">Contact Support</span>
            <span className="text-xs text-[#787774]">Careers</span>
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-1.5">
              <Image src="/logo.png" alt="AgentPath" width={18} height={18} />
              <span className="font-bold text-xs text-[#000000]">AgentPath</span>
            </div>
            <p className="text-[10px] text-[#B4B4B0] leading-relaxed">
              Guidance and opportunities curated for first-generation Nigerian university students.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto border-t border-[#E9E9E7] pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#B4B4B0]">
          <p>© {new Date().getFullYear()} AgentPath. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-[#787774] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#787774] cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
