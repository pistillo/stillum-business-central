import apiClient from './client'
import { Tenant } from '@/lib/types'

export const getTenants = async (): Promise<Tenant[]> => {
  const response = await apiClient.get('/tenants')
  return response.data
}

export const getTenant = async (id: string): Promise<Tenant> => {
  const response = await apiClient.get(`/tenants/${id}`)
  return response.data
}

export const createTenant = async (data: {
  name: string
  slug: string
  description?: string
  maxUsers?: number
}): Promise<Tenant> => {
  const response = await apiClient.post('/tenants', data)
  return response.data
}

export const updateTenant = async (id: string, data: Partial<Tenant>): Promise<Tenant> => {
  const response = await apiClient.put(`/tenants/${id}`, data)
  return response.data
}
