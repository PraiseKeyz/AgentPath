import type { AdminDashboardData } from '@upkora/shared'

import { apiFetch } from '@/lib/api/server'

type DashboardResponse = { data: AdminDashboardData }

export async function getDashboardData(): Promise<AdminDashboardData> {
  const result = await apiFetch<DashboardResponse>('/api/v1/admin/dashboard')
  return result.data
}