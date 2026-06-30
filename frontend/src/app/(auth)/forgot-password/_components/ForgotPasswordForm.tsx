'use client'

import Link from 'next/link'
import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import { BackLink } from '@/components/ui/back-link'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiPath } from '@/lib/api/client'

export const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await fetch(apiPath('/auth/forgot-password'), {
        body: JSON.stringify({ email }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
    } finally {
      setLoading(false)
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-brand-black/75">
          If an account exists for <strong>{email}</strong>, a password reset link has been sent.
          Check your inbox (and spam folder).
        </p>
        <BackLink className="text-brand-primary underline" href="/login">
          Back to log in
        </BackLink>
      </div>
    )
  }

  return (
    <form className="flex w-full max-w-md flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          required
          type="email"
          value={email}
        />
      </div>
      <Button className="w-full" disabled={loading} type="submit">
        {loading ? 'Sending...' : 'Send reset link'}
      </Button>
      <p className="text-sm text-brand-black/65">
        Remembered your password?{' '}
        <Link className="font-semibold text-brand-primary underline" href="/login">
          Log in
        </Link>
      </p>
    </form>
  )
}
