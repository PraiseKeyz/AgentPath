/** Client-safe API helpers. Do not import next/headers here. */

// Next.js rewrites /api/v1/* → backend, so we use relative URLs (no CORS)
export function apiUrl(path: string): string {
  return `/api/v1${path}`
}

export async function clientFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const headers = new Headers(options.headers)
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(apiUrl(path), { ...options, headers })
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.message ?? `Request failed (${response.status})`)
  }

  return data as T
}