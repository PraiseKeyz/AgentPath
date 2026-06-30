'use client'

import { clientFetch } from '@/lib/api/client'
import type { User } from './auth.service'

export async function updateProfile(data: Partial<User>): Promise<User> {
  const res = await clientFetch<{ data: { user: User } }>('/users/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
  return res.data.user
}

export interface OnboardingPayload {
  university: string
  courseOfStudy: string
  yearOfStudy: number
  goals: string[]
}

export async function completeOnboarding(payload: OnboardingPayload): Promise<User> {
  const res = await clientFetch<{ data: { user: User } }>('/users/onboarding', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return res.data.user
}
