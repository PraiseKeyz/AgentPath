import 'server-only'
import { cookies, headers } from 'next/headers'

type ApiFetchOptions = RequestInit & {
  searchParams?: Record<string, string | number | undefined>
}

async function getServerApiBaseUrl() {
  try {
    const headersList = await headers()
    const host = headersList.get('x-forwarded-host') || headersList.get('host')

    if (host) {
      const protocol = headersList.get('x-forwarded-proto') || 'http'
      return `${protocol}://${host}`
    }
  } catch {
    // headers() is unavailable outside a request context.
  }

  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
}

async function requestApi<T>(
  path: string,
  options: ApiFetchOptions = {},
  cookieHeader?: string,
): Promise<T> {
  const { searchParams, headers: initHeaders, ...init } = options
  const requestHeaders = new Headers(initHeaders)

  if (cookieHeader) {
    requestHeaders.set('Cookie', cookieHeader)
  }

  if (!requestHeaders.has('Content-Type') && init.body) {
    requestHeaders.set('Content-Type', 'application/json')
  }

  const baseUrl = await getServerApiBaseUrl()
  const url = new URL(path, baseUrl)

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value != null) {
        url.searchParams.set(key, String(value))
      }
    }
  }

  const response = await fetch(url.toString(), {
    ...init,
    headers: requestHeaders,
    cache: 'no-store',
  })

  const rawBody = await response.text()
  let data: Record<string, unknown> = {}

  if (rawBody) {
    try {
      data = JSON.parse(rawBody) as Record<string, unknown>
    } catch {
      const snippet = rawBody.replace(/\s+/g, ' ').trim().slice(0, 120)
      throw new Error(
        `Request failed (${response.status}): ${snippet || response.statusText || 'Unexpected response.'}`,
      )
    }
  }

  if (!response.ok) {
    const message =
      typeof data.error === 'string'
        ? data.error
        : `Request failed (${response.status}${response.statusText ? ` ${response.statusText}` : ''}).`
    throw new Error(message)
  }

  return data as T
}

/** Public CMS requests — safe for build-time static generation. */
export async function publicApiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  return requestApi<T>(path, options)
}

/** Authenticated requests — forwards session cookies from the request. */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ')

  return requestApi<T>(path, options, cookieHeader || undefined)
}