import type { PublicUser } from '@upkora/shared'

import { apiFetch } from '@/lib/api/server'

type MeResponse = {
  user?: PublicUser
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  try {
    const data = await apiFetch<MeResponse>('/api/v1/auth/me')
    return data.user ?? null
  } catch {
    return null
  }
}