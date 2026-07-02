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
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.04)] p-8">
        <h1 className="text-2xl font-bold text-[#000000] mb-1">Create your account</h1>
        <p className="text-[#787774] text-sm mb-6">Join AgentPath and meet your AI mentor.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-[#37352F] mb-1.5" htmlFor="reg-name">
              Full name
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
            <label className="block text-sm font-medium text-[#37352F] mb-1.5" htmlFor="reg-email">
              Email
            </label>
            <input
              id="reg-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              className="w-full border border-[#E9E9E7] rounded-lg px-3 py-2 text-sm bg-white text-[#000000] placeholder:text-[#B4B4B0] focus:outline-none focus:ring-2 focus:ring-[#0075DE] focus:border-[#0075DE] transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#37352F] mb-1.5" htmlFor="reg-password">
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
          </div>
          {error && (
            <p className="text-[#F64932] text-sm bg-[#FEF3F1] px-3 py-2 rounded-lg">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0075DE] text-white rounded-lg py-2.5 font-semibold text-sm hover:bg-[#097FE8] disabled:opacity-50 transition-all duration-200 cursor-pointer"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      </div>

      <p className="mt-6 text-sm text-center text-[#787774]">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-[#0075DE] font-semibold hover:text-[#005BAB] transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  )
}
