'use client'

import { clientFetch } from '@/lib/api/client'

export interface User {
  id: string
  name: string
  email: string
  university: string
  courseOfStudy: string
  yearOfStudy: number
  goals: string[]
  isOnboarded: boolean
  createdAt: string
}

interface AuthResponse {
  data: { user: User; accessToken: string }
}

export async function register(name: string, email: string, password: string): Promise<User> {
  const res = await clientFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
  localStorage.setItem('token', res.data.accessToken)
  return res.data.user
}

export async function login(email: string, password: string): Promise<User> {
  const res = await clientFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  localStorage.setItem('token', res.data.accessToken)
  return res.data.user
}

export async function getMe(): Promise<User> {
  const res = await clientFetch<{ data: { user: User } }>('/auth/me')
  return res.data.user
}

export function logout() {
  localStorage.removeItem('token')
}
