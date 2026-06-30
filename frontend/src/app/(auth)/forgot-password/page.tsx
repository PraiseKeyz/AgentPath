import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { AuthLayout } from '@/components/lms/AuthLayout'
import { getPayloadUser } from '@/lib/lms/getPayloadUser'

import { ForgotPasswordForm } from './_components/ForgotPasswordForm'

export const dynamic = 'force-dynamic'

export default async function ForgotPasswordPage() {
  const user = await getPayloadUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <AuthLayout imageAlt="Student reviewing course notes" imageSide="left" imageSrc="/images/programmes-hero.png">
      <h1 className="mb-2 text-3xl font-bold tracking-normal text-brand-black md:text-4xl">
        Forgot your password?
      </h1>
      <p className="mb-8 text-sm text-brand-black/65">
        Enter your email and we&apos;ll send you a link to reset it.
      </p>
      <ForgotPasswordForm />
    </AuthLayout>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Forgot password',
  }
}
