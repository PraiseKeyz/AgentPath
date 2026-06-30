'use client'

import { clientFetch } from '@/lib/api/client'

export interface Milestone {
  _id: string
  title: string
  description: string
  opportunityId: string | null
  status: 'pending' | 'in_progress' | 'done'
  dueDate: string | null
  createdAt: string
}

export interface Roadmap {
  _id: string
  userId: string
  milestones: Milestone[]
  updatedAt: string
}

export async function getRoadmap(): Promise<Roadmap> {
  const res = await clientFetch<{ data: { roadmap: Roadmap } }>('/roadmap')
  return res.data.roadmap
}

export async function addMilestone(data: {
  title: string
  description?: string
  opportunityId?: string
  dueDate?: string
}): Promise<Roadmap> {
  const res = await clientFetch<{ data: { roadmap: Roadmap } }>('/roadmap/milestones', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return res.data.roadmap
}

export async function updateMilestone(
  id: string,
  data: { title?: string; description?: string; status?: Milestone['status']; dueDate?: string },
): Promise<Roadmap> {
  const res = await clientFetch<{ data: { roadmap: Roadmap } }>(`/roadmap/milestones/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
  return res.data.roadmap
}

export async function deleteMilestone(id: string): Promise<Roadmap> {
  const res = await clientFetch<{ data: { roadmap: Roadmap } }>(`/roadmap/milestones/${id}`, {
    method: 'DELETE',
  })
  return res.data.roadmap
}
