'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { register } from '@/services/auth.service'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(name, email, password)
      router.push('/onboarding')
    } catch (err: any) {
      setError(err.message ?? 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm animate-fade-in">
      <div className="bg-white rounded-xl border border-[#E9E9E7] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-8">
        <h1 className="text-2xl font-extrabold text-[#000000] tracking-tight mb-1">Create account</h1>
        <p className="text-[#787774] text-sm mb-6 font-medium">Join AgentPath and meet your AI mentor.</p>

        {/* Social Login Mock */}
        <button
          type="button"
          disabled
          className="w-full flex items-center justify-center gap-2 border border-[#E9E9E7] rounded-lg py-2.5 px-4 text-sm font-semibold text-[#787774] bg-[#F6F5F4] opacity-60 cursor-not-allowed mb-5 transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Sign up with Google
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="h-px bg-[#E9E9E7] flex-1" />
          <span className="text-[11px] font-bold text-[#B4B4B0] uppercase tracking-wider">or</span>
          <div className="h-px bg-[#E9E9E7] flex-1" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-[#37352F] uppercase tracking-wider mb-1.5" htmlFor="reg-name">
              Full Name
            </label>
            <input
              id="reg-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Adaeze Okafor"
              className="w-full border border-[#E9E9E7] rounded-lg px-3 py-2 text-sm bg-white text-[#000000] placeholder:text-[#B4B4B0] focus:outline-none focus:ring-2 focus:ring-[#0075DE] focus:border-[#0075DE] transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#37352F] uppercase tracking-wider mb-1.5" htmlFor="reg-email">
              Email Address
            </label>
            <input
              id="reg-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu.ng"
              className="w-full border border-[#E9E9E7] rounded-lg px-3 py-2 text-sm bg-white text-[#000000] placeholder:text-[#B4B4B0] focus:outline-none focus:ring-2 focus:ring-[#0075DE] focus:border-[#0075DE] transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#37352F] uppercase tracking-wider mb-1.5" htmlFor="reg-password">
              Password
            </label>
            <input
              id="reg-password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-[#E9E9E7] rounded-lg px-3 py-2 text-sm bg-white text-[#000000] placeholder:text-[#B4B4B0] focus:outline-none focus:ring-2 focus:ring-[#0075DE] focus:border-[#0075DE] transition-all duration-200"
            />
            <span className="block text-[10px] text-[#787774] mt-1.5 font-medium">Must be at least 8 characters.</span>
          </div>
          {error && (
            <p className="text-[#F64932] text-xs font-medium bg-[#FEF3F1] border border-[#F77463]/25 px-3 py-2.5 rounded-lg animate-fade-in">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0075DE] text-white rounded-lg py-2.5 font-bold text-sm hover:bg-[#097FE8] active:bg-[#005BAB] disabled:opacity-50 transition-all duration-150 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.05)] mt-2"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      </div>

      <p className="mt-6 text-sm text-center text-[#787774] font-medium">
        Already have an account?{' '}
        <Link href="/login" className="text-[#0075DE] font-semibold hover:text-[#005BAB] transition-colors underline decoration-[#0075DE]/30 hover:decoration-[#005BAB]">
          Sign in
        </Link>
      </p>
    </div>
  )
}
