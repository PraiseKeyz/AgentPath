'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiPath } from '@/lib/api/client'

type Status = 'pending' | 'success' | 'error'

export const VerifyEmailStatus: React.FC = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [status, setStatus] = useState<Status>('pending')
  const [errorMessage, setErrorMessage] = useState('')
  const [email, setEmail] = useState('')
  const [resendState, setResendState] = useState<'idle' | 'loading' | 'sent'>('idle')
  const attempted = useRef(false)

  useEffect(() => {
    if (!token || attempted.current) return
    attempted.current = true

    const verify = async () => {
      try {
        const res = await fetch(apiPath('/auth/verify-email'), {
          body: JSON.stringify({ token }),
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'This verification link is invalid or has expired.')
        setStatus('success')
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : 'Something went wrong')
        setStatus('error')
      }
    }

    void verify()
  }, [token])

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault()
    setResendState('loading')

    try {
      await fetch(apiPath('/auth/resend-verification'), {
        body: JSON.stringify({ email }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
    } finally {
      setResendState('sent')
    }
  }

  if (!token) {
    return <p className="text-sm text-destructive">This verification link is missing a token.</p>
  }

  if (status === 'pending') {
    return <p className="text-sm text-brand-black/65">Verifying your email...</p>
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-brand-black/75">
          Your email has been verified. You&apos;re all set.
        </p>
        <Link className="text-sm font-semibold text-brand-primary underline" href="/dashboard">
          Go to dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-destructive">{errorMessage}</p>
      {resendState === 'sent' ? (
        <p className="text-sm text-brand-black/75">
          If that account is unverified, a new verification link has been sent.
        </p>
      ) : (
        <form className="flex flex-col gap-3" onSubmit={handleResend}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Resend verification to</Label>
            <Input
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              value={email}
            />
          </div>
          <Button disabled={resendState === 'loading'} type="submit">
            {resendState === 'loading' ? 'Sending...' : 'Resend verification link'}
          </Button>
        </form>
      )}
    </div>
  )
}
