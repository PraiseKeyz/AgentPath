import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import { AuthLayout } from '@/components/lms/AuthLayout'
import { getPayloadUser } from '@/lib/lms/getPayloadUser'

import { ResetPasswordForm } from './_components/ResetPasswordForm'

export const dynamic = 'force-dynamic'

export default async function ResetPasswordPage() {
  const user = await getPayloadUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <AuthLayout imageAlt="Student working on a laptop" imageSide="right" imageSrc="/images/person.png">
      <h1 className="mb-2 text-3xl font-bold tracking-normal text-brand-black md:text-4xl">
        Reset your password
      </h1>
      <p className="mb-8 text-sm text-brand-black/65">Choose a new password for your account.</p>
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Reset password',
  }
}
