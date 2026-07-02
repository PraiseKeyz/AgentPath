'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function VerifyEmailPage() {
  const router = useRouter()
  const [verifying, setVerifying] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Mock verify request
    const timer = setTimeout(() => {
      setSuccess(true)
      setVerifying(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.04)] p-8 text-center flex flex-col items-center">
        <h1 className="text-2xl font-bold text-[#000000] mb-2">Verify email</h1>
        
        {verifying ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="w-8 h-8 border-3 border-[#E9E9E7] border-t-[#0075DE] rounded-full animate-spin" />
            <p className="text-[#787774] text-sm">We&apos;re confirming your email address now.</p>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-12 h-12 rounded-full bg-[#E6F3FE] text-[#0075DE] flex items-center justify-center font-bold text-lg mb-2">
              ✓
            </div>
            <p className="text-[#37352F] text-sm font-medium">Your email has been verified!</p>
            <Link
              href="/onboarding"
              className="mt-4 inline-flex items-center justify-center w-full bg-[#0075DE] text-white rounded-lg py-2.5 font-semibold text-sm hover:bg-[#097FE8] transition-all duration-200 cursor-pointer"
            >
              Continue to Onboarding
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4">
            <p className="text-[#F64932] text-sm bg-[#FEF3F1] px-3 py-2 rounded-lg">{error || 'Verification link expired or invalid.'}</p>
            <Link href="/auth/login" className="text-[#0075DE] text-sm font-semibold hover:underline">
              Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
