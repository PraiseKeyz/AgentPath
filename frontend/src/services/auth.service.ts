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

function setSession(token: string) {
  localStorage.setItem('token', token)
  document.cookie = 'ap_session=1; path=/; max-age=604800; SameSite=Lax'
}

function clearSession() {
  localStorage.removeItem('token')
  document.cookie = 'ap_session=; path=/; max-age=0; SameSite=Lax'
}

export async function register(name: string, email: string, password: string): Promise<User> {
  const res = await clientFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
  setSession(res.data.accessToken)
  return res.data.user
}

export async function login(email: string, password: string): Promise<User> {
  const res = await clientFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setSession(res.data.accessToken)
  return res.data.user
}

export async function getMe(): Promise<User> {
  const res = await clientFetch<{ data: { user: User } }>('/auth/me')
  return res.data.user
}

export function logout() {
  clearSession()
}
