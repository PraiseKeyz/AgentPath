'use client'

import Link from 'next/link'
import Image from 'next/image'
import React, { useState } from 'react'
import {
  ArrowRight,
  Sparkles,
  Lock,
  MessageSquare,
  Compass,
  Map,
  ChevronDown,
  User,
  GraduationCap
} from 'lucide-react'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'roadmap' | 'opps'>('chat')

  return (
    <div className="min-h-screen bg-[#F6F5F4] text-[#000000] font-sans selection:bg-[#E6F3FE] antialiased">
      {/* 1. Header / Navigation (Matches Notion Header) */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E9E9E7] px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/logo.png" alt="AgentPath Logo" width={20} height={20} className="object-contain" />
              <span className="text-[#000000] font-extrabold text-base tracking-tight">AgentPath</span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-[#37352F]">
              <a href="#features" className="hover:text-black hover:bg-[#F6F5F4] px-2.5 py-1 rounded-md transition-colors flex items-center gap-1">
                Product <ChevronDown size={12} className="text-[#787774]" />
              </a>
              <a href="#features" className="hover:text-black hover:bg-[#F6F5F4] px-2.5 py-1 rounded-md transition-colors flex items-center gap-1">
                Solutions <ChevronDown size={12} className="text-[#787774]" />
              </a>
              <a href="#how-it-works" className="hover:text-black hover:bg-[#F6F5F4] px-2.5 py-1 rounded-md transition-colors">Resources</a>
              <a href="#pricing" className="hover:text-black hover:bg-[#F6F5F4] px-2.5 py-1 rounded-md transition-colors">Pricing</a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-semibold text-[#37352F] hover:text-black hover:bg-[#F6F5F4] px-3 py-1.5 rounded-md transition-all"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center text-xs font-bold bg-[#0075DE] text-white hover:bg-[#097FE8] px-4 py-2 rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-all duration-150"
            >
              Get AgentPath free
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section (Notion Centered Hero with Floating Hand-drawn Badges) */}
      <section className="bg-white pt-20 pb-28 px-6 border-b border-[#E9E9E7] relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center relative z-10">
          
          {/* Announcement pill */}
          <div className="inline-flex items-center gap-1.5 bg-[#FFF2C2] text-xs font-bold text-[#8F6B00] border border-[#FCEB9C] px-3.5 py-1.5 rounded-full mb-8 hover:bg-[#FCEB9C] cursor-pointer transition-colors duration-200">
            <Sparkles size={12} className="text-[#8F6B00]" />
            <span>Designed for first-generation Nigerian university students</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#000000] leading-[1.08] max-w-4xl mb-6">
            Empower your goals. <br />
            Find opportunities. <br />
            Automate your application roadmap.
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#37352F] max-w-2xl mb-8 leading-relaxed font-medium">
            Your conversational AI mentor. We put your goals first, matching you with hand-selected scholarships, fellowships, and internships.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-16">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-1.5 px-6 py-3 bg-[#0075DE] text-white rounded-lg font-bold text-sm hover:bg-[#097FE8] transition-all duration-150 shadow-[0_1px_2px_rgba(0,0,0,0.05)] cursor-pointer"
            >
              Get AgentPath free
              <ArrowRight size={14} />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#37352F] rounded-lg font-bold text-sm border border-[#E9E9E7] hover:bg-[#F6F5F4] transition-all duration-150 cursor-pointer"
            >
              See how it works
            </a>
          </div>

          {/* Interactive Workspace Mockup (Notion-style App Window) */}
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.06)] overflow-hidden border border-[#E9E9E7] text-left">
            
            {/* Tab Controls / Header */}
            <div className="bg-[#F6F5F4] border-b border-[#E9E9E7] px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#E9E9E7]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#E9E9E7]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#E9E9E7]" />
                <span className="text-xs text-[#787774] ml-2 font-medium">AgentPath Workspace</span>
              </div>
              <div className="flex gap-1.5 bg-[#E9E9E7]/60 p-1 rounded-md">
                <button 
                  onClick={() => setActiveTab('chat')}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded transition-all ${activeTab === 'chat' ? 'bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] text-black' : 'text-[#787774] hover:text-black'}`}
                >
                  AI Mentor Chat
                </button>
                <button 
                  onClick={() => setActiveTab('roadmap')}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded transition-all ${activeTab === 'roadmap' ? 'bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] text-black' : 'text-[#787774] hover:text-black'}`}
                >
                  Application Roadmap
                </button>
                <button 
                  onClick={() => setActiveTab('opps')}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded transition-all ${activeTab === 'opps' ? 'bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] text-black' : 'text-[#787774] hover:text-black'}`}
                >
                  Curated Board
                </button>
              </div>
            </div>

            {/* Mockup Workspace Contents */}
            <div className="min-h-[380px] bg-white flex">
              {/* Mockup Sidebar */}
              <div className="w-48 border-r border-[#E9E9E7] bg-[#F6F5F4] p-3 flex flex-col justify-between hidden sm:flex">
                <div className="flex flex-col gap-1 text-[#37352F]">
                  <div className="text-xs font-bold text-[#787774] px-2 py-1 mb-1">WORKSPACE</div>
                  <div className={`flex items-center gap-2 text-xs font-semibold px-2 py-1.5 rounded-md cursor-pointer ${activeTab === 'chat' ? 'bg-[#E9E9E7]' : 'hover:bg-[#E9E9E7]/50'}`} onClick={() => setActiveTab('chat')}>
                    <MessageSquare size={13} className="text-[#0075DE]" />
                    <span>AI Mentor</span>
                  </div>
                  <div className={`flex items-center gap-2 text-xs font-semibold px-2 py-1.5 rounded-md cursor-pointer ${activeTab === 'opps' ? 'bg-[#E9E9E7]' : 'hover:bg-[#E9E9E7]/50'}`} onClick={() => setActiveTab('opps')}>
                    <Compass size={13} className="text-[#AD6DED]" />
                    <span>Opportunities</span>
                  </div>
                  <div className={`flex items-center gap-2 text-xs font-semibold px-2 py-1.5 rounded-md cursor-pointer ${activeTab === 'roadmap' ? 'bg-[#E9E9E7]' : 'hover:bg-[#E9E9E7]/50'}`} onClick={() => setActiveTab('roadmap')}>
                    <Map size={13} className="text-[#FF8A33]" />
                    <span>Roadmap</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 border-t border-[#E9E9E7] text-xs text-[#37352F]">
                  <div className="w-5 h-5 rounded-full bg-[#0075DE] text-white flex items-center justify-center font-bold text-[9px]">
                    CO
                  </div>
                  <span className="font-semibold truncate">Chioma Obi</span>
                </div>
              </div>

              {/* Mockup Main Workspace Panel */}
              <div className="flex-1 p-6 bg-white overflow-y-auto">
                {activeTab === 'chat' && (
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#F6F5F4] border border-[#E9E9E7] flex items-center justify-center text-xs shrink-0">🤖</div>
                      <div className="bg-[#F6F5F4] text-[#37352F] text-xs px-3 py-2.5 rounded-lg max-w-[85%] border border-[#E9E9E7]">
                        Welcome back Chioma! Let&apos;s finalize your application steps for the **MTN Foundation Scholarship**. Based on your goals, you need to prepare a reference letter by next Monday.
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <div className="bg-[#E6F3FE] text-[#0075DE] text-xs px-3 py-2.5 rounded-lg max-w-[85%] border border-[#D3E5EF]">
                        Thanks! How do I structure my recommendation email to my academic advisor?
                      </div>
                      <div className="w-6 h-6 rounded-full bg-[#0075DE] text-white flex items-center justify-center text-[10px] shrink-0 font-bold">CO</div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#F6F5F4] border border-[#E9E9E7] flex items-center justify-center text-xs shrink-0">🤖</div>
                      <div className="bg-[#F6F5F4] text-[#37352F] text-xs px-3 py-2.5 rounded-lg max-w-[85%] border border-[#E9E9E7] flex flex-col gap-2">
                        <span>Here is a template you can use:</span>
                        <div className="bg-white p-2 border border-[#E9E9E7] rounded font-mono text-[10px] text-[#787774]">
                          Subject: Reference Request - Chioma Obi [UNILAG]<br />
                          Dear Professor... I am applying for the MTN Foundation Scholarship...
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'roadmap' && (
                  <div>
                    <div className="flex items-center justify-between border-b border-[#E9E9E7] pb-3 mb-4">
                      <h3 className="text-sm font-bold text-black">Scholarship Roadmap</h3>
                      <span className="text-[11px] font-bold text-[#0075DE] bg-[#E6F3FE] px-2 py-0.5 rounded-full">2 of 4 Completed</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3 p-2.5 hover:bg-[#F6F5F4] rounded-lg transition-colors border border-[#E9E9E7]/60">
                        <div className="w-4 h-4 rounded-full border border-[#0075DE] flex items-center justify-center text-[#0075DE] bg-[#E6F3FE] text-[8px] font-extrabold shrink-0">✓</div>
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-black">Select Scholarship Target</div>
                          <div className="text-[10px] text-[#787774]">Chosen: MTN Foundation Scholarship</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2.5 hover:bg-[#F6F5F4] rounded-lg transition-colors border border-[#E9E9E7]/60">
                        <div className="w-4 h-4 rounded-full border border-[#0075DE] flex items-center justify-center text-[#0075DE] bg-[#E6F3FE] text-[8px] font-extrabold shrink-0">✓</div>
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-black">Confirm Academic Eligibility</div>
                          <div className="text-[10px] text-[#787774]">GPA is above 3.5 minimum requirement</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2.5 bg-white rounded-lg border border-[#E9E9E7] shadow-sm">
                        <div className="w-4 h-4 rounded-full border-2 border-[#E9E9E7] shrink-0" />
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-black">Request Reference Letter</div>
                          <div className="text-[10px] text-[#FF8A33]">Due: July 8, 2026</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2.5 hover:bg-[#F6F5F4] rounded-lg transition-colors border border-dashed border-[#E9E9E7]">
                        <div className="w-4 h-4 rounded-full border-2 border-[#E9E9E7] shrink-0" />
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-[#787774]">Submit Essay Draft for Review</div>
                          <div className="text-[10px] text-[#B4B4B0]">No due date set</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'opps' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-white border border-[#E9E9E7] rounded-lg hover:border-[#62AEF0] cursor-pointer transition-colors shadow-sm">
                      <span className="text-[10px] font-bold text-[#0075DE] bg-[#E6F3FE] px-2 py-0.5 rounded-full uppercase">Scholarship</span>
                      <h4 className="text-xs font-bold text-black mt-2">MTN Foundation Scholarship</h4>
                      <p className="text-[10px] text-[#787774] mt-1">N300,000 yearly stipend for science/tech students in public universities.</p>
                    </div>
                    <div className="p-3 bg-white border border-[#E9E9E7] rounded-lg hover:border-[#62AEF0] cursor-pointer transition-colors shadow-sm">
                      <span className="text-[10px] font-bold text-[#AD6DED] bg-[#F3EDFF] px-2 py-0.5 rounded-full uppercase">Fellowship</span>
                      <h4 className="text-xs font-bold text-black mt-2">ALX Software Fellowship</h4>
                      <p className="text-[10px] text-[#787774] mt-1">Intensive programming bootcamp for young professionals across Africa.</p>
                    </div>
                    <div className="p-3 bg-white border border-[#E9E9E7] rounded-lg hover:border-[#62AEF0] cursor-pointer transition-colors shadow-sm">
                      <span className="text-[10px] font-bold text-[#FF8A33] bg-[#FFF5E0] px-2 py-0.5 rounded-full uppercase">Internship</span>
                      <h4 className="text-xs font-bold text-black mt-2">Google STEP Internship</h4>
                      <p className="text-[10px] text-[#787774] mt-1">12-week development program for first- and second-year undergraduate students.</p>
                    </div>
                    <div className="p-3 bg-white border border-[#E9E9E7] rounded-lg hover:border-[#62AEF0] cursor-pointer transition-colors shadow-sm">
                      <span className="text-[10px] font-bold text-[#0075DE] bg-[#E6F3FE] px-2 py-0.5 rounded-full uppercase">Scholarship</span>
                      <h4 className="text-xs font-bold text-black mt-2">NLNG Undergraduate Scholarship</h4>
                      <p className="text-[10px] text-[#787774] mt-1">Full tuition and living stipend for outstanding federal university students.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section: "Ask your on-demand mentor" (Notionsplit layout style) */}
      <section id="features" className="py-24 px-6 bg-[#F6F5F4]">
        <div className="max-w-5xl mx-auto flex flex-col gap-16">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold text-black tracking-tight leading-none mb-4">
              Ask your on-demand mentor.
            </h2>
            <p className="text-sm text-[#37352F] font-medium max-w-xl">
              Ditch the generic AI slop. AgentPath guides you through specific, actionable tasks rather than just outputting generic list links.
            </p>
          </div>

          {/* Split Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Card 1: AI Chat (Matches gold backdrop split card in screenshots) */}
            <div className="bg-white border border-[#E9E9E7] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[460px]">
              {/* Left text portion */}
              <div className="p-10 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#AD6DED] uppercase tracking-wider bg-[#F3EDFF] px-2.5 py-1 rounded-full">
                    Mentor Agent
                  </span>
                  <h3 className="text-2xl font-extrabold text-black mt-4 mb-4 leading-tight">
                    You set the goals. Your mentor does the heavy search.
                  </h3>
                  <p className="text-sm text-[#787774] leading-relaxed">
                    Say goodbye to endless Google tabs. The conversational assistant extracts criteria, checks your eligibility automatically, and suggests correct matches.
                  </p>
                </div>
                
                {/* Notion Circle arrow button */}
                <div className="mt-8 flex items-center gap-2 text-xs font-bold text-black hover:text-[#0075DE] transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white group-hover:bg-[#0075DE] transition-colors">
                    <ArrowRight size={18} strokeWidth={2.5} />
                  </div>
                  <span>Start Chatting</span>
                </div>
              </div>

              {/* Right mockup portion (Warm Gold background) */}
              <div className="bg-[#FFD369] p-8 flex items-center justify-center border-t border-[#E9E9E7]">
                <div className="bg-white rounded-lg p-5 w-full shadow-md border border-[#E9E9E7]/80 text-xs text-[#37352F]">
                  <div className="flex items-center gap-2 mb-3.5 pb-2 border-b border-[#F6F5F4]">
                    <div className="w-4 h-4 rounded bg-[#0075DE] text-white flex items-center justify-center font-bold text-[8px]">AP</div>
                    <span className="font-bold text-black text-[11px]">How can I help you today?</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="p-2 border border-[#E9E9E7] rounded bg-[#F6F5F4] hover:bg-[#E9E9E7]/40 cursor-pointer text-[10px] font-semibold flex items-center gap-2">
                      <GraduationCap size={12} className="text-[#0075DE]" />
                      <span>Explore federal scholarships in Nigeria</span>
                    </div>
                    <div className="p-2 border border-[#E9E9E7] rounded bg-[#F6F5F4] hover:bg-[#E9E9E7]/40 cursor-pointer text-[10px] font-semibold flex items-center gap-2">
                      <User size={12} className="text-[#AD6DED]" />
                      <span>Review my scholarship statement draft</span>
                    </div>
                    <div className="p-2 border border-[#E9E9E7] rounded bg-[#F6F5F4] hover:bg-[#E9E9E7]/40 cursor-pointer text-[10px] font-semibold flex items-center gap-2">
                      <Map size={12} className="text-[#FF8A33]" />
                      <span>Generate application roadmap checklist</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Roadmap split card (Matches soft blue backdrop split card in screenshots) */}
            <div className="bg-white border border-[#E9E9E7] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[460px]">
              {/* Left text portion */}
              <div className="p-10 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#FF8A33] uppercase tracking-wider bg-[#FFF5E0] px-2.5 py-1 rounded-full">
                    Roadmaps
                  </span>
                  <h3 className="text-2xl font-extrabold text-black mt-4 mb-4 leading-tight">
                    Keep applications moving 24/7.
                  </h3>
                  <p className="text-sm text-[#787774] leading-relaxed">
                    Build step-by-step milestones to stay on schedule. Track transcripts, referee recommendations, essay submissions, and test deadlines.
                  </p>
                </div>
                
                {/* Notion Circle arrow button */}
                <div className="mt-8 flex items-center gap-2 text-xs font-bold text-black hover:text-[#0075DE] transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white group-hover:bg-[#0075DE] transition-colors">
                    <ArrowRight size={18} strokeWidth={2.5} />
                  </div>
                  <span>Explore Roadmaps</span>
                </div>
              </div>

              {/* Right mockup portion (Soft Blue background) */}
              <div className="bg-[#D3E5EF] p-8 flex items-center justify-center border-t border-[#E9E9E7]">
                <div className="bg-white rounded-lg p-5 w-full shadow-md border border-[#E9E9E7]/80 text-xs text-[#37352F] flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-black text-[11px]">Milestones & Tasks</span>
                    <span className="text-[9px] font-bold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">60% Complete</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded bg-green-100 border border-green-300 text-green-700 flex items-center justify-center font-bold text-[8px]">✓</div>
                      <span className="text-[10px] font-medium text-black line-through">Request official transcript from registrar</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded bg-green-100 border border-green-300 text-green-700 flex items-center justify-center font-bold text-[8px]">✓</div>
                      <span className="text-[10px] font-medium text-black line-through">Check Minimum GPA Requirements</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-sm border border-[#E9E9E7] shrink-0" />
                      <span className="text-[10px] font-semibold text-black">Draft essay: &ldquo;My academic goals&rdquo;</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-sm border border-[#E9E9E7] shrink-0" />
                      <span className="text-[10px] font-semibold text-black">Send reference email to Advisor</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Core Principles Section (Matches Notion white feature grids) */}
      <section className="py-24 px-6 bg-white border-b border-[#E9E9E7]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-black tracking-tight leading-none mb-3">Why AgentPath?</h2>
            <p className="text-sm text-[#787774]">Built with intention for first-generation Nigerian university students.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-3.5 p-6 rounded-xl hover:bg-[#F6F5F4] transition-colors border border-transparent hover:border-[#E9E9E7]">
              <div className="w-10 h-10 rounded-lg bg-[#E6F3FE] text-[#0075DE] flex items-center justify-center font-bold">
                🇳🇬
              </div>
              <h3 className="text-black font-extrabold text-base">Nigerian-Centric Database</h3>
              <p className="text-[#37352F] text-xs leading-relaxed font-medium">
                We aggregate local corporate scholarships (MTN, NLNG, Shell) alongside international fellowships tailored specifically for West African scholars.
              </p>
            </div>

            <div className="flex flex-col gap-3.5 p-6 rounded-xl hover:bg-[#F6F5F4] transition-colors border border-transparent hover:border-[#E9E9E7]">
              <div className="w-10 h-10 rounded-lg bg-[#F3EDFF] text-[#AD6DED] flex items-center justify-center font-bold">
                🎯
              </div>
              <h3 className="text-black font-extrabold text-base">Agency-First Design</h3>
              <p className="text-[#37352F] text-xs leading-relaxed font-medium">
                We never lead with raw list dumps. The assistant holds an active dialogue to confirm your field, constraints, and aspirations before recommending.
              </p>
            </div>

            <div className="flex flex-col gap-3.5 p-6 rounded-xl hover:bg-[#F6F5F4] transition-colors border border-transparent hover:border-[#E9E9E7]">
              <div className="w-10 h-10 rounded-lg bg-[#FFF5E0] text-[#FF8A33] flex items-center justify-center font-bold">
                🎓
              </div>
              <h3 className="text-black font-extrabold text-base">Academic Mentorship</h3>
              <p className="text-[#37352F] text-xs leading-relaxed font-medium">
                Not just links. Our AI helps you outline essays, format CVs, write formal reference requests, and prepare for interviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Clean, elegant Testimonial (Matches minimalist quote cards) */}
      <section className="py-24 px-6 bg-[#F6F5F4] border-b border-[#E9E9E7]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <span className="text-2xl">💡</span>
          </div>
          <blockquote className="text-lg md:text-xl font-medium text-black leading-relaxed mb-6">
            &ldquo;Before AgentPath, finding international scholarships felt like looking for a needle in a haystack. The AI didn&apos;t just dump lists of links on me—it actually asked about my goals and helped me structure my application documents step by step.&rdquo;
          </blockquote>
          <cite className="not-italic">
            <span className="block font-bold text-sm text-black">Tobi Oladele</span>
            <span className="block text-xs text-[#787774] mt-0.5">Mechanical Engineering, University of Ibadan</span>
          </cite>
        </div>
      </section>

      {/* 6. Pricing / Access Section */}
      <section id="pricing" className="py-24 px-6 bg-white text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl font-extrabold text-[#000000] tracking-tight leading-none mb-3">Empower your academic journey today.</h2>
          <p className="text-sm text-[#37352F] font-medium max-w-md mb-8">
            Create your account to start charting your goals and generating milestone roadmaps.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-1.5 px-7 py-3 bg-[#0075DE] text-white rounded-lg font-bold text-sm hover:bg-[#097FE8] transition-all duration-150 shadow-[0_1px_2px_rgba(0,0,0,0.05)] cursor-pointer"
            >
              Start Chatting Free
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Detailed Footer (Matches Notion Footer exactly) */}
      <footer className="bg-[#F6F5F4] border-t border-[#E9E9E7] py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-left">
          <div className="flex flex-col gap-2.5">
            <span className="font-extrabold text-xs text-[#787774] uppercase tracking-wider">Product</span>
            <a href="#features" className="text-xs font-semibold text-[#37352F] hover:text-black transition-colors">Features</a>
            <a href="#how-it-works" className="text-xs font-semibold text-[#37352F] hover:text-black transition-colors">How It Works</a>
            <Link href="/login" className="text-xs font-semibold text-[#37352F] hover:text-black transition-colors">Sign In</Link>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="font-extrabold text-xs text-[#787774] uppercase tracking-wider">Resources</span>
            <span className="text-xs font-semibold text-[#787774] flex items-center gap-1">Nigeria Portal <Lock size={10} /></span>
            <span className="text-xs font-semibold text-[#787774] flex items-center gap-1">Student Forum <Lock size={10} /></span>
            <span className="text-xs font-semibold text-[#787774] flex items-center gap-1">Mentorship Guide <Lock size={10} /></span>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="font-extrabold text-xs text-[#787774] uppercase tracking-wider">About</span>
            <span className="text-xs font-semibold text-[#37352F] hover:text-black cursor-pointer">Our Mission</span>
            <span className="text-xs font-semibold text-[#37352F] hover:text-black cursor-pointer">Contact Support</span>
            <span className="text-xs font-semibold text-[#37352F] hover:text-black cursor-pointer">Careers</span>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="AgentPath" width={18} height={18} />
              <span className="font-extrabold text-sm text-[#000000] tracking-tight">AgentPath</span>
            </div>
            <p className="text-[10px] text-[#787774] leading-relaxed">
              Guidance and opportunities curated specifically for West African undergraduate and graduate scholars.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto border-t border-[#E9E9E7] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#B4B4B0] font-semibold">
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
