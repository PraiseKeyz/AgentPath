import type { Metadata } from 'next'
import { Suspense } from 'react'

import { AuthLayout } from '@/components/lms/AuthLayout'

import { VerifyEmailStatus } from './_components/VerifyEmailStatus'

export default function VerifyEmailPage() {
  return (
    <AuthLayout imageAlt="Student celebrating" imageSide="left" imageSrc="/images/hero-image-2.png">
      <h1 className="mb-2 text-3xl font-bold tracking-normal text-brand-black md:text-4xl">
        Verify your email
      </h1>
      <p className="mb-8 text-sm text-brand-black/65">
        We&apos;re confirming your email address now.
      </p>
      <Suspense>
        <VerifyEmailStatus />
      </Suspense>
    </AuthLayout>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Verify email',
  }
}
