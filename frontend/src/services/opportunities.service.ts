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
  const res = await clientFetch<{ data: { opportunities: Opportunity[] } }>(path)
  return res.data.opportunities
}

export async function getOpportunity(id: string): Promise<Opportunity> {
  const res = await clientFetch<{ data: { opportunity: Opportunity } }>(`/opportunities/${id}`)
  return res.data.opportunity
}
