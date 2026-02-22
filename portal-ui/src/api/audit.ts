import apiClient from './client'
import { AuditLog, PaginatedResponse } from '@/lib/types'

export const getAuditLog = async (
  page: number = 0,
  pageSize: number = 50,
  filters?: Record<string, any>
): Promise<PaginatedResponse<AuditLog>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...Object.entries(filters || {}).reduce((acc, [k, v]) => ({ ...acc, [k]: String(v) }), {}),
  })
  const response = await apiClient.get(`/audit?${params}`)
  return response.data
}

export const exportAuditLog = async (filters?: Record<string, any>): Promise<Blob> => {
  const params = new URLSearchParams(
    Object.entries(filters || {}).reduce((acc, [k, v]) => ({ ...acc, [k]: String(v) }), {})
  )
  const response = await apiClient.get(`/audit/export?${params}`, {
    responseType: 'blob',
  })
  return response.data
}
