import type { PublicUser } from '@upkora/shared'

import { getCurrentUser } from '@/lib/lms/getCurrentUser'

export async function getPayloadUser(): Promise<PublicUser | null> {
  return getCurrentUser()
}