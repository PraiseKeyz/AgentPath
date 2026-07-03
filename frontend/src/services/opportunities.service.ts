'use client'

import { clientFetch } from '@/lib/api/client'

export interface Opportunity {
  _id: string
  title: string
  description: string
  type: 'scholarship' | 'fellowship' | 'internship' | 'competition' | 'grant'
  provider: string
  deadline: string | null
  eligibility: string
  applicationUrl: string
  tags: string[]
  isActive: boolean
  source?: 'db' | 'mock'
}

const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    _id: 'mock-mastercard-foundation-scholars',
    title: 'Mastercard Foundation Scholars Program',
    description:
      'A sample scholarship entry for students comparing broad undergraduate and graduate funding options.',
    type: 'scholarship',
    provider: 'Mastercard Foundation',
    deadline: '2026-09-30T00:00:00.000Z',
    eligibility:
      'Academically strong African students with leadership potential and demonstrated financial need.',
    applicationUrl: 'https://mastercardfdn.org/all/scholars/',
    tags: ['undergraduate', 'graduate', 'africa', 'leadership'],
    isActive: true,
    source: 'mock',
  },
  {
    _id: 'mock-tech4dev-women-techsters',
    title: 'Women Techsters Fellowship',
    description:
      'A sample fellowship entry for students exploring structured technology training and mentorship.',
    type: 'fellowship',
    provider: 'Tech4Dev',
    deadline: null,
    eligibility: 'Women and girls across Africa interested in beginning or deepening a technology career.',
    applicationUrl: 'https://tech4dev.com/women-techsters/',
    tags: ['technology', 'fellowship', 'africa', 'career'],
    isActive: true,
    source: 'mock',
  },
]

function matchesParams(opportunity: Opportunity, params?: { type?: string; tag?: string; q?: string }) {
  if (params?.type && opportunity.type !== params.type) return false
  if (params?.tag && !opportunity.tags.includes(params.tag)) return false

  const query = params?.q?.trim().toLowerCase()
  if (!query) return true

  return [opportunity.title, opportunity.description, opportunity.provider, opportunity.eligibility].some((value) =>
    value.toLowerCase().includes(query),
  )
}

function withDbSource(opportunities: Opportunity[]): Opportunity[] {
  return opportunities.map((opportunity) => ({ ...opportunity, source: 'db' as const }))
}

function mergeOpportunities(dbOpportunities: Opportunity[], mockOpportunities: Opportunity[]) {
  const seen = new Set<string>()

  return [...withDbSource(dbOpportunities), ...mockOpportunities].filter((opportunity) => {
    const key = `${opportunity.title.toLowerCase()}|${opportunity.provider.toLowerCase()}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function isDbOpportunity(opportunity: Opportunity): boolean {
  return opportunity.source !== 'mock' && /^[a-f\d]{24}$/i.test(opportunity._id)
}

export async function getOpportunities(params?: {
  type?: string
  tag?: string
  q?: string
}): Promise<Opportunity[]> {
  const query = new URLSearchParams()
  if (params?.type) query.set('type', params.type)
  if (params?.tag) query.set('tag', params.tag)
  if (params?.q) query.set('q', params.q)

  const path = `/opportunities${query.toString() ? `?${query}` : ''}`
  const mockOpportunities = MOCK_OPPORTUNITIES.filter((opportunity) => matchesParams(opportunity, params))

  try {
    const res = await clientFetch<{ data: { opportunities: Opportunity[] } }>(path)
    return mergeOpportunities(res.data.opportunities, mockOpportunities)
  } catch {
    return mockOpportunities
  }
}

export async function getOpportunity(id: string): Promise<Opportunity> {
  const mockOpportunity = MOCK_OPPORTUNITIES.find((opportunity) => opportunity._id === id)
  if (mockOpportunity) return mockOpportunity

  const res = await clientFetch<{ data: { opportunity: Opportunity } }>(`/opportunities/${id}`)
  return { ...res.data.opportunity, source: 'db' }
}
