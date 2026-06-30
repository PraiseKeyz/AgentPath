import type { PublicUser } from '@upkora/shared'

export type PortalUser = {
  createdAt?: string
  email: string
  name?: string | null
  roles?: PublicUser['roles']
}

export function toPortalUser(user: PublicUser): PortalUser {
  return {
    createdAt: user.createdAt,
    email: user.email,
    name: user.name,
    roles: user.roles,
  }
}