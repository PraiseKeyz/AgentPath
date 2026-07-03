'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getMe, logout as authLogout, User } from '@/services/auth.service'

export function useAuth() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    let active = true

    async function checkAuth() {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('No token found')
        }

        const currentUser = await getMe()
        if (active) {
          setUser(currentUser)
          setIsAuthenticated(true)

          // Redirect to onboarding if not onboarded and not already on onboarding page
          if (!currentUser.isOnboarded && pathname !== '/onboarding') {
            router.push('/onboarding')
          }
        }
      } catch (err) {
        if (active) {
          setUser(null)
          setIsAuthenticated(false)
          if (pathname !== '/login' && pathname !== '/register' && pathname !== '/') {
            router.push('/login')
          }
        }
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    checkAuth()

    return () => {
      active = false
    }
  }, [pathname, router])

  function handleLogout() {
    authLogout()
    setUser(null)
    setIsAuthenticated(false)
    router.push('/login')
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    logout: handleLogout,
  }
}
